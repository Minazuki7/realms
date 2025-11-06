"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ThemeSwitcherProps {
  showModeSwitch?: boolean;
  variant?: "minimal" | "full";
}

export function ThemeSwitcher({
  showModeSwitch = false,
  variant = "minimal",
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + T for theme toggle
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "t"
      ) {
        e.preventDefault();
        setTheme(theme === "light" ? "dark" : "light");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [theme, setTheme, router]);

  if (!mounted) return null;

  if (variant === "minimal") {
    return (
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="group relative p-2.5 rounded-lg overflow-hidden smooth-transition hover:scale-110 dark:led-button"
        title="Toggle theme (Cmd+Shift+T)"
      >
        <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-lg border border-white/10 group-hover:border-primary/40 group-hover:bg-white/[0.08] smooth-transition dark:border-purple-500/40 dark:group-hover:border-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 smooth-transition dark:from-primary/20 dark:to-accent/20 rounded-lg" />
        <span className="relative z-10 text-lg group-hover:scale-125 smooth-transition inline-block">
          {theme === "light" ? "🌙" : "☀️"}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {["light", "dark"].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t as "light" | "dark")}
            className={`group relative px-3 py-1.5 rounded-lg text-sm font-medium smooth-transition overflow-hidden ${
              theme === t
                ? "text-primary-foreground"
                : "text-foreground/70 hover:text-primary"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-lg smooth-transition ${
                theme === t
                  ? "bg-gradient-to-r from-primary to-accent dark:shadow-lg dark:shadow-primary/30"
                  : "bg-white/[0.03] backdrop-blur-xl border border-white/10 group-hover:border-primary/40 group-hover:bg-white/[0.06] dark:border-purple-500/40 dark:group-hover:border-primary/60"
              }`}
            />
            <span className="relative z-10 capitalize">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
