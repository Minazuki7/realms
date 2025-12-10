"use client";

import { useEffect, useState, useRef } from "react";
import "@/styles/secret-love.css";

// Realistic Butterfly component with detailed CSS
const Butterfly = ({
  delay,
  startX,
  startY,
  variant,
}: {
  delay: number;
  startX: number;
  startY: number;
  variant: number;
}) => {
  // Different butterfly color schemes for variety
  const colorSchemes = [
    {
      primary: "#ff6b9d",
      secondary: "#c44569",
      accent: "#f8a5c2",
      spots: "#2d1f2d",
    },
    {
      primary: "#a55eea",
      secondary: "#8854d0",
      accent: "#d1a3ff",
      spots: "#2d1f3d",
    },
    {
      primary: "#ff9ff3",
      secondary: "#f368e0",
      accent: "#ffccf9",
      spots: "#3d1f3d",
    },
    {
      primary: "#ffa502",
      secondary: "#ff6348",
      accent: "#ffd43b",
      spots: "#3d2f1f",
    },
    {
      primary: "#70a1ff",
      secondary: "#5352ed",
      accent: "#a4b0ff",
      spots: "#1f2d3d",
    },
  ];

  const colors = colorSchemes[variant % colorSchemes.length];
  const size = 0.8 + (variant % 3) * 0.2; // Vary sizes

  return (
    <div
      className={`realistic-butterfly-container butterfly-path-${variant % 4}`}
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}s`,
        transform: `scale(${size})`,
      }}
    >
      <div className="realistic-butterfly">
        {/* Left wing set */}
        <div className="wing-group left-wings">
          {/* Upper left wing */}
          <div
            className="upper-wing left"
            style={{
              background: `radial-gradient(ellipse at 30% 40%, ${colors.accent} 0%, ${colors.primary} 40%, ${colors.secondary} 100%)`,
            }}
          >
            <div className="wing-pattern">
              <span
                className="spot spot-1"
                style={{ background: colors.spots }}
              ></span>
              <span
                className="spot spot-2"
                style={{ background: colors.spots }}
              ></span>
              <span
                className="spot spot-3"
                style={{ background: colors.accent }}
              ></span>
            </div>
            <div className="wing-veins"></div>
          </div>
          {/* Lower left wing */}
          <div
            className="lower-wing left"
            style={{
              background: `radial-gradient(ellipse at 40% 30%, ${colors.accent} 0%, ${colors.primary} 50%, ${colors.secondary} 100%)`,
            }}
          >
            <div className="wing-pattern">
              <span className="dot" style={{ background: colors.spots }}></span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="butterfly-body">
          <div className="head">
            <div className="antenna left-antenna"></div>
            <div className="antenna right-antenna"></div>
            <div className="eye left-eye"></div>
            <div className="eye right-eye"></div>
          </div>
          <div className="thorax"></div>
          <div className="abdomen"></div>
        </div>

        {/* Right wing set */}
        <div className="wing-group right-wings">
          {/* Upper right wing */}
          <div
            className="upper-wing right"
            style={{
              background: `radial-gradient(ellipse at 70% 40%, ${colors.accent} 0%, ${colors.primary} 40%, ${colors.secondary} 100%)`,
            }}
          >
            <div className="wing-pattern">
              <span
                className="spot spot-1"
                style={{ background: colors.spots }}
              ></span>
              <span
                className="spot spot-2"
                style={{ background: colors.spots }}
              ></span>
              <span
                className="spot spot-3"
                style={{ background: colors.accent }}
              ></span>
            </div>
            <div className="wing-veins"></div>
          </div>
          {/* Lower right wing */}
          <div
            className="lower-wing right"
            style={{
              background: `radial-gradient(ellipse at 60% 30%, ${colors.accent} 0%, ${colors.primary} 50%, ${colors.secondary} 100%)`,
            }}
          >
            <div className="wing-pattern">
              <span className="dot" style={{ background: colors.spots }}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Flower petal component
const Flower = ({
  delay,
  x,
  size,
}: {
  delay: number;
  x: number;
  size: number;
}) => {
  const colors = [
    "bg-pink-300",
    "bg-rose-300",
    "bg-pink-400",
    "bg-fuchsia-300",
    "bg-purple-300",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={`flower-petal absolute ${color} rounded-full opacity-70`}
      style={{
        left: `${x}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// Heart particle
const Heart = ({ delay, x }: { delay: number; x: number }) => {
  return (
    <div
      className="heart-float absolute text-pink-400 opacity-60"
      style={{
        left: `${x}%`,
        animationDelay: `${delay}s`,
        fontSize: `${Math.random() * 20 + 15}px`,
      }}
    >
      ♥
    </div>
  );
};

// Floating photo component - waterfall style with random positions
const FloatingPhoto = ({
  index,
  imageSrc,
  startDelay,
  xPosition,
}: {
  index: number;
  imageSrc?: string;
  startDelay: number;
  xPosition: number;
}) => {
  const rotations = [-12, 8, -5, 15, -8, 10, -15, 5];
  const rotate = rotations[index % rotations.length];
  const durations = [18, 22, 16, 20, 24, 19, 21, 17];
  const duration = durations[index % durations.length];

  return (
    <div
      className="waterfall-photo absolute"
      style={{
        left: `${xPosition}%`,
        animationDelay: `${startDelay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div
        className="photo-frame bg-white/90 p-2 rounded-lg shadow-2xl"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Memory ${index + 1}`}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"
          />
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-200 via-rose-200 to-purple-200 rounded-md flex items-center justify-center overflow-hidden">
            <div className="text-center p-2">
              <span className="text-4xl">💕</span>
              <p className="text-xs text-pink-600 mt-1 font-medium">
                Memory {index + 1}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sparkle effect
const Sparkle = ({ x, y, delay }: { x: number; y: number; delay: number }) => {
  return (
    <div
      className="sparkle absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      ✨
    </div>
  );
};

export default function SecretPage() {
  const [showContent, setShowContent] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLIFrameElement>(null);

  const loveMessages = [
    "Happy Birthday, My Love ♥",
    "Through every storm, I'm here",
    "I'll always take care of your fears",
    "You're my strength, my everything",
    "Better days are coming, together",
    "Forever yours, no matter what",
  ];

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setShowContent(true), 500);

    // Cycle through love messages
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loveMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Pre-generated positions for consistent rendering (iPhone 7 optimization)
  // Using fixed seeds for smooth experience
  const butterflies = [
    { id: 0, delay: 0, startX: 15, startY: 25 },
    { id: 1, delay: 2, startX: 75, startY: 20 },
    { id: 2, delay: 4, startX: 45, startY: 65 },
    { id: 3, delay: 6, startX: 85, startY: 45 },
    { id: 4, delay: 8, startX: 25, startY: 75 },
    { id: 5, delay: 10, startX: 60, startY: 35 },
  ];

  // Generate flower petals (reduced for performance)
  const flowers = [
    { id: 0, delay: 0, x: 10, size: 12 },
    { id: 1, delay: 0.5, x: 25, size: 10 },
    { id: 2, delay: 1, x: 40, size: 14 },
    { id: 3, delay: 1.5, x: 55, size: 11 },
    { id: 4, delay: 2, x: 70, size: 13 },
    { id: 5, delay: 2.5, x: 85, size: 10 },
    { id: 6, delay: 3, x: 15, size: 12 },
    { id: 7, delay: 3.5, x: 35, size: 11 },
    { id: 8, delay: 4, x: 50, size: 14 },
    { id: 9, delay: 4.5, x: 65, size: 10 },
    { id: 10, delay: 5, x: 80, size: 13 },
    { id: 11, delay: 5.5, x: 95, size: 11 },
  ];

  // Generate hearts (reduced for performance)
  const hearts = [
    { id: 0, delay: 0, x: 10 },
    { id: 1, delay: 1.2, x: 30 },
    { id: 2, delay: 2.4, x: 50 },
    { id: 3, delay: 3.6, x: 70 },
    { id: 4, delay: 4.8, x: 90 },
    { id: 5, delay: 6, x: 20 },
    { id: 6, delay: 7.2, x: 45 },
    { id: 7, delay: 8.4, x: 75 },
  ];

  // Generate sparkles (reduced for performance)
  const sparkles = [
    { id: 0, x: 10, y: 20, delay: 0 },
    { id: 1, x: 30, y: 40, delay: 0.5 },
    { id: 2, x: 50, y: 15, delay: 1 },
    { id: 3, x: 70, y: 60, delay: 1.5 },
    { id: 4, x: 90, y: 35, delay: 2 },
    { id: 5, x: 20, y: 75, delay: 2.5 },
    { id: 6, x: 40, y: 55, delay: 3 },
    { id: 7, x: 60, y: 80, delay: 3.5 },
    { id: 8, x: 80, y: 25, delay: 4 },
    { id: 9, x: 15, y: 45, delay: 4.5 },
    { id: 10, x: 55, y: 70, delay: 5 },
    { id: 11, x: 85, y: 50, delay: 5.5 },
  ];

  // Photos array - Using local images from public/safa folder
  const photos = [
    "/safa/photo1.jpeg",
    "/safa/photo2.jpeg",
    "/safa/photo3.jpeg",
    "/safa/photo4.jpeg",
    "/safa/photo5.jpeg",
    "/safa/photo6.jpeg",
  ];

  // Pre-calculated random positions and delays for photos (only 4 for cleaner look)
  const photoConfigs = [
    { xPosition: 10, startDelay: 0 },
    { xPosition: 35, startDelay: 4 },
    { xPosition: 60, startDelay: 8 },
    { xPosition: 85, startDelay: 12 },
  ];

  return (
    <div
      ref={containerRef}
      className="secret-love-page min-h-screen overflow-hidden relative"
    >
      {/* Hidden YouTube player for background music */}
      {musicStarted && (
        <iframe
          ref={audioRef}
          className="hidden"
          width="0"
          height="0"
          src="https://www.youtube.com/embed/QNYT9wVwQ8A?autoplay=1&loop=1&playlist=QNYT9wVwQ8A"
          allow="autoplay"
          style={{ position: "absolute", visibility: "hidden" }}
        />
      )}

      {/* Beautiful start overlay - needed for autoplay policy */}
      {!musicStarted && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 flex flex-col items-center justify-center">
          <div className="text-center px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-lg animate-pulse">
              ✨ A Special Gift For You ✨
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Tap to open your surprise, my love 💕
            </p>
            <button
              onClick={() => setMusicStarted(true)}
              className="group relative px-8 py-4 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 text-white text-xl font-semibold shadow-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-3">
                <span className="text-3xl">💌</span>
                Open Your Gift
                <span className="text-3xl">🌹</span>
              </span>
            </button>
            <p className="text-white/70 text-sm mt-6">
              🎵 With music, made with love 🎵
            </p>
          </div>

          {/* Floating hearts on start screen */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-bounce opacity-60"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "2s",
                }}
              >
                {i % 2 === 0 ? "💖" : "🌸"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300 via-rose-400 to-purple-500 animate-gradient-shift" />

      {/* Overlay pattern */}
      <div className="fixed inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]" />

      {/* Butterflies */}
      {butterflies.map((b) => (
        <Butterfly
          key={b.id}
          delay={b.delay}
          startX={b.startX}
          startY={b.startY}
          variant={b.id}
        />
      ))}

      {/* Falling flower petals */}
      {flowers.map((f) => (
        <Flower key={f.id} delay={f.delay} x={f.x} size={f.size} />
      ))}

      {/* Floating hearts */}
      {hearts.map((h) => (
        <Heart key={h.id} delay={h.delay} x={h.x} />
      ))}

      {/* Sparkles */}
      {sparkles.map((s) => (
        <Sparkle key={s.id} x={s.x} y={s.y} delay={s.delay} />
      ))}

      {/* Floating photos gallery - only 4 photos for cleaner look */}
      {photos.slice(0, 4).map((src, i) => (
        <FloatingPhoto
          key={i}
          index={i}
          imageSrc={src}
          startDelay={photoConfigs[i].startDelay}
          xPosition={photoConfigs[i].xPosition}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Animated title */}
        <div
          className={`transition-all duration-1000 ease-out ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg mb-4 flirty-text">
            {loveMessages[currentText]}
          </h1>
        </div>

        {/* Love note card */}
        <div
          className={`mt-8 max-w-md mx-auto transition-all duration-1000 delay-300 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="love-card bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/40">
            <p className="text-white text-lg sm:text-xl text-center leading-relaxed font-medium">
              Happy Birthday, my beautiful Safa 💕
              <br />
              <br />
              I know we're going through a hard time right now, but I want you
              to know - I will always be here to take care of your fears, to
              hold you when the world feels heavy.
              <br />
              <br />
              You are my eternal happiness. Better days are ahead of us, and
              I'll be right beside you through it all. I love you more than
              words could ever say.
              <br />
              <br />
              <span className="text-2xl">💕</span>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          className={`mt-8 flex gap-4 transition-all duration-1000 delay-500 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0s" }}
          >
            🌺
          </span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            🌸
          </span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            💖
          </span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.6s" }}
          >
            🌸
          </span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.8s" }}
          >
            🌺
          </span>
        </div>

        {/* Photo gallery section */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-700 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-4">
            Happy Birthday, My Everything ✨
          </h2>
          <p className="text-white/90 text-sm">
            Through every storm, my heart belongs to you, always and forever.
          </p>
        </div>
      </div>
    </div>
  );
}
