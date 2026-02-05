"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ActivityHeatmap from "@/components/dashboard/SimpleHeatmap";
import DashboardCharts from "@/components/dashboard/SimpleCharts";
import ProjectLog from "@/components/ui/ProjectLog";
import TheStruggle from "@/components/ui/TheStruggle";
import {
  MarkerHighlight,
  NotebookStyleCard,
} from "@/components/ui/HandDrawnAccents";
import { HoverGlow, TrophyRoomBadge } from "@/components/ui/MicroAnimations";

interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: Array<{
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
  }>;
}

interface GFGStats {
  username: string;
  totalProblemsSolved: number;
  codingScore: number;
  currentStreak: string;
  maxStreak: string;
}

interface UserData {
  gmail: string;
  leetcodeUrl: string;
  gfgUrl?: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(
    null,
  );
  const [gfgStats, setGfgStats] = useState<GFGStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user setup data from localStorage
        const setupData = localStorage.getItem("userSetup");
        if (!setupData) {
          window.location.href = "/setup";
          return;
        }

        const parsed = JSON.parse(setupData) as UserData;
        setUserData(parsed);

        // Fetch stats from our API
        const response = await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leetcodeUrl: parsed.leetcodeUrl,
            gfgUrl: parsed.gfgUrl,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        setLeetcodeStats(data.leetcode);
        setGfgStats(data.gfg);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load your stats. Please check your profile URLs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert LeetCode submission calendar to heatmap data
  const getActivityData = () => {
    if (!leetcodeStats?.submissionCalendar) return [];

    return Object.entries(leetcodeStats.submissionCalendar).map(
      ([timestamp, count]) => ({
        date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0],
        count: count as number,
      }),
    );
  };

  // Calculate combined stats
  const totalSolved =
    (leetcodeStats?.totalSolved || 0) + (gfgStats?.totalProblemsSolved || 0);
  const easySolved = leetcodeStats?.easySolved || 0;
  const mediumSolved = leetcodeStats?.mediumSolved || 0;
  const hardSolved = leetcodeStats?.hardSolved || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">
            Fetching your stats from LeetCode & GFG...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Marker Highlight */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              <MarkerHighlight color="pink">Dashboard</MarkerHighlight>
            </h1>
            <p className="text-slate-400 mt-2">
              Welcome back! Here's your DSA progress
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Trophy Room Badge */}
            <TrophyRoomBadge count={totalSolved} />

            <GlassCard className="px-6 py-3">
              <div className="text-sm text-slate-400">Total Solved</div>
              <div className="text-3xl font-bold text-pink-400">
                <HoverGlow glowColor="pink">{totalSolved}</HoverGlow>
              </div>
            </GlassCard>
            {leetcodeStats && (
              <GlassCard className="px-6 py-3">
                <div className="text-sm text-slate-400">LeetCode Rank</div>
                <div className="text-3xl font-bold text-purple-400">
                  <HoverGlow glowColor="purple">
                    #{leetcodeStats.ranking.toLocaleString()}
                  </HoverGlow>
                </div>
              </GlassCard>
            )}
          </div>
        </div>

        {/* Project Log - Personal Story */}
        <ProjectLog
          problemCount={totalSolved}
          authorStory="I built this because I needed a place to store my intuition. Every approach here was typed out after a long walk—the same ones I used to take as a roommate, talking through logic until it clicked."
        />

        {error && (
          <GlassCard className="border-red-500/50 bg-red-500/10">
            <p className="text-red-400">{error}</p>
          </GlassCard>
        )}

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LeetCode Stats */}
          {leetcodeStats && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🟠</span>
                <div>
                  <h2 className="text-xl font-semibold text-white">LeetCode</h2>
                  <p className="text-slate-400 text-sm">
                    @{leetcodeStats.username}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {leetcodeStats.totalSolved}
                  </div>
                  <div className="text-xs text-slate-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {leetcodeStats.easySolved}
                  </div>
                  <div className="text-xs text-slate-400">Easy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {leetcodeStats.mediumSolved}
                  </div>
                  <div className="text-xs text-slate-400">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {leetcodeStats.hardSolved}
                  </div>
                  <div className="text-xs text-slate-400">Hard</div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* GFG Stats */}
          {gfgStats && gfgStats.totalProblemsSolved > 0 ? (
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🟢</span>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    GeeksforGeeks
                  </h2>
                  <p className="text-slate-400 text-sm">@{gfgStats.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {gfgStats.totalProblemsSolved}
                  </div>
                  <div className="text-xs text-slate-400">Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {gfgStats.codingScore}
                  </div>
                  <div className="text-xs text-slate-400">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {gfgStats.currentStreak}
                  </div>
                  <div className="text-xs text-slate-400">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {gfgStats.maxStreak}
                  </div>
                  <div className="text-xs text-slate-400">Max Streak</div>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl">🟢</span>
                <p className="text-slate-400 mt-2">
                  {userData?.gfgUrl
                    ? "Loading GFG stats..."
                    : "Add GFG profile in settings"}
                </p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Activity Heatmap - Notebook Style */}
        <NotebookStyleCard title="🔥 LeetCode Activity">
          <ActivityHeatmap data={getActivityData()} />
        </NotebookStyleCard>

        {/* Difficulty Charts */}
        <DashboardCharts
          difficultyData={{
            EASY: easySolved,
            MEDIUM: mediumSolved,
            HARD: hardSolved,
          }}
          topicData={{
            Arrays: Math.floor(totalSolved * 0.2),
            "Dynamic Programming": Math.floor(totalSolved * 0.15),
            Trees: Math.floor(totalSolved * 0.12),
            Graphs: Math.floor(totalSolved * 0.1),
            Strings: Math.floor(totalSolved * 0.1),
          }}
        />

        {/* The Struggle - Dev Notes Section */}
        <TheStruggle />

        {/* Recent Submissions */}
        {leetcodeStats?.recentSubmissions &&
          leetcodeStats.recentSubmissions.length > 0 && (
            <GlassCard>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                📝 Recent LeetCode Submissions
              </h2>
              <div className="space-y-3">
                {leetcodeStats.recentSubmissions.slice(0, 5).map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          sub.statusDisplay === "Accepted"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {sub.statusDisplay === "Accepted" ? "✓" : "✗"}
                      </span>
                      <div>
                        <a
                          href={`https://leetcode.com/problems/${sub.titleSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-cyan-400 transition-colors"
                        >
                          {sub.title}
                        </a>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date(
                        parseInt(sub.timestamp) * 1000,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/review">
            <GlassCard className="hover:border-violet-500/50 cursor-pointer">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Start Review
              </h3>
              <p className="text-slate-400 text-sm">
                Practice with spaced repetition
              </p>
            </GlassCard>
          </Link>
          <Link href="/problems">
            <GlassCard className="hover:border-cyan-500/50 cursor-pointer">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Browse Problems
              </h3>
              <p className="text-slate-400 text-sm">
                View all {totalSolved} solved problems
              </p>
            </GlassCard>
          </Link>
          <Link href="/approaches">
            <GlassCard className="hover:border-purple-500/50 cursor-pointer">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                My Approaches
              </h3>
              <p className="text-slate-400 text-sm">Document your solutions</p>
            </GlassCard>
          </Link>
        </div>

        {/* Profile Links */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-3">
            🔗 Connected Profiles
          </h3>
          <div className="flex gap-4">
            {userData?.leetcodeUrl && (
              <a
                href={userData.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
              >
                🟠 LeetCode Profile
              </a>
            )}
            {userData?.gfgUrl && (
              <a
                href={userData.gfgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                🟢 GFG Profile
              </a>
            )}
            <Link
              href="/setup"
              className="px-4 py-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors"
            >
              ⚙️ Update Settings
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
