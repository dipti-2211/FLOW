// ============================================================================
// External Platform Sync Worker
// ============================================================================
// Fetches solved problems from LeetCode and Codeforces APIs
// Can be run as a cron job or triggered manually
// ============================================================================

import { prisma } from "@/lib/prisma";

// ============================================================================
// Types
// ============================================================================

interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  status: string;
  timestamp: number;
}

interface CodeforcesSubmission {
  id: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
  };
  verdict: string;
  creationTimeSeconds: number;
}

interface SyncResult {
  platform: string;
  success: boolean;
  problemsSynced: number;
  errors: string[];
}

// ============================================================================
// LeetCode Sync
// ============================================================================

async function fetchLeetCodeSubmissions(
  username: string,
): Promise<LeetCodeSubmission[]> {
  // Note: LeetCode doesn't have an official public API
  // This uses the GraphQL endpoint that their website uses
  // In production, you might want to use a scraping service or unofficial API

  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username, limit: 100 },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.recentAcSubmissionList || [];
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    return [];
  }
}

async function fetchLeetCodeProblemDetails(titleSlug: string) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        difficulty
        topicTags {
          name
          slug
        }
        companyTags {
          name
          slug
        }
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { titleSlug },
      }),
    });

    const data = await response.json();
    return data.data?.question;
  } catch (error) {
    console.error(`Error fetching LeetCode problem ${titleSlug}:`, error);
    return null;
  }
}

export async function syncLeetCode(
  userId: string,
  leetcodeHandle: string,
): Promise<SyncResult> {
  const result: SyncResult = {
    platform: "LEETCODE",
    success: false,
    problemsSynced: 0,
    errors: [],
  };

  try {
    // Fetch recent submissions
    const submissions = await fetchLeetCodeSubmissions(leetcodeHandle);

    if (submissions.length === 0) {
      result.errors.push("No submissions found or unable to fetch");
      return result;
    }

    // Process each submission
    for (const submission of submissions) {
      try {
        // Check if problem exists in our DB
        let problem = await prisma.problem.findFirst({
          where: {
            platform: "LEETCODE",
            slug: submission.titleSlug,
          },
        });

        // If not, fetch details and create it
        if (!problem) {
          const details = await fetchLeetCodeProblemDetails(
            submission.titleSlug,
          );

          if (details) {
            problem = await prisma.problem.create({
              data: {
                externalId: details.questionId,
                platform: "LEETCODE",
                title: details.title,
                slug: details.titleSlug,
                url: `https://leetcode.com/problems/${details.titleSlug}/`,
                difficulty: details.difficulty.toUpperCase() as
                  | "EASY"
                  | "MEDIUM"
                  | "HARD",
              },
            });

            // Create topic associations
            if (details.topicTags) {
              for (const tag of details.topicTags) {
                const topic = await prisma.topic.upsert({
                  where: { slug: tag.slug },
                  update: {},
                  create: { name: tag.name, slug: tag.slug },
                });

                await prisma.problemTopic
                  .create({
                    data: { problemId: problem.id, topicId: topic.id },
                  })
                  .catch(() => {}); // Ignore if already exists
              }
            }
          }
        }

        if (problem) {
          // Create or update UserProblem
          const existingUserProblem = await prisma.userProblem.findUnique({
            where: {
              userId_problemId: {
                userId,
                problemId: problem.id,
              },
            },
          });

          if (!existingUserProblem) {
            // Create new UserProblem with initial spaced repetition state
            await prisma.userProblem.create({
              data: {
                userId,
                problemId: problem.id,
                status: "SOLVED",
                solvedAt: new Date(submission.timestamp * 1000),
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              },
            });
            result.problemsSynced++;
          }
        }
      } catch (error) {
        result.errors.push(`Failed to sync problem: ${submission.title}`);
      }
    }

    result.success = true;
  } catch (error) {
    result.errors.push(`Sync failed: ${error}`);
  }

  return result;
}

// ============================================================================
// Codeforces Sync
// ============================================================================

async function fetchCodeforcesSubmissions(
  handle: string,
): Promise<CodeforcesSubmission[]> {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`,
    );

    if (!response.ok) {
      throw new Error(`Codeforces API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(data.comment || "Unknown Codeforces error");
    }

    // Filter only accepted submissions
    return data.result.filter((s: CodeforcesSubmission) => s.verdict === "OK");
  } catch (error) {
    console.error("Codeforces fetch error:", error);
    return [];
  }
}

