// ============================================================================
// GET /api/revision/due - Get Problems Due for Review
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import {
  calculateUrgency,
  sortByUrgency,
} from "@/lib/spaced-repetition-service";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const includeUpcoming = searchParams.get("upcoming") === "true";
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");

    const now = new Date();

    // Build where clause
    const whereClause: any = {
      user: { clerkId: userId },
      nextReviewAt: { not: null },
    };

    // If not including upcoming, only get due/overdue
    if (!includeUpcoming) {
      whereClause.nextReviewAt = { lte: now };
    }

    // Optional filters
    if (topic) {
      whereClause.problem = {
        ...whereClause.problem,
        topics: { some: { topic: { slug: topic } } },
      };
    }

    if (difficulty) {
      whereClause.problem = {
        ...whereClause.problem,
        difficulty: difficulty.toUpperCase(),
      };
    }

    // Fetch problems due for review
    const userProblems = await prisma.userProblem.findMany({
      where: whereClause,
      include: {
        problem: {
          include: {
            topics: {
              include: { topic: true },
            },
          },
        },
      },
      orderBy: { nextReviewAt: "asc" },
      take: limit,
    });

    // Transform and add urgency
    const problemsWithUrgency = userProblems.map((up) => {
      const { daysOverdue, urgency } = calculateUrgency(up.nextReviewAt!);

      return {
        id: up.problem.id,
        userProblemId: up.id,
        title: up.problem.title,
        difficulty: up.problem.difficulty,
        platform: up.problem.platform,
        url: up.problem.url,
        topics: up.problem.topics.map((pt) => pt.topic.name),

        // Review state
        easeFactor: up.easeFactor,
        interval: up.interval,
        repetitions: up.repetitions,
        nextReviewAt: up.nextReviewAt,
        lastReviewedAt: up.lastReviewedAt,

        // Urgency
        daysOverdue,
        urgency,

        // User notes
        personalNotes: up.personalNotes,
      };
    });

    // Separate into due/overdue and upcoming
    const due = problemsWithUrgency.filter(
      (p) => p.daysOverdue >= 0 && p.urgency !== "low",
    );
    const upcoming = problemsWithUrgency.filter((p) => p.urgency === "low");

    // Get stats
    const stats = {
      totalDue: due.length,
      critical: due.filter((p) => p.urgency === "critical").length,
      high: due.filter((p) => p.urgency === "high").length,
      medium: due.filter((p) => p.urgency === "medium").length,
      upcomingCount: upcoming.length,
    };

    return NextResponse.json({
      due: sortByUrgency(due),
      upcoming: includeUpcoming ? upcoming : undefined,
      stats,
    });
  } catch (error) {
    console.error("Error fetching revision due:", error);
    return NextResponse.json(
      { error: "Failed to fetch revision data" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/revision/due - Submit a Review
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userProblemId, quality, responseTime, notes } = body;

    if (!userProblemId || quality === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: userProblemId, quality" },
        { status: 400 },
      );
    }

    if (quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "Quality must be between 0 and 5" },
        { status: 400 },
      );
    }

    // Get current state
    const userProblem = await prisma.userProblem.findFirst({
      where: {
        id: userProblemId,
        user: { clerkId: userId },
      },
    });

    if (!userProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Import algorithm
    const { processReview } = await import("@/lib/spaced-repetition-service");

    const currentState = {
      easeFactor: userProblem.easeFactor,
      interval: userProblem.interval,
      repetitions: userProblem.repetitions,
      nextReviewAt: userProblem.nextReviewAt!,
      lastReviewedAt: userProblem.lastReviewedAt,
    };

    // Process the review
    const result = processReview(currentState, { quality, responseTime });

    // Update in database (transaction)
    const [updatedProblem, review] = await prisma.$transaction([
      // Update UserProblem
      prisma.userProblem.update({
        where: { id: userProblemId },
        data: {
          easeFactor: result.newState.easeFactor,
          interval: result.newState.interval,
          repetitions: result.newState.repetitions,
          nextReviewAt: result.newState.nextReviewAt,
          lastReviewedAt: result.newState.lastReviewedAt,
          personalNotes: notes || userProblem.personalNotes,
        },
      }),

      // Create Review record
      prisma.review.create({
        data: {
          userId: userProblem.userId,
          userProblemId,
          quality,
          responseTime,
          prevEaseFactor: currentState.easeFactor,
          prevInterval: currentState.interval,
          prevRepetitions: currentState.repetitions,
          newEaseFactor: result.newState.easeFactor,
          newInterval: result.newState.interval,
          newRepetitions: result.newState.repetitions,
          reviewNotes: notes,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      result: {
        wasSuccessful: result.wasSuccessful,
        newInterval: result.newState.interval,
        nextReviewAt: result.newState.nextReviewAt,
        message: result.message,
      },
    });
  } catch (error) {
    console.error("Error processing review:", error);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 },
    );
  }
}
