"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getContent, loadContent } from "@/lib/content-cms";
import type { PortfolioContent } from "@/lib/content-cms";
import { useTheme } from "next-themes";

const realms = [
  { href: "/fantasy", label: "The Origin", id: "origin" },
  { href: "/fantasy/forge", label: "The Forge", id: "forge" },
  { href: "/fantasy/codex", label: "The Codex", id: "codex" },
  { href: "/fantasy/bridge", label: "The Bridge", id: "bridge" },
];

export function FantasyNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch(() => {
        setContent(getContent());
      });
  }, []);

  const isDark = theme === "dark";

  return (
    <nav
      className={`sticky top-0 z-40 border-b ${
        isDark ? "border-red-900/50" : "border-cyan-300/50"
      } backdrop-blur supports-[backdrop-filter]:bg-background/60`}
    >
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Portal Logo */}
        <Link
          href="/fantasy"
          className={`text-xl font-bold tracking-wider ${
            isDark ? "text-red-500 glow-dark" : "text-cyan-400"
          }`}
          style={{
            textShadow: isDark
              ? "0 0 10px rgba(255,0,0,0.5)"
              : "0 0 10px rgba(0,217,255,0.5)",
          }}
        >
          ◆ {content?.metadata.name || "Traveler"} ◆
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {realms.map((realm) => (
            <Link key={realm.id} href={realm.href}>
              <button
                className={`px-4 py-2 rounded-lg smooth-transition text-sm font-bold game-button ${
                  pathname === realm.href
                    ? isDark
                      ? "border-red-500 bg-red-900/30"
                      : "border-cyan-400 bg-cyan-400/20"
                    : isDark
                    ? "border-red-800/30 hover:border-red-600"
                    : "border-cyan-200/30 hover:border-cyan-400"
                }`}
                style={{
                  border: `2px solid ${
                    pathname === realm.href
                      ? isDark
                        ? "#ff0000"
                        : "#00d9ff"
                      : (isDark ? "#8B0000" : "#00d9ff") + "40"
                  }`,
                }}
              >
                {realm.label}
              </button>
            </Link>
          ))}

          {/* Divider */}
          <div
            className={`h-6 w-px ${
              isDark ? "bg-red-900/50" : "bg-cyan-300/50"
            } mx-2`}
          />

          {/* Theme Switcher */}
          <ThemeSwitcher showModeSwitch={true} />

          {/* Exit Fantasy */}
          <button
            onClick={() => router.push("/classic")}
            className={`ml-2 px-4 py-2 border rounded-lg text-sm font-bold game-button ${
              isDark
                ? "border-red-600/60 text-red-400 hover:bg-red-900/20"
                : "border-cyan-400/60 text-cyan-400 hover:bg-cyan-400/10"
            }`}
          >
            ◄ CLASSIC
          </button>
        </div>
      </div>
    </nav>
  );
}
