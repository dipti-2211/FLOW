// ============================================================================
// Nodal API Endpoints Documentation
// ============================================================================
// Complete list of API routes for the DSA Tracker & Social Hub
// ============================================================================

/**
 * ============================================================================
 * AUTHENTICATION (Handled by Clerk)
 * ============================================================================
 */

// Clerk handles these automatically via middleware:
// POST   /api/auth/sign-in          - Sign in user
// POST   /api/auth/sign-up          - Register new user
// POST   /api/auth/sign-out         - Sign out user
// GET    /api/auth/user             - Get current user
// POST   /api/auth/webhook          - Clerk webhook for user sync

/**
 * ============================================================================
 * USER PROFILE APIs
 * ============================================================================
 */

export const USER_ENDPOINTS = {
  // Profile Management
  "GET    /api/users/me": "Get current user profile",
  "PATCH  /api/users/me": "Update current user profile",
  "GET    /api/users/:username": "Get user profile by username",
  "GET    /api/users/:username/stats": "Get user statistics",
  "POST   /api/users/:username/view": "Record profile view",

  // Trophy Room / Gamification
  "GET    /api/users/me/badges": "Get user's earned badges",
  "GET    /api/users/me/achievements": "Get achievement progress",
  "POST   /api/users/me/badges/:badgeId/display": "Toggle badge display",

  // External Platform Linking
  "POST   /api/users/me/link/leetcode": "Link LeetCode account",
  "POST   /api/users/me/link/codeforces": "Link Codeforces account",
  "DELETE /api/users/me/link/:platform": "Unlink external account",
  "POST   /api/users/me/sync": "Trigger manual sync of external platforms",
};

/**
 * ============================================================================
 * PROBLEM TRACKING APIs
 * ============================================================================
 */

export const PROBLEM_ENDPOINTS = {
  // Problem CRUD
  "GET    /api/problems": "List all problems (with filters)",
  "POST   /api/problems": "Add a new problem",
  "GET    /api/problems/:id": "Get problem details",
  "PATCH  /api/problems/:id": "Update problem",
  "DELETE /api/problems/:id": "Delete problem",

  // Problem Status
  "POST   /api/problems/:id/solve": "Mark problem as solved",
  "POST   /api/problems/:id/attempt": "Record an attempt",
  "PATCH  /api/problems/:id/status": "Update problem status",

  // Bookmarks & Favorites
  "POST   /api/problems/:id/bookmark": "Toggle bookmark",
  "POST   /api/problems/:id/star": "Toggle star/favorite",
  "GET    /api/problems/bookmarked": "Get bookmarked problems",

  // Search & Filter
  "GET    /api/problems/search": "Search problems",
  "GET    /api/problems/topics": "Get all topics",
  "GET    /api/problems/companies": "Get all companies",
  "GET    /api/problems/by-topic/:topic": "Get problems by topic",
  "GET    /api/problems/by-difficulty/:diff": "Get problems by difficulty",
};

/**
 * ============================================================================
 * SPACED REPETITION / REVISION APIs
 * ============================================================================
 */

export const REVISION_ENDPOINTS = {
  // Review Queue
  "GET    /api/revision/due": "Get problems due for review",
  "GET    /api/revision/upcoming": "Get upcoming reviews (next 7 days)",
  "GET    /api/revision/stats": "Get revision statistics",

  // Review Actions
  "POST   /api/revision/:userProblemId/review": "Submit a review",
  "POST   /api/revision/:userProblemId/skip": "Skip a review (reschedule)",
  "POST   /api/revision/:userProblemId/schedule": "Manually schedule review",

  // Settings
  "GET    /api/revision/settings": "Get revision settings",
  "PATCH  /api/revision/settings": "Update revision settings",
};

/**
 * ============================================================================
 * APPROACH JOURNAL APIs
 * ============================================================================
 */

export const APPROACH_ENDPOINTS = {
  // Approach CRUD
  "GET    /api/approaches": "List user's approaches",
  "POST   /api/approaches": "Create new approach",
  "GET    /api/approaches/:id": "Get approach details",
  "PATCH  /api/approaches/:id": "Update approach",
  "DELETE /api/approaches/:id": "Delete approach",

  // Public Approaches
  "GET    /api/approaches/public": "Browse public approaches",
  "GET    /api/approaches/problem/:problemId": "Get approaches for a problem",
  "GET    /api/approaches/trending": "Get trending approaches",

  // Social Actions
  "POST   /api/approaches/:id/upvote": "Upvote an approach",
  "DELETE /api/approaches/:id/upvote": "Remove upvote",
  "POST   /api/approaches/:id/comment": "Add comment",
  "GET    /api/approaches/:id/comments": "Get comments",
};

/**
 * ============================================================================
 * SOCIAL GRAPH APIs
 * ============================================================================
 */

