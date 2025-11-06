"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface StaggeredContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggeredContainer({ children, className = "", staggerDelay = 100 }: StaggeredContainerProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {React.Children.map(children, (child, index) => (
        <div
          style={{
            animationDelay: `${index * staggerDelay}ms`,
          }}
          className="animate-fade-in-up"
        >
          {child}
        </div>
      ))}
    </div>
  )
}
