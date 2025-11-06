"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Mode = "classic" | "fantasy"
type Theme = "light" | "dark"

interface ThemeContextType {
  mode: Mode
  theme: Theme
  setMode: (mode: Mode) => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("classic")
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("portfolio-mode") as Mode | null
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null

    if (savedMode) setMode(savedMode)
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      }
    }

    setMounted(true)
  }, [])

  // Save to localStorage when changed
  const handleSetMode = (newMode: Mode) => {
    setMode(newMode)
    localStorage.setItem("portfolio-mode", newMode)
  }

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("portfolio-theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        setMode: handleSetMode,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
