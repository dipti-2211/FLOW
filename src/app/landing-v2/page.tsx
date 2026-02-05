"use client";

import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  Brain,
  FileText,
  BarChart3,
  Link2,
  MessageCircle,
  Trophy,
} from "lucide-react";

// Feature card with glowing effect
function GlowingFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative min-h-[14rem] list-none">
      <div className="relative h-full rounded-[1.25rem] border border-white/10 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-white/5 bg-slate-900/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-pink-500/30 bg-pink-500/10 p-2">
              <Icon className="h-5 w-5 text-pink-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeometricLandingPage() {
  return (
    <div className="bg-[#030303]">
      {/* Geometric Hero Section */}
      <HeroGeometric
        badge="vibe.cpp"
        title1="Master DSA"
        title2="Like Never Before"
        description="Track your progress, review with spaced repetition, document your approaches, and connect with fellow coders. Your ultimate DSA learning companion."
      >
        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/setup"
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all text-white"
          >
            Get Started Free →
          </Link>
          <Link
            href="/problems"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-pink-500/30 transition-all text-white"
          >
            Browse Problems
          </Link>
        </div>
      </HeroGeometric>

      {/* Features Grid with Glowing Effect */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Everything You Need to <span className="text-pink-400">Excel</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlowingFeatureCard
            icon={Brain}
            title="Spaced Repetition"
            description="SM-2 algorithm schedules optimal review times to maximize retention. Never forget a pattern again."
          />
          <GlowingFeatureCard
            icon={FileText}
            title="Approach Journal"
            description="Document your intuition, code, and complexity analysis with Markdown and LaTeX support."
          />
          <GlowingFeatureCard
            icon={BarChart3}
            title="Visual Analytics"
            description="GitHub-style heatmaps, progress charts, and detailed statistics to track your journey."
          />
          <GlowingFeatureCard
            icon={Link2}
            title="Platform Sync"
            description="Connect LeetCode & Codeforces accounts to automatically sync your solved problems."
          />
          <GlowingFeatureCard
            icon={MessageCircle}
            title="Topic Chat Rooms"
            description="Join real-time discussions in topic-based rooms. Learn from the community."
          />
          <GlowingFeatureCard
            icon={Trophy}
            title="Trophy Room"
            description="Earn badges, climb leaderboards, and showcase your achievements to the world."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-400">500+</div>
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
          href="/setup"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all text-white"
        >
          Get Started Free
          <span>→</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-slate-500 text-sm">
          <p>
            Hand-coded with ☕ and <span className="text-pink-400">C++</span>{" "}
            vibes
          </p>
          <p className="mt-2">
            © 2026 <span className="font-mono text-pink-400">vibe.cpp</span> -
            No templates, just vibes
          </p>
        </div>
      </footer>
    </div>
  );
}
