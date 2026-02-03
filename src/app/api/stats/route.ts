// API Route to fetch user stats from LeetCode and GFG
import { NextRequest, NextResponse } from "next/server";
import {
  fetchLeetCodeStats,
  fetchGFGStats,
  extractLeetCodeUsername,
  extractGFGUsername,
} from "@/lib/platform-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leetcodeUrl, gfgUrl } = body;

    const results: any = {
      leetcode: null,
      gfg: null,
      combined: {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
      },
    };

    // Fetch LeetCode stats
    if (leetcodeUrl) {
      const username = extractLeetCodeUsername(leetcodeUrl);
      if (username) {
        results.leetcode = await fetchLeetCodeStats(username);
        if (results.leetcode) {
          results.combined.totalSolved += results.leetcode.totalSolved;
          results.combined.easySolved += results.leetcode.easySolved;
          results.combined.mediumSolved += results.leetcode.mediumSolved;
          results.combined.hardSolved += results.leetcode.hardSolved;
        }
      }
    }

    // Fetch GFG stats
    if (gfgUrl) {
      const username = extractGFGUsername(gfgUrl);
      if (username) {
        results.gfg = await fetchGFGStats(username);
        if (results.gfg) {
          results.combined.totalSolved += results.gfg.totalProblemsSolved;
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leetcodeUrl = searchParams.get("leetcode");
  const gfgUrl = searchParams.get("gfg");

  const results: any = {
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

  return NextResponse.json(results);
}
