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
      className="p-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/20 hover:border-primary/50 hover:bg-white/10 smooth-transition group"
      aria-label="Toggle theme"
      title="Press 'L' to toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-foreground group-hover:text-primary smooth-transition" />
      ) : (
        <Moon className="w-5 h-5 text-foreground group-hover:text-primary smooth-transition" />
      )}
    </button>
  );
}
