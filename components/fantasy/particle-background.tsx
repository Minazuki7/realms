"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isDark = theme === "dark";
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles with varied behaviors
    const particleCount = isDark ? 60 : 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isDark ? 0.8 : 0.6),
        vy: (Math.random() - 0.5) * (isDark ? 0.8 : 0.6),
        size: Math.random() * (isDark ? 3 : 2.5) + (isDark ? 0.5 : 1),
        opacity: Math.random() * 0.6 + 0.2,
        color: isDark
          ? `rgba(${
              Math.random() > 0.6
                ? "255,0,0"
                : Math.random() > 0.3
                ? "139,0,0"
                : "200,0,50"
            },`
          : `rgba(${
              Math.random() > 0.5
                ? "0,217,255"
                : Math.random() > 0.3
                ? "181,23,158"
                : "255,0,110"
            },`,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.fillStyle = `${particle.color}${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{ opacity: theme === "dark" ? 0.4 : 0.3 }}
    />
  );
}
