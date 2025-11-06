"use client"

import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  animationType?: "shimmer" | "glow" | "bounce"
}

export function AnimatedText({ text, className = "", animationType = "shimmer" }: AnimatedTextProps) {
  const animationMap: Record<string, string> = {
    shimmer: "animate-text-shimmer",
    glow: "text-foreground drop-shadow-lg",
    bounce: "animate-bounce",
  }

  return <span className={cn(animationMap[animationType], className)}>{text}</span>
}
