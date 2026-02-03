// ============================================================================
// Spaced Repetition Service - SM-2 Algorithm Implementation
// ============================================================================
// Implements the SuperMemo SM-2 algorithm with custom modifications
// for DSA problem revision scheduling.
// ============================================================================

import { UserDifficulty } from "@prisma/client";

// ============================================================================
// Types
// ============================================================================

export interface RevisionState {
  easeFactor: number; // EF: 1.3 - 2.5 (affects interval growth)
  interval: number; // Days until next review
  repetitions: number; // Successful review count
  nextReviewAt: Date;
  lastReviewedAt: Date | null;
}

export interface ReviewInput {
  quality: number; // 0-5 rating (SM-2 scale)
  responseTime?: number; // Seconds to recall (optional bonus)
}

export interface ReviewResult {
  newState: RevisionState;
  wasSuccessful: boolean;
  intervalChange: number;
  message: string;
}

export interface ProblemDueForReview {
  id: string;
  userProblemId: string;
  title: string;
  difficulty: string;
  topic: string;
  platform: string;
  daysOverdue: number;
  urgency: "critical" | "high" | "medium" | "low";
  lastReviewedAt: Date | null;
  nextReviewAt: Date;
}

// ============================================================================
// Configuration
// ============================================================================

export const SM2_CONFIG = {
  MIN_EF: 1.3, // Minimum easiness factor
  MAX_EF: 2.5, // Maximum easiness factor
  DEFAULT_EF: 2.5, // Starting easiness factor
  MIN_QUALITY: 3, // Minimum quality for successful review
  INITIAL_INTERVAL: 1, // First interval (days)
  SECOND_INTERVAL: 6, // Second interval (days)
} as const;

// Custom interval presets for DSA learning
export const INTERVAL_PRESETS = {
  // Standard SM-2 based progression
  standard: [1, 6, 14, 30, 60, 120, 180],

  // Aggressive for interview prep (1-2 months)
  interview: [1, 2, 4, 7, 14, 21, 30],

  // Conservative for long-term retention
  mastery: [1, 3, 7, 14, 30, 60, 90, 120, 180, 365],
} as const;

// ============================================================================
// Core SM-2 Algorithm
// ============================================================================

/**
 * Calculate new easiness factor based on quality rating
 *
 * Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 *
 * @param currentEF Current easiness factor
 * @param quality Quality rating 0-5
 * @returns New easiness factor (clamped to 1.3-2.5)
 */
export function calculateEaseFactor(
  currentEF: number,
  quality: number,
): number {
  const q = Math.min(5, Math.max(0, quality));
  const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  let newEF = currentEF + efDelta;

  // Clamp to valid range
  newEF = Math.max(SM2_CONFIG.MIN_EF, newEF);
  newEF = Math.min(SM2_CONFIG.MAX_EF, newEF);

  return Math.round(newEF * 100) / 100;
}

/**
 * Calculate next review interval based on SM-2 algorithm
 *
 * Rules:
 * - If quality < 3: Reset to beginning (interval = 1)
 * - If repetitions = 0: interval = 1
 * - If repetitions = 1: interval = 6
 * - If repetitions > 1: interval = previousInterval * EF
 *
 * @param repetitions Current successful repetition count
 * @param easeFactor Current easiness factor
 * @param currentInterval Current interval in days
 * @param quality Review quality 0-5
 * @returns New interval in days
 */
export function calculateInterval(
  repetitions: number,
  easeFactor: number,
  currentInterval: number,
  quality: number,
): number {
  // Failed review - reset to beginning
  if (quality < SM2_CONFIG.MIN_QUALITY) {
    return SM2_CONFIG.INITIAL_INTERVAL;
  }

  let newInterval: number;

  if (repetitions === 0) {
    newInterval = SM2_CONFIG.INITIAL_INTERVAL;
  } else if (repetitions === 1) {
    newInterval = SM2_CONFIG.SECOND_INTERVAL;
  } else {
    newInterval = Math.round(currentInterval * easeFactor);
  }

  // Cap maximum interval at 180 days
  return Math.min(newInterval, 180);
}

/**
 * Process a review and return the new revision state
 */
export function processReview(
  currentState: RevisionState,
  input: ReviewInput,
): ReviewResult {
  const { quality } = input;
  const now = new Date();

  // Determine if review was successful
  const wasSuccessful = quality >= SM2_CONFIG.MIN_QUALITY;

  // Calculate new easiness factor
  const newEF = calculateEaseFactor(currentState.easeFactor, quality);

  // Calculate new repetitions (reset on failure)
  const newRepetitions = wasSuccessful ? currentState.repetitions + 1 : 0;

  // Calculate new interval
  const newInterval = calculateInterval(
    currentState.repetitions,
    newEF,
    currentState.interval,
    quality,
  );

  // Calculate next review date
  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  // Build result
  const newState: RevisionState = {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewAt,
    lastReviewedAt: now,
  };

  const intervalChange = newInterval - currentState.interval;

  let message: string;
  if (!wasSuccessful) {
    message = "Review failed. Resetting to initial interval.";
  } else if (intervalChange > 0) {
    message = `Great! Next review in ${newInterval} days.`;
  } else {
    message = `Keep practicing! Next review in ${newInterval} days.`;
  }

  return {
    newState,
    wasSuccessful,
    intervalChange,
    message,
  };
}

// ============================================================================
// Quality Rating Helpers
// ============================================================================

