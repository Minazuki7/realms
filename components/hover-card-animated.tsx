"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface HoverCardAnimatedProps {
  children: React.ReactNode
  className?: string
  glowEffect?: boolean
  scale?: boolean
}

export function HoverCardAnimated({
  children,
  className = "",
  glowEffect = false,
  scale = true,
}: HoverCardAnimatedProps) {
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        scale && "hover:scale-105",
        glowEffect && "hover:shadow-lg hover:shadow-primary/20",
        className,
      )}
    >
      {children}
    </div>
  )
}
