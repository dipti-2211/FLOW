"use client";

import { BookOpen, Coffee, Lightbulb, Heart } from "lucide-react";
import { MarkerHighlight } from "@/components/ui/HandDrawnAccents";

interface ProjectLogProps {
  problemCount?: number;
  authorStory?: string;
}

/**
 * Personal "About" component that grounds the project in your story
 * This adds authenticity and shows recruiters it's original work
 */
export default function ProjectLog({
  problemCount = 155,
  authorStory = "I built this because I needed a place to store my intuition. Every approach here was typed out after a long walk—the same ones I used to take as a roommate, talking through logic until it clicked.",
}: ProjectLogProps) {
  return (
    <section className="relative my-10">
      {/* Left border accent - pink marker style */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-pink-400 to-pink-600"
        style={{
          // Rough edge effect
          clipPath: "polygon(0 0, 100% 2%, 100% 98%, 0 100%)",
        }}
      />

      <div className="pl-6 space-y-4">
        {/* Title with problem count */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-pink-400" />
          <h3 className="text-xl font-bold">
            <MarkerHighlight color="pink">
              <span className="text-pink-400">Project Log: </span>
              <span className="text-white">{problemCount} and Counting</span>
            </MarkerHighlight>
          </h3>
        </div>

        {/* Story paragraph */}
        <p className="text-gray-400 italic leading-relaxed max-w-2xl">
          {authorStory}
        </p>

        {/* Additional personal touches */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span className="text-slate-500">Fueled by late-night coffee</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-500">Aha moments documented</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-slate-500">Built with intention</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DevJourneyCardProps {
  milestone: string;
  description: string;
  date?: string;
  icon?: "lightbulb" | "coffee" | "heart" | "book";
}

/**
 * Individual milestone card for the development journey
 */
export function DevJourneyCard({
  milestone,
  description,
  date,
  icon = "lightbulb",
}: DevJourneyCardProps) {
  const icons = {
    lightbulb: Lightbulb,
    coffee: Coffee,
    heart: Heart,
    book: BookOpen,
  };

  const Icon = icons[icon];

  return (
    <div className="relative group">
      {/* Timeline connector */}
      <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-pink-500/50 to-transparent" />

      <div className="flex gap-4">
        {/* Icon circle */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4 text-pink-400" />
        </div>

        {/* Content */}
        <div className="pb-8">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-semibold text-white">{milestone}</h4>
            {date && (
              <span className="text-xs text-slate-500 font-mono">{date}</span>
            )}
          </div>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
