import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ActivityHeatmap from "@/components/dashboard/SimpleHeatmap";
import DashboardCharts from "@/components/dashboard/SimpleCharts";

// Mock data for demonstration
const mockData = {
  totalSolved: 127,
  reviewStats: {
    overdue: 5,
    dueToday: 12,
    totalScheduled: 89,
    mastered: 34,
    avgInterval: 18,
  },
  activityData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    count: Math.floor(Math.random() * 8),
  })),
  byDifficulty: {
    EASY: 45,
    MEDIUM: 62,
    HARD: 20,
  },
  byTopic: {
    Arrays: 28,
    "Dynamic Programming": 22,
    Trees: 18,
    Graphs: 15,
    Strings: 14,
    "Linked Lists": 12,
    "Hash Tables": 10,
    Sorting: 8,
  },
  totalApproaches: 45,
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Track your DSA learning progress
            </p>
          </div>
          <div className="flex gap-4">
            <GlassCard className="px-6 py-3">
              <div className="text-sm text-slate-400">Total Solved</div>
              <div className="text-3xl font-bold text-cyan-400">
                {mockData.totalSolved}
              </div>
            </GlassCard>
            <GlassCard className="px-6 py-3">
              <div className="text-sm text-slate-400">Approaches</div>
              <div className="text-3xl font-bold text-purple-400">
                {mockData.totalApproaches}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Spaced Repetition Stats */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            📚 Review Schedule
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {mockData.reviewStats.overdue}
              </div>
              <div className="text-sm text-slate-400">Overdue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {mockData.reviewStats.dueToday}
              </div>
              <div className="text-sm text-slate-400">Due Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {mockData.reviewStats.totalScheduled}
              </div>
              <div className="text-sm text-slate-400">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {mockData.reviewStats.mastered}
              </div>
              <div className="text-sm text-slate-400">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {mockData.reviewStats.avgInterval}d
              </div>
              <div className="text-sm text-slate-400">Avg Interval</div>
            </div>
          </div>
        </GlassCard>

        {/* Activity Heatmap */}
        <GlassCard>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            🔥 Activity Heatmap
          </h2>
          <ActivityHeatmap data={mockData.activityData} />
        </GlassCard>

        {/* Charts */}
        <DashboardCharts
          difficultyData={mockData.byDifficulty}
          topicData={mockData.byTopic}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/review">
            <GlassCard className="hover:border-violet-500/50 cursor-pointer">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Start Review
              </h3>
              <p className="text-slate-400 text-sm">
                {mockData.reviewStats.dueToday} problems due today
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
                View all {mockData.totalSolved} solved problems
              </p>
            </GlassCard>
          </Link>
          <Link href="/approaches">
            <GlassCard className="hover:border-purple-500/50 cursor-pointer">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                My Approaches
              </h3>
              <p className="text-slate-400 text-sm">
                {mockData.totalApproaches} documented solutions
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </div>
  );
}
