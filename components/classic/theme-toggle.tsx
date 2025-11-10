"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ClassicThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/20 hover:border-primary/50 hover:bg-white/10 smooth-transition">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/20 hover:border-primary/50 hover:bg-white/10 smooth-transition group overflow-hidden"
      aria-label="Toggle theme"
      title="Press 'L' to toggle theme"
    >
      {/* Animated glow background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 smooth-transition">
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-lg blur-md" />
      </div>

      {/* Icon container with rotation animation */}
      <div className="relative flex items-center justify-center">
        {theme === "dark" ? (
          // Sun - slides in and rotates
          <Sun
            className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 smooth-transition animate-sun-rise"
            style={{
              animation:
                "sunRise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))",
            }}
          />
        ) : (
          // Moon - slides in and glows
          <Moon
            className="w-5 h-5 text-purple-700 group-hover:text-purple-500 smooth-transition animate-moon-rise"
            style={{
              animation:
                "moonRise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              filter: "drop-shadow(0 0 10px rgba(147, 197, 253, 0.8))",
            }}
          />
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes sunRise {
          0% {
            opacity: 0;
            transform: translateY(12px) rotateZ(-180deg) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateZ(0deg) scale(1);
          }
        }

        @keyframes moonRise {
          0% {
            opacity: 0;
            transform: translateY(-12px) rotateZ(180deg) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateZ(0deg) scale(1);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(250, 204, 21, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.8));
          }
        }

        .animate-sun-rise {
          animation: sunRise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-moon-rise {
          animation: moonRise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </button>
  );
}
