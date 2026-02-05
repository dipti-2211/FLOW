import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import {
  MarkerHighlight,
  NotebookStyleCard,
} from "@/components/ui/HandDrawnAccents";
import {
  HoverGlow,
  ProblemIdBadge,
  PulseRing,
} from "@/components/ui/MicroAnimations";

// Mock review queue
const dueProblems = [
  {
    id: "3",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "HARD",
    topic: "Trees",
    daysOverdue: 4,
    urgency: "critical" as const,
  },
  {
    id: "2",
    title: "Longest Palindromic Substring",
    difficulty: "MEDIUM",
    topic: "Dynamic Programming",
    daysOverdue: 1,
    urgency: "high" as const,
  },
  {
    id: "6",
    title: "Valid Parentheses",
    difficulty: "EASY",
    topic: "Stack",
    daysOverdue: 0,
    urgency: "medium" as const,
  },
  {
    id: "7",
    title: "Coin Change",
    difficulty: "MEDIUM",
    topic: "Dynamic Programming",
    daysOverdue: 0,
    urgency: "medium" as const,
  },
  {
    id: "8",
    title: "Diameter of Binary Tree",
    difficulty: "EASY",
    topic: "Trees",
    daysOverdue: 0,
    urgency: "medium" as const,
  },
];

const urgencyColors = {
  critical: "border-red-500 bg-red-500/5",
  high: "border-orange-500 bg-orange-500/5",
  medium: "border-yellow-500 bg-yellow-500/5",
  low: "border-cyan-500 bg-cyan-500/5",
};

const urgencyIcons = {
  critical: "🚨",
  high: "⚠️",
  medium: "📌",
  low: "📝",
};

const difficultyBadges = {
  EASY: "bg-green-500/20 text-green-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  HARD: "bg-red-500/20 text-red-400",
};

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <MarkerHighlight color="pink">Review Queue</MarkerHighlight>
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <PulseRing color="pink" size="sm" />
            <HoverGlow glowColor="pink">{dueProblems.length}</HoverGlow>{" "}
            problem(s) ready for review
          </p>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-red-400">
              {dueProblems.filter((p) => p.urgency === "critical").length}
            </div>
            <div className="text-sm text-slate-400">Critical</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-orange-400">
              {dueProblems.filter((p) => p.urgency === "high").length}
            </div>
            <div className="text-sm text-slate-400">High Priority</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {dueProblems.filter((p) => p.urgency === "medium").length}
            </div>
            <div className="text-sm text-slate-400">Due Today</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-cyan-400">89</div>
            <div className="text-sm text-slate-400">Total Scheduled</div>
          </GlassCard>
        </div>

        {dueProblems.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              All caught up!
            </h2>
            <p className="text-slate-400">
              No problems are due for review right now.
            </p>
            <Link
              href="/problems"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Browse Problems
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {dueProblems.map((problem) => (
              <GlassCard
                key={problem.id}
                className={`border-l-4 ${urgencyColors[problem.urgency]} hover:border-pink-500/30 transition-all duration-300 group`}
              >
                <Link href={`/problems/${problem.id}?review=true`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {urgencyIcons[problem.urgency]}
                        </span>
                        <ProblemIdBadge id={problem.id} platform="leetcode" />
                        <h3 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors">
                          {problem.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyBadges[problem.difficulty as keyof typeof difficultyBadges]}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400 ml-11">
                        <span>📚 {problem.topic}</span>
                        {problem.daysOverdue > 0 && (
                          <span className="text-red-400 font-semibold">
                            {problem.daysOverdue} day(s) overdue
                          </span>
                        )}
                        {problem.daysOverdue === 0 && (
                          <span className="text-yellow-400">Due today</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all group-hover:scale-105">
                        Start Review →
                      </button>
                    </div>
                  </div>
                </Link>
              </GlassCard>
            ))}
          </div>
        )}

        {/* SM-2 Algorithm Info */}
        <NotebookStyleCard
          title="🧠 How Spaced Repetition Works"
          className="mt-8"
        >
          <div className="text-sm text-slate-400 space-y-2">
            <p>This app uses the SM-2 algorithm to optimize your learning:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <span className="text-green-400">Easy reviews</span> increase
                interval significantly
              </li>
              <li>
                <span className="text-yellow-400">Medium reviews</span> maintain
                current schedule
              </li>
              <li>
                <span className="text-red-400">Hard reviews</span> reset to
                shorter intervals
              </li>
              <li>
                Problems are scheduled at optimal times for maximum retention
              </li>
            </ul>
          </div>
        </NotebookStyleCard>
      </div>
    </div>
  );
}
