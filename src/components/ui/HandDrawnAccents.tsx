"use client";

import { ReactNode } from "react";

interface MarkerHighlightProps {
  children: ReactNode;
  color?: "pink" | "yellow" | "cyan" | "purple";
  className?: string;
}

/**
 * Marker-style highlight that looks like a textbook highlight
 * Creates an authentic "student-turned-engineer" aesthetic
 */
export function MarkerHighlight({
  children,
  color = "pink",
  className = "",
}: MarkerHighlightProps) {
  const colorClasses = {
    pink: "bg-pink-500/30 decoration-pink-400",
    yellow: "bg-yellow-500/30 decoration-yellow-400",
    cyan: "bg-cyan-500/30 decoration-cyan-400",
    purple: "bg-purple-500/30 decoration-purple-400",
  };

  return (
    <span className={`relative inline-block ${className}`}>
      {/* The marker highlight effect - thick semi-transparent line */}
      <span
        className={`absolute bottom-0 left-0 right-0 h-[40%] ${colorClasses[color]} -skew-x-1 rounded-sm`}
        style={{
          // Rough, hand-drawn effect with slight variation
          clipPath: "polygon(2% 0%, 98% 5%, 100% 95%, 0% 100%)",
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

interface SketchyBorderProps {
  children: ReactNode;
  className?: string;
  borderColor?: "pink" | "cyan" | "purple" | "slate";
}

/**
 * Sketchy border effect that looks hand-drawn
 * Uses CSS to simulate rough.js style borders
 */
export function SketchyBorder({
  children,
  className = "",
  borderColor = "pink",
}: SketchyBorderProps) {
  const borderClasses = {
    pink: "border-pink-500/40",
    cyan: "border-cyan-500/40",
    purple: "border-purple-500/40",
    slate: "border-slate-500/40",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main content with sketchy border */}
      <div
        className={`relative border-2 ${borderClasses[borderColor]} rounded-xl p-6`}
        style={{
          // Simulate hand-drawn effect with border-radius variations
          borderRadius: "1rem 0.5rem 1rem 0.75rem",
        }}
      >
        {/* Corner accents for sketch effect */}
        <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-pink-400/60 rounded-tl-lg" />
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-pink-400/60 rounded-tr-lg" />
        <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-pink-400/60 rounded-bl-lg" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-pink-400/60 rounded-br-lg" />

        {children}
      </div>
    </div>
  );
}

interface NotebookStyleCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/**
 * Card that looks like it was drawn in a notebook
 * Perfect for charts and visual data
 */
export function NotebookStyleCard({
  children,
  title,
  className = "",
}: NotebookStyleCardProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Paper texture effect */}
      <div
        className="absolute inset-0 bg-slate-900/50 rounded-2xl"
        style={{
          // Subtle paper grain
          backgroundImage: `
            linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.02) 95%),
            linear-gradient(transparent 95%, rgba(255,255,255,0.02) 95%)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Sketchy outer border */}
      <div
        className="relative border-2 border-pink-500/20 rounded-2xl overflow-hidden backdrop-blur-xl"
        style={{
          borderRadius: "1.2rem 0.8rem 1rem 1.1rem",
          boxShadow: "2px 3px 0 rgba(236, 72, 153, 0.1)",
        }}
      >
        {/* Notebook spine decoration */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500/30 via-purple-500/30 to-cyan-500/30" />

        {/* Content */}
        <div className="relative p-6 pl-8">
          {title && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white inline-block">
                <MarkerHighlight color="pink">{title}</MarkerHighlight>
              </h3>
            </div>
          )}
          {children}
        </div>

        {/* Tape decoration in corner */}
        <div
          className="absolute -top-1 -right-1 w-16 h-6 bg-yellow-200/20 rotate-12"
          style={{
            clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
          }}
        />
      </div>
    </div>
  );
}

interface HandwrittenNoteProps {
  children: ReactNode;
  author?: string;
  className?: string;
}

/**
 * Handwritten-style note annotation
 */
export function HandwrittenNote({
  children,
  author,
  className = "",
}: HandwrittenNoteProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="bg-yellow-100/5 border border-yellow-500/20 rounded-lg p-4"
        style={{
          transform: "rotate(-0.5deg)",
          borderRadius: "0.5rem 1rem 0.5rem 1rem",
        }}
      >
        {/* Pin/tack decoration */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500/80 shadow-lg" />

        <p className="font-mono text-sm text-yellow-200/80 italic">
          {children}
        </p>

        {author && (
          <p className="text-xs text-yellow-500/60 mt-2 text-right font-mono">
            — {author}
          </p>
        )}
      </div>
    </div>
  );
}
