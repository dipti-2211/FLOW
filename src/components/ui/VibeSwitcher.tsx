"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Monitor, Moon, Sparkles } from "lucide-react";

// Vibe modes: System (standard), Deep Focus (neon pink on black), Roommate (soft pastels)
type VibeMode = "system" | "deep-focus" | "roommate";

interface VibeContextType {
  vibe: VibeMode;
  setVibe: (vibe: VibeMode) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function useVibe() {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error("useVibe must be used within a VibeProvider");
  }
  return context;
}

interface VibeProviderProps {
  children: ReactNode;
}

export function VibeProvider({ children }: VibeProviderProps) {
  const [vibe, setVibeState] = useState<VibeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("vibe-mode") as VibeMode;
    if (stored && ["system", "deep-focus", "roommate"].includes(stored)) {
      setVibeState(stored);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("vibe-mode", vibe);
      document.documentElement.setAttribute("data-vibe", vibe);
    }
  }, [vibe, mounted]);

  const setVibe = (newVibe: VibeMode) => {
    setVibeState(newVibe);
  };

  return (
    <VibeContext.Provider value={{ vibe, setVibe }}>
      {children}
    </VibeContext.Provider>
  );
}

export default function VibeSwitcher() {
  const { vibe, setVibe } = useVibe();
  const [isOpen, setIsOpen] = useState(false);

  const vibes: {
    mode: VibeMode;
    label: string;
    icon: typeof Monitor;
    description: string;
  }[] = [
    {
      mode: "system",
      label: "System",
      icon: Monitor,
      description: "Clean & professional",
    },
    {
      mode: "deep-focus",
      label: "Deep Focus",
      icon: Moon,
      description: "Neon pink on black",
    },
    {
      mode: "roommate",
      label: "Roommate",
      icon: Sparkles,
      description: "Soft pastels",
    },
  ];

  const currentVibe = vibes.find((v) => v.mode === vibe) || vibes[0];
  const CurrentIcon = currentVibe.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-56 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="vibe-glass-card rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="p-3 border-b border-white/5">
              <p className="text-xs font-mono text-slate-400">
                // select your vibe
              </p>
            </div>
            <div className="p-2">
              {vibes.map((v) => {
                const Icon = v.icon;
                const isActive = vibe === v.mode;
                return (
                  <button
                    key={v.mode}
                    onClick={() => {
                      setVibe(v.mode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-pink-500/20 text-pink-400"
                        : "hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-pink-400" : "text-slate-500"}`}
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{v.label}</p>
                      <p className="text-xs text-slate-500">{v.description}</p>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
          isOpen
            ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
            : "vibe-glass-card hover:border-pink-500/30"
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />

        <CurrentIcon className="relative w-4 h-4" />
        <span className="relative text-sm font-mono">{currentVibe.label}</span>

        {/* Animated indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
        </span>
      </button>
    </div>
  );
}
