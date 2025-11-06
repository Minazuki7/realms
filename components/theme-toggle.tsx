"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t") {
        setTheme(theme === "light" ? "dark" : "light");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [theme, setTheme]);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center gap-3 p-1 bg-muted rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={`px-3 py-2 rounded smooth-transition text-sm font-medium ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-3 py-2 rounded smooth-transition text-sm font-medium ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        🌙 Dark
      </button>
    </div>
  );
}
