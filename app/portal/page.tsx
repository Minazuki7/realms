"use client"

import { ModeSelector } from "@/components/mode-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedText } from "@/components/animated-text"
import { useEffect, useState } from "react"

export default function PortalPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-secondary p-4 overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 right-8 z-10 animate-fade-in-down">
        <ThemeToggle />
      </div>

      {/* Portal Content */}
      <div className="space-y-8 text-center max-w-3xl">
        {/* Title Section */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-balance">
            <AnimatedText text="Traveler Between Realms" animationType="glow" />
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed stagger-2 animate-fade-in-up">
            Two worlds. One journey. Choose your path and discover how creativity and technology converge across
            dimensions.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="stagger-3 animate-fade-in-up">
          <ModeSelector />
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-border stagger-4 animate-fade-in-up">
          <p className="text-sm text-muted-foreground">
            Keyboard shortcuts: <span className="font-mono font-semibold">C</span> for Classic,{" "}
            <span className="font-mono font-semibold">F</span> for Fantasy,{" "}
            <span className="font-mono font-semibold">T</span> for Theme
          </p>
        </div>
      </div>

      {/* Floating Elements with enhanced animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50 animate-float" />
        <div
          className="absolute bottom-40 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-36 h-36 bg-mystical/5 rounded-full blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </main>
  )
}
