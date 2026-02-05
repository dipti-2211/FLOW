"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";

interface HoverGlowProps {
  children: ReactNode;
  glowColor?: "pink" | "cyan" | "purple" | "amber";
  className?: string;
}

/**
 * Hover glow effect for problem IDs and interactive elements
 * Makes text glow with a pink text-shadow on hover
 */
export function HoverGlow({
  children,
  glowColor = "pink",
  className = "",
}: HoverGlowProps) {
  const glowStyles = {
    pink: "hover:text-pink-400 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]",
    cyan: "hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    purple:
      "hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    amber:
      "hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]",
  };

  return (
    <span
      className={`transition-all duration-300 cursor-pointer ${glowStyles[glowColor]} ${className}`}
    >
      {children}
    </span>
  );
}

interface ProblemIdBadgeProps {
  id: string | number;
  platform?: "leetcode" | "codeforces" | "gfg";
}

/**
 * Problem ID badge with hover glow effect
 */
export function ProblemIdBadge({
  id,
  platform = "leetcode",
}: ProblemIdBadgeProps) {
  const platformColors = {
    leetcode:
      "text-orange-400 hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.9)]",
    codeforces:
      "text-blue-400 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.9)]",
    gfg: "text-green-400 hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.9)]",
  };

  return (
    <span
      className={`font-mono font-bold transition-all duration-300 cursor-pointer ${platformColors[platform]}`}
    >
      #{id}
    </span>
  );
}

interface FlyingNodeProps {
  trigger: boolean;
  onComplete?: () => void;
}

/**
 * Animated node that flies from source to trophy room
 * Used when completing a problem
 */
export function FlyingNode({ trigger, onComplete }: FlyingNodeProps) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            scale: [1, 1.5, 0.5],
            x: [0, 100, 200],
            y: [0, -50, -100],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          onAnimationComplete={onComplete}
          className="fixed z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Glowing orb */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg shadow-pink-500/50">
              <Sparkles className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/* Trail effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-400/50 blur-md"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface TrophyRoomBadgeProps {
  count: number;
  onClick?: () => void;
}

/**
 * Trophy room indicator that receives flying nodes
 */
export function TrophyRoomBadge({ count, onClick }: TrophyRoomBadgeProps) {
  const [isGlowing, setIsGlowing] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsGlowing(true)}
      onHoverEnd={() => setIsGlowing(false)}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 transition-all duration-300 ${isGlowing ? "shadow-lg shadow-amber-500/30" : ""}`}
      >
        <Trophy
          className={`w-5 h-5 text-amber-400 ${isGlowing ? "animate-bounce" : ""}`}
        />
        <span className="font-bold text-amber-400">{count}</span>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-amber-500/20 blur-xl -z-10"
        animate={{ opacity: isGlowing ? 1 : 0 }}
      />
    </motion.button>
  );
}

interface PulseRingProps {
  color?: "pink" | "cyan" | "green";
  size?: "sm" | "md" | "lg";
}

/**
 * Pulsing ring animation for active/live indicators
 */
export function PulseRing({ color = "pink", size = "md" }: PulseRingProps) {
  const colorClasses = {
    pink: "bg-pink-400",
    cyan: "bg-cyan-400",
    green: "bg-green-400",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span className="relative flex">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-75`}
      />
      <span
        className={`relative inline-flex rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </span>
  );
}

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

/**
 * Typewriter effect for text
 */
export function TypewriterText({
  text,
  delay = 50,
  className = "",
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useState(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  });

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

interface CardShimmerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card with shimmer effect on hover
 */
export function CardShimmer({ children, className = "" }: CardShimmerProps) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      {children}
    </div>
  );
}
