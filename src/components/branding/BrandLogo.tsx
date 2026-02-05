"use client";

import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function BrandLogo({
  size = "md",
  showTagline = false,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <Link href="/" className="group flex items-center gap-3">
      {/* Code-inspired logo mark */}
      <div className={`${iconSizes[size]} relative`}>
        {/* Outer bracket */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-pink-400 opacity-60 group-hover:opacity-100 transition-opacity">
            {"<"}
          </span>
        </div>
        {/* Inner gradient circle */}
        <div
          className="absolute inset-1 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        {/* Nodal symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-black text-white drop-shadow-lg">
            λ
          </span>
        </div>
        {/* Outer bracket */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-pink-400 opacity-60 group-hover:opacity-100 transition-opacity ml-8">
            {"/>"}
          </span>
        </div>
      </div>

      {/* Brand text */}
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} font-mono font-bold`}>
          <span className="text-pink-400">vibe</span>
          <span className="text-slate-400">.</span>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            cpp
          </span>
        </span>
        {showTagline && (
          <span className="text-xs text-slate-500 font-mono tracking-wider">
            // no templates, just vibes
          </span>
        )}
      </div>
    </Link>
  );
}
