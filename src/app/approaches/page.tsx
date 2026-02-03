import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";

// Mock approaches data
const approaches = [
  {
    id: "1",
    title: "Two Pointer Approach",
    problemTitle: "Two Sum",
    difficulty: "EASY",
    topic: "Arrays",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    upvotes: 24,
    isPublic: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Expand Around Center",
    problemTitle: "Longest Palindromic Substring",
    difficulty: "MEDIUM",
    topic: "Dynamic Programming",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    upvotes: 18,
    isPublic: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "DFS with Global Max",
    problemTitle: "Binary Tree Maximum Path Sum",
    difficulty: "HARD",
    topic: "Trees",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    upvotes: 42,
    isPublic: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Sorting + Two Pointers",
    problemTitle: "3Sum",
    difficulty: "MEDIUM",
    topic: "Arrays",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    upvotes: 31,
    isPublic: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

const difficultyColors = {
  EASY: "text-green-400 bg-green-400/10",
  MEDIUM: "text-yellow-400 bg-yellow-400/10",
  HARD: "text-red-400 bg-red-400/10",
};

export default function ApproachesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Approach Journal
            </h1>
            <p className="text-slate-400 mt-2">
              {approaches.length} documented approaches
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            + New Approach
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {approaches.length}
            </div>
            <div className="text-sm text-slate-400">Total Approaches</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {approaches.filter((a) => a.isPublic).length}
            </div>
            <div className="text-sm text-slate-400">Public</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {approaches.reduce((sum, a) => sum + a.upvotes, 0)}
            </div>
            <div className="text-sm text-slate-400">Total Upvotes</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {new Set(approaches.map((a) => a.topic)).size}
            </div>
            <div className="text-sm text-slate-400">Topics Covered</div>
          </GlassCard>
        </div>

        {/* Approaches List */}
        <div className="space-y-4">
          {approaches.map((approach) => (
            <GlassCard
              key={approach.id}
              className="hover:border-cyan-500/50 transition-colors"
            >
              <Link href={`/approaches/${approach.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white hover:text-cyan-400 transition-colors">
                        {approach.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[approach.difficulty as keyof typeof difficultyColors]}`}
                      >
                        {approach.difficulty}
                      </span>
                      {approach.isPublic ? (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-slate-500/20 text-slate-400 rounded">
                          Private
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 mb-3">
                      For:{" "}
                      <span className="text-cyan-400">
                        {approach.problemTitle}
                      </span>
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <span>📚 {approach.topic}</span>
                      <span className="text-green-400">
                        ⏱️ {approach.timeComplexity}
                      </span>
                      <span className="text-blue-400">
                        💾 {approach.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">👍</span>
                      <span className="text-xl font-bold text-purple-400">
                        {approach.upvotes}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {approach.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>

        {/* Approach Template Info */}
        <GlassCard className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">
            📝 Approach Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="font-semibold text-cyan-400 mb-1">
                💡 Intuition
              </div>
              <p>
                Explain your thought process and how you approached the problem
              </p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="font-semibold text-green-400 mb-1">💻 Code</div>
              <p>Your solution with syntax highlighting and comments</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="font-semibold text-purple-400 mb-1">
                📊 Complexity
              </div>
              <p>Time and space complexity analysis with LaTeX support</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
