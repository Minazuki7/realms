"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function FairyCursor() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [trail, setTrail] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const [trailId, setTrailId] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Add to trail
      setTrailId((prev) => prev + 1);
      setTrail((prev) => [
        ...prev.slice(-8),
        { x: e.clientX, y: e.clientY, id: trailId },
      ]);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [trailId]);

  if (!isVisible) return null;

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M2 2 L2 28 L8 22 L16 28 L18 26 L10 20 L16 20 L2 2Z" fill="${
            isDark ? "%23FF0000" : "%2300D9FF"
          }" opacity="${
        isDark ? "0.9" : "0.8"
      }"/><circle cx="20" cy="8" r="3" fill="${
        isDark ? "%238B0000" : "%23B5179E"
      }" opacity="0.6"/><circle cx="24" cy="12" r="2" fill="${
        isDark ? "%23DC143C" : "%2300D9FF"
      }" opacity="0.5"/></svg>') 0 0, auto;
        }
      `}</style>

      {/* Trail particles */}
      {trail.map((point, idx) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            transform: "translate(-6px, -6px)",
            opacity: (idx / trail.length) * 0.6,
          }}
        >
          <div
            className={`text-lg ${isDark ? "text-red-500" : "text-cyan-400"}`}
          >
            {isDark ? "●" : "✦"}
          </div>
        </div>
      ))}

      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-12px, -12px)",
        }}
      >
        {theme === "dark" ? (
          <div
            className="text-3xl animate-pulse filter drop-shadow-lg"
            style={{
              textShadow: "0 0 10px #ff0000, 0 0 20px #8b0000",
            }}
          >
            💀
          </div>
        ) : (
          <div
            className="text-3xl animate-spin filter drop-shadow-lg"
            style={{
              textShadow: "0 0 10px #00d9ff, 0 0 20px #b5179e",
            }}
          >
            ✨
          </div>
        )}
      </div>
    </>
  );
}