function getCodeforcesDifficulty(rating?: number): "EASY" | "MEDIUM" | "HARD" {
  if (!rating || rating < 1200) return "EASY";
  if (rating < 1800) return "MEDIUM";
  return "HARD";
}

export async function syncCodeforces(
  userId: string,
  codeforcesHandle: string,
): Promise<SyncResult> {
  const result: SyncResult = {
    platform: "CODEFORCES",
    success: false,
    problemsSynced: 0,
    errors: [],
  };

  try {
    const submissions = await fetchCodeforcesSubmissions(codeforcesHandle);

    if (submissions.length === 0) {
      result.errors.push("No submissions found or unable to fetch");
      return result;
    }

    // Deduplicate by problem (user might have multiple accepted submissions)
    const uniqueProblems = new Map<string, CodeforcesSubmission>();
    for (const sub of submissions) {
      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!uniqueProblems.has(key)) {
        uniqueProblems.set(key, sub);
      }
    }

    for (const [key, submission] of uniqueProblems) {
      try {
        const externalId = key;

        // Check if problem exists
        let problem = await prisma.problem.findFirst({
          where: {
            platform: "CODEFORCES",
            externalId,
          },
        });

        if (!problem) {
          problem = await prisma.problem.create({
            data: {
              externalId,
              platform: "CODEFORCES",
              title: submission.problem.name,
              url: `https://codeforces.com/problemset/problem/${submission.problem.contestId}/${submission.problem.index}`,
              difficulty: getCodeforcesDifficulty(submission.problem.rating),
            },
          });
        }

        // Create UserProblem if not exists
        const existingUserProblem = await prisma.userProblem.findUnique({
          where: {
            userId_problemId: {
              userId,
              problemId: problem.id,
            },
          },
        });

        if (!existingUserProblem) {
          await prisma.userProblem.create({
            data: {
              userId,
              problemId: problem.id,
              status: "SOLVED",
              solvedAt: new Date(submission.creationTimeSeconds * 1000),
              easeFactor: 2.5,
              interval: 1,
              repetitions: 0,
              nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          });
          result.problemsSynced++;
        }
      } catch (error) {
        result.errors.push(
          `Failed to sync problem: ${submission.problem.name}`,
        );
      }
    }

    result.success = true;
  } catch (error) {
    result.errors.push(`Sync failed: ${error}`);
  }

  return result;
}

// ============================================================================
// Main Sync Function (for cron job)
// ============================================================================

export async function runSyncForAllUsers(): Promise<void> {
  console.log("Starting scheduled sync for all users...");

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { leetcodeHandle: { not: null } },
        { codeforcesHandle: { not: null } },
      ],
    },
    select: {
      id: true,
      leetcodeHandle: true,
      codeforcesHandle: true,
    },
  });

  for (const user of users) {
    try {
      // Create sync job record
      const syncJob = await prisma.syncJob.create({
        data: {
          userId: user.id,
          platform: "LEETCODE",
          status: "IN_PROGRESS",
        },
      });

      let totalSynced = 0;
      const errors: string[] = [];

      // Sync LeetCode
      if (user.leetcodeHandle) {
        const lcResult = await syncLeetCode(user.id, user.leetcodeHandle);
        totalSynced += lcResult.problemsSynced;
        errors.push(...lcResult.errors);
      }

      // Sync Codeforces
      if (user.codeforcesHandle) {
        const cfResult = await syncCodeforces(user.id, user.codeforcesHandle);
        totalSynced += cfResult.problemsSynced;
        errors.push(...cfResult.errors);
      }

      // Update sync job
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: errors.length > 0 ? "FAILED" : "COMPLETED",
          problemsSynced: totalSynced,
          errorMessage: errors.join("; ") || null,
          completedAt: new Date(),
        },
      });

      // Update user's last sync time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastSyncAt: new Date() },
      });

      console.log(`Synced ${totalSynced} problems for user ${user.id}`);
    } catch (error) {
      console.error(`Sync failed for user ${user.id}:`, error);
    }
  }

  console.log("Sync completed for all users");
}

// ============================================================================
// Export
// ============================================================================

export default {
  syncLeetCode,
  syncCodeforces,
  runSyncForAllUsers,
};