/**
 * SM-2 Quality Scale:
 * 5 - Perfect response, no hesitation
 * 4 - Correct response after slight hesitation
 * 3 - Correct response with serious difficulty
 * 2 - Wrong response, but recalled when shown answer
 * 1 - Wrong response, vague memory of answer
 * 0 - Complete blackout, no memory at all
 */

/**
 * Map user difficulty rating to SM-2 quality score
 */
export function difficultyToQuality(difficulty: UserDifficulty): number {
  const mapping: Record<UserDifficulty, number> = {
    TRIVIAL: 5, // Perfect recall
    EASY: 4, // Good recall
    MEDIUM: 3, // Struggled but got it
    HARD: 2, // Needed hints
    IMPOSSIBLE: 1, // Couldn't solve
  };
  return mapping[difficulty];
}

/**
 * Quality descriptions for UI
 */
export const QUALITY_LABELS: Record<
  number,
  { label: string; description: string; color: string }
> = {
  5: {
    label: "Perfect",
    description: "Instant recall, no hesitation",
    color: "text-emerald-500",
  },
  4: {
    label: "Good",
    description: "Correct with slight hesitation",
    color: "text-green-500",
  },
  3: {
    label: "Okay",
    description: "Correct but struggled",
    color: "text-yellow-500",
  },
  2: {
    label: "Hard",
    description: "Wrong, but remembered when shown",
    color: "text-orange-500",
  },
  1: {
    label: "Forgot",
    description: "Vague memory only",
    color: "text-red-400",
  },
  0: {
    label: "Blackout",
    description: "No memory at all",
    color: "text-red-600",
  },
};

// ============================================================================
// Initial State
// ============================================================================

/**
 * Create initial revision state for a newly solved problem
 */
export function createInitialState(): RevisionState {
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + SM2_CONFIG.INITIAL_INTERVAL);

  return {
    easeFactor: SM2_CONFIG.DEFAULT_EF,
    interval: SM2_CONFIG.INITIAL_INTERVAL,
    repetitions: 0,
    nextReviewAt: nextReview,
    lastReviewedAt: null,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate urgency based on how overdue a review is
 */
export function calculateUrgency(
  nextReviewAt: Date,
  now: Date = new Date(),
): { daysOverdue: number; urgency: "critical" | "high" | "medium" | "low" } {
  const diffMs = now.getTime() - nextReviewAt.getTime();
  const daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let urgency: "critical" | "high" | "medium" | "low";

  if (daysOverdue >= 7) {
    urgency = "critical";
  } else if (daysOverdue >= 3) {
    urgency = "high";
  } else if (daysOverdue >= 0) {
    urgency = "medium";
  } else {
    urgency = "low";
  }

  return { daysOverdue: Math.max(0, daysOverdue), urgency };
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} week(s)`;
  if (days < 365) return `${Math.floor(days / 30)} month(s)`;
  return `${Math.floor(days / 365)} year(s)`;
}

/**
 * Get problems due for review from a list
 */
export function filterDueProblems<T extends { nextReviewAt: Date | null }>(
  problems: T[],
  now: Date = new Date(),
): T[] {
  return problems.filter((p) => p.nextReviewAt && p.nextReviewAt <= now);
}

/**
 * Sort problems by urgency (most urgent first)
 */
export function sortByUrgency<T extends { nextReviewAt: Date }>(
  problems: T[],
): T[] {
  return [...problems].sort(
    (a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime(),
  );
}

// ============================================================================
// Statistics
// ============================================================================

export interface RevisionStats {
  totalScheduled: number;
  dueToday: number;
  overdue: number;
  upcoming7Days: number;
  avgEaseFactor: number;
  avgInterval: number;
  masteredCount: number; // interval >= 30 days
  retentionRate: number; // % of successful reviews
}

export function calculateRevisionStats(
  revisionStates: RevisionState[],
  reviewHistory: { wasSuccessful: boolean }[],
): RevisionStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);

  let dueToday = 0;
  let overdue = 0;
  let upcoming7Days = 0;
  let masteredCount = 0;
  let totalEF = 0;
  let totalInterval = 0;

  for (const state of revisionStates) {
    const reviewDate = new Date(state.nextReviewAt);

    if (reviewDate < today) {
      overdue++;
    } else if (reviewDate <= today) {
      dueToday++;
    }

    if (reviewDate <= in7Days) {
      upcoming7Days++;
    }

    if (state.interval >= 30) {
      masteredCount++;
    }

    totalEF += state.easeFactor;
    totalInterval += state.interval;
  }

  const successfulReviews = reviewHistory.filter((r) => r.wasSuccessful).length;
  const retentionRate =
    reviewHistory.length > 0
      ? (successfulReviews / reviewHistory.length) * 100
      : 0;

  return {
    totalScheduled: revisionStates.length,
    dueToday,
    overdue,
    upcoming7Days,
    avgEaseFactor:
      revisionStates.length > 0
        ? Math.round((totalEF / revisionStates.length) * 100) / 100
        : SM2_CONFIG.DEFAULT_EF,
    avgInterval:
      revisionStates.length > 0
        ? Math.round(totalInterval / revisionStates.length)
        : 0,
    masteredCount,
    retentionRate: Math.round(retentionRate),
  };
}

// ============================================================================
// Export everything
// ============================================================================

export default {
  processReview,
  createInitialState,
  calculateEaseFactor,
  calculateInterval,
  calculateUrgency,
  calculateRevisionStats,
  difficultyToQuality,
  formatInterval,
  filterDueProblems,
  sortByUrgency,
  SM2_CONFIG,
  INTERVAL_PRESETS,
  QUALITY_LABELS,
};
