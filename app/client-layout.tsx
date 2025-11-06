"use client";

import type React from "react";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useTheme as useNextTheme } from "next-themes";

// Custom hook to handle theme keyboard shortcut
function ThemeKeyboardHandler() {
  const { setTheme, theme } = useNextTheme();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "l" || e.key === "L") {
        // Toggle theme on L key press
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setTheme, theme]);

  return null;
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="portfolio-theme"
    >
      <ThemeKeyboardHandler />
      {children}
      <Analytics />
    </NextThemesProvider>
  );
}
