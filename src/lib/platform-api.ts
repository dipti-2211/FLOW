// ============================================================================
// LeetCode & GFG Data Fetching Service
// ============================================================================

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: Array<{
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }>;
}

export interface GFGStats {
  username: string;
  instituteRank: string;
  currentStreak: string;
  maxStreak: string;
  codingScore: number;
  totalProblemsSolved: number;
  monthlyCodingScore: number;
  articlesPublished: number;
}

// Extract username from LeetCode URL
export function extractLeetCodeUsername(url: string): string | null {
  const patterns = [
    /leetcode\.com\/u\/([^\/\?]+)/,
    /leetcode\.com\/([^\/\?]+)\/?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (
      match &&
      match[1] &&
      !["problems", "contest", "discuss", "explore"].includes(match[1])
    ) {
      return match[1];
    }
  }
  return null;
}

// Extract username from GFG URL
export function extractGFGUsername(url: string): string | null {
  const pattern = /geeksforgeeks\.org\/user\/([^\/\?]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

// Fetch LeetCode stats using public GraphQL API
export async function fetchLeetCodeStats(
  username: string,
): Promise<LeetCodeStats | null> {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          submissionCalendar
          contributions {
            points
          }
          recentSubmissionList(limit: 10) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data = await response.json();
    const user = data.data?.matchedUser;

    if (!user) {
      return null;
    }

    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    const findCount = (diff: string) =>
      stats.find((s: any) => s.difficulty === diff)?.count || 0;

    return {
      username: user.username,
      totalSolved: findCount("All"),
      easySolved: findCount("Easy"),
      mediumSolved: findCount("Medium"),
      hardSolved: findCount("Hard"),
      ranking: user.profile?.ranking || 0,
      contributionPoints: user.contributions?.points || 0,
      reputation: user.profile?.reputation || 0,
      submissionCalendar: JSON.parse(user.submissionCalendar || "{}"),
      recentSubmissions: user.recentSubmissionList || [],
    };
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    return null;
  }
}

// Fetch GFG stats by scraping public profile
export async function fetchGFGStats(
  username: string,
): Promise<GFGStats | null> {
  try {
    // GFG doesn't have a public API, we'll use their public profile data endpoint
    const response = await fetch(
      `https://geeksforgeeks.org/api/vr/auth/user-stats/?username=${username}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      // Try alternative endpoint
      const altResponse = await fetch(
        `https://auth.geeksforgeeks.org/user/${username}/practice/`,
        { headers: { Accept: "text/html" } },
      );

      if (!altResponse.ok) {
        throw new Error("GFG profile not found");
      }

      // Return basic stats if API fails
      return {
        username,
        instituteRank: "N/A",
        currentStreak: "0",
        maxStreak: "0",
        codingScore: 0,
        totalProblemsSolved: 0,
        monthlyCodingScore: 0,
        articlesPublished: 0,
      };
    }

    const data = await response.json();

    return {
      username,
      instituteRank: data.institute_rank || "N/A",
      currentStreak: data.current_streak || "0",
      maxStreak: data.max_streak || "0",
      codingScore: data.coding_score || 0,
      totalProblemsSolved: data.total_problems_solved || 0,
      monthlyCodingScore: data.monthly_coding_score || 0,
      articlesPublished: data.articles_published || 0,
    };
  } catch (error) {
    console.error("Error fetching GFG stats:", error);
    return null;
  }
}

// Combined fetch for both platforms
export async function fetchAllStats(leetcodeUrl?: string, gfgUrl?: string) {
  const results: {
    leetcode: LeetCodeStats | null;
    gfg: GFGStats | null;
  } = {
    leetcode: null,
    gfg: null,
  };

  if (leetcodeUrl) {
    const username = extractLeetCodeUsername(leetcodeUrl);
    if (username) {
      results.leetcode = await fetchLeetCodeStats(username);
    }
  }

  if (gfgUrl) {
    const username = extractGFGUsername(gfgUrl);
    if (username) {
      results.gfg = await fetchGFGStats(username);
    }
  }

  return results;
}
