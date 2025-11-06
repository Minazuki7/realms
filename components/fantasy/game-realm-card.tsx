"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

interface GameRealmCardProps {
  title: string;
  href: string;
  isLocked?: boolean;
  lockReason?: string;
  children?: React.ReactNode;
  icon?: string;
}

export function GameRealmCard({
  title,
  href,
  isLocked = false,
  lockReason = "Complete previous realms to unlock",
  children,
  icon = "🔮",
}: GameRealmCardProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = () => {
    if (isLocked) {
      setIsUnlocking(true);
      setTimeout(() => setIsUnlocking(false), 500);
    }
  };

  const isDark = theme === "dark";

  return (
    <Link href={isLocked ? "#" : href}>
      <div
        className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 ${
          isLocked ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleUnlock}
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(30,0,15,0.9), rgba(139,0,0,0.1))"
            : "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(197,125,255,0.1))",
          border: `2px solid ${isDark ? "#ff0000" : "#00d9ff"}`,
          boxShadow:
            isHovered && !isLocked
              ? isDark
                ? "0 0 30px rgba(255,0,0,0.5)"
                : "0 0 30px rgba(0,217,255,0.5)"
              : "none",
          transform:
            isHovered && !isLocked ? "scale(1.05) rotateY(5deg)" : "scale(1)",
        }}
      >
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/50 backdrop-blur">
            <div className="text-5xl animate-pulse mb-2">🔐</div>
            <p className="text-sm font-bold text-white">{lockReason}</p>
          </div>
        )}

        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{icon}</span>
          <h3
            className={`text-2xl font-bold ${
              isDark ? "text-red-400" : "text-cyan-400"
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Unlock burst animation */}
        {isUnlocking && (
          <div
            className="absolute inset-0 animate-ping"
            style={{
              background: isDark
                ? "radial-gradient(circle, #ff0000, transparent)"
                : "radial-gradient(circle, #00d9ff, transparent)",
              borderRadius: "0.75rem",
            }}
          />
        )}

        {children && <div className="mt-4 text-sm opacity-80">{children}</div>}
      </div>
    </Link>
  );
}
