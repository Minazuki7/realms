"use client";

import { useTheme } from "next-themes";

export function ExtremeBackground() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="fantasy-container">
      {/* Parallax background layers */}
      <div
        className="parallax-layer far"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 100%)"
            : "linear-gradient(135deg, #e8d5ff 0%, #f5d9ff 100%)",
        }}
      />

      <div
        className="parallax-layer mid"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0f0a1a 0%, #1a0a0a 100%)"
            : "linear-gradient(135deg, #e0c9ff 0%, #ffd9f0 100%)",
        }}
      />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 animate-[gradient-shift_8s_ease_infinite]"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #0f0a1a 50%, #1a0a0a 75%, #0a0a0a 100%)"
              : "linear-gradient(135deg, #e8d5ff 0%, #f5d9ff 25%, #e0c9ff 50%, #ffd9f0 75%, #e8d5ff 100%)",
            backgroundSize: "400% 400%",
          }}
        />

        {/* Distortion layer for dark mode */}
        {isDark && <div className="distortion-layer" />}

        {/* Floating orbs - light mode */}
        {!isDark && (
          <>
            <div
              className="absolute w-96 h-96 rounded-full opacity-25 blur-3xl glow-aura-light"
              style={{
                background: "radial-gradient(circle, #00d9ff, transparent)",
                top: "10%",
                right: "10%",
                animation: "float 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-80 h-80 rounded-full opacity-25 blur-3xl glow-aura-light"
              style={{
                background: "radial-gradient(circle, #ff006e, transparent)",
                bottom: "15%",
                left: "5%",
                animation: "float 10s ease-in-out infinite reverse",
              }}
            />
            <div
              className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl glow-aura-light"
              style={{
                background: "radial-gradient(circle, #b5179e, transparent)",
                top: "50%",
                left: "50%",
                animation: "float 12s ease-in-out infinite",
              }}
            />
          </>
        )}

        {/* Scanlines and cursed patterns - dark mode */}
        {isDark && (
          <>
            <div
              className="absolute w-full h-full opacity-15"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(139,0,0,0.15) 0px, transparent 2px, transparent 4px)",
                animation: "float 4s linear infinite",
              }}
            />
            <div
              className="absolute inset-0 opacity-10 glow-aura-dark"
              style={{
                background:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%238B0000' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                animation: "float 6s linear infinite reverse",
              }}
            />
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </div>
  );
}
