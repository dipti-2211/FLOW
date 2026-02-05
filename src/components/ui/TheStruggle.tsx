"use client";

import { useState } from "react";
import {
  Brain,
  Clock,
  Frown,
  Lightbulb,
  Smile,
  Meh,
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";
import { MarkerHighlight } from "@/components/ui/HandDrawnAccents";

interface StruggleNote {
  id: string;
  problemTitle: string;
  difficulty: "easy" | "medium" | "hard";
  timeStuck: string; // e.g., "2 hours"
  mood: "frustrated" | "neutral" | "enlightened";
  note: string;
  breakthrough?: string;
  dateAdded: Date;
}

interface TheStruggleProps {
  notes?: StruggleNote[];
  onAddNote?: () => void;
}

/**
 * "The Struggle" - Personal dev notes section
 * Documents the human side of problem-solving
 * Proves you actually solved the problems and adds authenticity
 */
export default function TheStruggle({ notes, onAddNote }: TheStruggleProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Sample data if none provided
  const sampleNotes: StruggleNote[] = notes || [
    {
      id: "1",
      problemTitle: "Longest Palindromic Substring",
      difficulty: "medium",
      timeStuck: "2 hours",
      mood: "enlightened",
      note: "This DP problem kicked my butt for 2 hours until I realized it was just a variation of Knapsack. The expand-around-center approach finally clicked after drawing it out on paper.",
      breakthrough: "Drawing the palindrome expansion visually was the key!",
      dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      problemTitle: "Binary Tree Maximum Path Sum",
      difficulty: "hard",
      timeStuck: "3+ hours",
      mood: "frustrated",
      note: "Recursion within recursion. My brain couldn't handle tracking both the 'path through node' vs 'path ending at node' at the same time. Had to sleep on it.",
      breakthrough:
        "The 'aha' moment: treat each node as a potential root of the max path.",
      dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      problemTitle: "3Sum",
      difficulty: "medium",
      timeStuck: "45 mins",
      mood: "neutral",
      note: "Kept getting TLE because I forgot to skip duplicates. Classic rookie mistake. The two-pointer approach after sorting is beautiful once it clicks.",
      dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  const moodIcons = {
    frustrated: { icon: Frown, color: "text-red-400", bg: "bg-red-400/10" },
    neutral: { icon: Meh, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    enlightened: {
      icon: Smile,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  };

  const difficultyColors = {
    easy: "text-green-400 bg-green-400/10 border-green-400/30",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    hard: "text-red-400 bg-red-400/10 border-red-400/30",
  };

  return (
    <section className="my-10">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group mb-6"
      >
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold">
            <MarkerHighlight color="pink">The Struggle</MarkerHighlight>
          </h2>
          <span className="text-sm text-slate-500 font-mono">
            // because real learning is messy
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {sampleNotes.length} notes
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
          )}
        </div>
      </button>

      {/* Notes list */}
      {isExpanded && (
        <div className="space-y-4">
          {sampleNotes.map((note) => {
            const MoodIcon = moodIcons[note.mood].icon;

            return (
              <div key={note.id} className="relative group">
                {/* Card */}
                <div
                  className="relative bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-pink-500/30 transition-all duration-300"
                  style={{
                    // Slight rotation for hand-drawn feel
                    transform: `rotate(${((parseInt(note.id) % 3) - 1) * 0.3}deg)`,
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors">
                        {note.problemTitle}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${difficultyColors[note.difficulty]}`}
                      >
                        {note.difficulty}
                      </span>
                    </div>

                    {/* Mood indicator */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${moodIcons[note.mood].bg}`}
                    >
                      <MoodIcon
                        className={`w-4 h-4 ${moodIcons[note.mood].color}`}
                      />
                      <span
                        className={`text-xs font-medium ${moodIcons[note.mood].color}`}
                      >
                        {note.mood}
                      </span>
                    </div>
                  </div>

                  {/* Time stuck */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>Stuck for {note.timeStuck}</span>
                  </div>

                  {/* The struggle note itself */}
                  <p className="text-slate-300 italic leading-relaxed mb-3">
                    "{note.note}"
                  </p>

                  {/* Breakthrough (if any) */}
                  {note.breakthrough && (
                    <div className="flex items-start gap-2 mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-300">
                        <span className="font-semibold">Breakthrough:</span>{" "}
                        {note.breakthrough}
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs text-slate-600 mt-4 font-mono">
                    {note.dateAdded.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Add note button */}
          <button
            onClick={onAddNote}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-pink-400 hover:border-pink-500/50 transition-all duration-300 group"
          >
            <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Add your struggle story</span>
          </button>
        </div>
      )}
    </section>
  );
}

interface QuickStruggleNoteProps {
  problemTitle: string;
  onSave: (note: string) => void;
}

/**
 * Quick inline struggle note editor
 * For adding notes while solving problems
 */
export function QuickStruggleNote({
  problemTitle,
  onSave,
}: QuickStruggleNoteProps) {
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (note.trim()) {
      onSave(note);
      setNote("");
      setIsOpen(false);
    }
  };

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-pink-400 transition-colors"
        >
          <Brain className="w-4 h-4" />
          <span>Add a struggle note...</span>
        </button>
      ) : (
        <div className="space-y-3 p-4 bg-slate-800/50 rounded-xl border border-pink-500/20">
          <div className="flex items-center gap-2 text-sm text-pink-400">
            <Brain className="w-4 h-4" />
            <span className="font-medium">
              The Struggle with "{problemTitle}"
            </span>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What made this problem hard? What was your aha moment?"
            className="w-full bg-transparent border-none text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none text-sm"
            rows={3}
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
