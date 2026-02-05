"use client";

import { Heart, Coffee, Code2 } from "lucide-react";

interface BrandFooterProps {
  authorName?: string;
}

export default function BrandFooter({
  authorName = "Your Name",
}: BrandFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main footer content */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Hand-coded message */}
          <div className="relative group">
            {/* Sketchy border effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <p className="relative text-lg font-mono">
              <span className="text-slate-500">{"// "}</span>
              <span className="text-slate-300">Hand-coded with </span>
              <Coffee
                className="inline w-5 h-5 text-amber-400 mx-1 animate-bounce"
                style={{ animationDuration: "2s" }}
              />
              <span className="text-slate-300"> and </span>
              <span className="text-pink-400 font-bold">C++</span>
              <span className="text-slate-300"> by </span>
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-bold">
                {authorName}
              </span>
            </p>

            <p className="text-slate-500 font-mono text-sm mt-2">
              <span className="text-pink-400/60">{"<"}</span>
              <span>No templates, just vibes</span>
              <span className="text-pink-400/60">{" />"}</span>
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="font-mono">155+ problems tracked</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="font-mono">Built with passion</span>
            </div>
          </div>

          {/* Version badge */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-mono text-slate-400">
              v1.0.0-beta
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-mono text-pink-400">
              vibe.cpp
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-600 font-mono mt-4">
            © {currentYear} {authorName}. All algorithms eventually terminate.
          </p>
        </div>
      </div>
    </footer>
  );
}