export const SOCIAL_ENDPOINTS = {
  // Following
  "POST   /api/social/follow/:userId": "Follow a user",
  "DELETE /api/social/follow/:userId": "Unfollow a user",
  "GET    /api/social/followers": "Get my followers",
  "GET    /api/social/following": "Get users I follow",
  "GET    /api/social/:username/followers": "Get user's followers",
  "GET    /api/social/:username/following": "Get user's following",

  // Activity Feed
  "GET    /api/social/feed": "Get personalized activity feed",
  "GET    /api/social/feed/global": "Get global activity feed",
  "GET    /api/social/:username/activity": "Get user's activity",

  // Leaderboard
  "GET    /api/social/leaderboard": "Get global leaderboard",
  "GET    /api/social/leaderboard/weekly": "Get weekly leaderboard",
  "GET    /api/social/leaderboard/topic/:topic": "Get topic leaderboard",
};

/**
 * ============================================================================
 * MESSAGING & CHAT APIs
 * ============================================================================
 */

export const MESSAGING_ENDPOINTS = {
  // Chat Rooms
  "GET    /api/rooms": "List available rooms",
  "POST   /api/rooms": "Create a new room",
  "GET    /api/rooms/:roomId": "Get room details",
  "POST   /api/rooms/:roomId/join": "Join a room",
  "POST   /api/rooms/:roomId/leave": "Leave a room",
  "GET    /api/rooms/:roomId/messages": "Get room messages (paginated)",
  "POST   /api/rooms/:roomId/messages": "Send a message to room",

  // Direct Messages
  "GET    /api/messages": "Get DM conversations",
  "GET    /api/messages/:userId": "Get DM thread with user",
  "POST   /api/messages/:userId": "Send DM to user",
  "PATCH  /api/messages/:messageId/read": "Mark message as read",

  // Topic Rooms (Auto-generated)
  "GET    /api/rooms/topic/:topic": "Get/Create topic room",
};

/**
 * ============================================================================
 * NOTIFICATION APIs
 * ============================================================================
 */

export const NOTIFICATION_ENDPOINTS = {
  "GET    /api/notifications": "Get notifications (paginated)",
  "GET    /api/notifications/unread-count": "Get unread count",
  "PATCH  /api/notifications/:id/read": "Mark as read",
  "POST   /api/notifications/read-all": "Mark all as read",
  "DELETE /api/notifications/:id": "Delete notification",
  "GET    /api/notifications/settings": "Get notification preferences",
  "PATCH  /api/notifications/settings": "Update preferences",
};

/**
 * ============================================================================
 * DASHBOARD & ANALYTICS APIs
 * ============================================================================
 */

export const DASHBOARD_ENDPOINTS = {
  // Overview
  "GET    /api/dashboard": "Get dashboard overview data",
  "GET    /api/dashboard/stats": "Get detailed statistics",

  // Activity
  "GET    /api/dashboard/activity": "Get activity heatmap data",
  "GET    /api/dashboard/streak": "Get streak information",

  // Progress
  "GET    /api/dashboard/progress": "Get overall progress",
  "GET    /api/dashboard/progress/topics": "Get progress by topic",
  "GET    /api/dashboard/progress/difficulty": "Get progress by difficulty",

  // Charts
  "GET    /api/dashboard/charts/submissions": "Get submission history",
  "GET    /api/dashboard/charts/difficulty": "Get difficulty distribution",
  "GET    /api/dashboard/charts/topics": "Get topic breakdown",
};

/**
 * ============================================================================
 * SYNC & CRON JOBS APIs (Internal)
 * ============================================================================
 */

export const SYNC_ENDPOINTS = {
  // External Platform Sync (called by cron)
  "POST   /api/sync/leetcode": "Sync LeetCode submissions",
  "POST   /api/sync/codeforces": "Sync Codeforces submissions",
  "GET    /api/sync/status/:jobId": "Get sync job status",

  // Review Reminders (called by cron)
  "POST   /api/cron/review-reminders": "Send review reminder notifications",
  "POST   /api/cron/streak-warnings": "Send streak warning notifications",

  // Cleanup (called by cron)
  "POST   /api/cron/cleanup-old-activities": "Clean up old activity records",
};

/**
 * ============================================================================
 * WEBHOOK APIs
 * ============================================================================
 */

export const WEBHOOK_ENDPOINTS = {
  "POST   /api/webhooks/clerk": "Clerk user sync webhook",
  "POST   /api/webhooks/stripe": "Stripe payment webhook (if premium)",
};

// ============================================================================
// Export all endpoints for documentation
// ============================================================================

export const ALL_ENDPOINTS = {
  authentication: "Handled by Clerk middleware",
  user: USER_ENDPOINTS,
  problems: PROBLEM_ENDPOINTS,
  revision: REVISION_ENDPOINTS,
  approaches: APPROACH_ENDPOINTS,
  social: SOCIAL_ENDPOINTS,
  messaging: MESSAGING_ENDPOINTS,
  notifications: NOTIFICATION_ENDPOINTS,
  dashboard: DASHBOARD_ENDPOINTS,
  sync: SYNC_ENDPOINTS,
  webhooks: WEBHOOK_ENDPOINTS,
};

export default ALL_ENDPOINTS;
