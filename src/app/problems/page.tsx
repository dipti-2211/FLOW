import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { MarkerHighlight } from "@/components/ui/HandDrawnAccents";
import { HoverGlow, ProblemIdBadge } from "@/components/ui/MicroAnimations";

// Mock problems data
const problems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "EASY",
    platform: "LEETCODE",
    topic: "Arrays",
    timeSpent: 15,
    approaches: 2,
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    lastReviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    daysOverdue: 0,
  },
  {
    id: "2",
    title: "Longest Palindromic Substring",
    difficulty: "MEDIUM",
    platform: "LEETCODE",
    topic: "Dynamic Programming",
    timeSpent: 45,
    approaches: 3,
    nextReviewAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastReviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    daysOverdue: 1,
  },
  {
    id: "3",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "HARD",
    platform: "LEETCODE",
    topic: "Trees",
    timeSpent: 90,
    approaches: 1,
    nextReviewAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    lastReviewedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    daysOverdue: 4,
  },
  {
    id: "4",
    title: "3Sum",
    difficulty: "MEDIUM",
    platform: "LEETCODE",
    topic: "Arrays",
    timeSpent: 30,
    approaches: 2,
    nextReviewAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    lastReviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    daysOverdue: 0,
  },
  {
    id: "5",
    title: "Merge K Sorted Lists",
    difficulty: "HARD",
    platform: "LEETCODE",
    topic: "Linked Lists",
    timeSpent: 75,
    approaches: 2,
    nextReviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    lastReviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    daysOverdue: 0,
  },
];

const difficultyColors = {
  EASY: "text-green-400 bg-green-400/10",
  MEDIUM: "text-yellow-400 bg-yellow-400/10",
  HARD: "text-red-400 bg-red-400/10",
};

const platformColors = {
  LEETCODE: "text-orange-400",
  CODEFORCES: "text-blue-400",
  CUSTOM: "text-purple-400",
};

function formatInterval(date: Date): string {
  const days = Math.floor(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  return `${Math.floor(days / 30)} months`;
}

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              <MarkerHighlight color="pink">Problems</MarkerHighlight>
            </h1>
            <p className="text-slate-400 mt-2">
              <HoverGlow glowColor="pink">{problems.length}</HoverGlow> problems
              solved
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all group">
            <span className="group-hover:scale-105 inline-block transition-transform">
              + Add Problem
            </span>
          </button>
        </div>

        {/* Filters */}
        <GlassCard className="mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
              <option>All Topics</option>
              <option>Arrays</option>
              <option>Dynamic Programming</option>
              <option>Trees</option>
              <option>Graphs</option>
            </select>
            <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
              <option>All Platforms</option>
              <option>LeetCode</option>
              <option>Codeforces</option>
              <option>Custom</option>
            </select>
          </div>
        </GlassCard>

        {/* Problems List */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <GlassCard
              key={problem.id}
              className="hover:border-pink-500/50 transition-all duration-300 group"
            >
              <Link href={`/problems/${problem.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Problem ID with glow effect */}
                      <ProblemIdBadge id={problem.id} platform="leetcode" />
                      <h3 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors">
                        {problem.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[problem.difficulty]}`}
                      >
                        {problem.difficulty}
                      </span>
                      <span
                        className={`text-sm ${platformColors[problem.platform]}`}
                      >
                        {problem.platform}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>📚 {problem.topic}</span>
                      <span>⏱️ {problem.timeSpent}min</span>
                      {problem.approaches > 0 && (
                        <span>📝 {problem.approaches} approach(es)</span>
                      )}
                    </div>

                    {problem.daysOverdue > 0 && (
                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            problem.daysOverdue >= 3
                              ? "bg-red-500/20 text-red-400"
                              : problem.daysOverdue >= 1
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          🔔 Overdue by {problem.daysOverdue} day(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-400">Next Review</div>
                    <div className="text-lg font-semibold text-pink-400">
                      <HoverGlow glowColor="pink">
                        {formatInterval(problem.nextReviewAt)}
                      </HoverGlow>
                    </div>
                    {problem.lastReviewedAt && (
                      <div className="text-xs text-slate-500 mt-1">
                        Last: {problem.lastReviewedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
