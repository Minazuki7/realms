"use client";

import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import type React from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "slide-left"
    | "slide-right";
  delay?: number;
  triggerOnce?: boolean;
}

export function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  triggerOnce = true,
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce });

  const animationMap: Record<string, string> = {
    "fade-up": "animate-fade-in-up",
    "fade-down": "animate-fade-in-down",
    "fade-left": "animate-fade-in-left",
    "fade-right": "animate-fade-in-right",
    scale: "animate-scale-in",
    "slide-left": "animate-slide-in-left",
    "slide-right": "animate-slide-in-right",
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-500 my-2",
        isVisible ? animationMap[animation] : "opacity-0",
        className
      )}
      style={{
        animationDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
