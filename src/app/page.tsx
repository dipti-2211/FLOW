import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-8">
            <span className="animate-pulse w-2 h-2 bg-cyan-400 rounded-full"></span>
            Now with Spaced Repetition & Social Features
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Master DSA
            </span>
            <br />
            <span className="text-white">Like Never Before</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Track your progress, review with spaced repetition, document your
            approaches, and connect with fellow coders. Your ultimate DSA
            learning companion.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Go to Dashboard →
            </Link>
            <Link
              href="/problems"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Browse Problems
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Everything You Need to <span className="text-cyan-400">Excel</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Spaced Repetition
            </h3>
            <p className="text-slate-400">
              SM-2 algorithm schedules optimal review times to maximize
              retention. Never forget a pattern again.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all group">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Approach Journal
            </h3>
            <p className="text-slate-400">
              Document your intuition, code, and complexity analysis with
              Markdown and LaTeX support.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-green-500/50 transition-all group">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Visual Analytics
            </h3>
            <p className="text-slate-400">
              GitHub-style heatmaps, progress charts, and detailed statistics to
              track your journey.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-yellow-500/50 transition-all group">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Platform Sync
            </h3>
            <p className="text-slate-400">
              Connect LeetCode & Codeforces accounts to automatically sync your
              solved problems.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-red-500/50 transition-all group">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Topic Chat Rooms
            </h3>
            <p className="text-slate-400">
              Join real-time discussions in topic-based rooms. Learn from the
              community.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all group">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Trophy Room
            </h3>
            <p className="text-slate-400">
              Earn badges, climb leaderboards, and showcase your achievements to
              the world.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-400">500+</div>
              <div className="text-slate-400 mt-2">Problems Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">10K+</div>
              <div className="text-slate-400 mt-2">Reviews Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400">95%</div>
              <div className="text-slate-400 mt-2">Retention Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">50+</div>
              <div className="text-slate-400 mt-2">Topics Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Level Up Your DSA Skills?
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-xl mx-auto">
          Join thousands of developers who are mastering algorithms with smart
          repetition.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          Get Started Free
          <span>→</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-slate-500 text-sm">
          <p>Built with Next.js, Prisma, and Socket.io</p>
          <p className="mt-2">© 2026 Nodal - DSA Tracker & Social Hub</p>
        </div>
      </footer>
    </div>
  );
}
