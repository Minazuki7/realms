"use client"

import { useEffect, useRef } from "react"

export function useCursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create glow element
    const glow = document.createElement("div")
    glow.className = "pointer-events-none fixed w-8 h-8 rounded-full border-2 border-mystical/30 glow"
    glow.id = "cursor-glow"
    document.body.appendChild(glow)

    const handleMouseMove = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = e.clientX - 16 + "px"
        glow.style.top = e.clientY - 16 + "px"
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      glow.remove()
    }
  }, [])
}
