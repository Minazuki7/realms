"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollAnimation(
  options: {
    threshold?: number
    triggerOnce?: boolean
  } = {},
) {
  const { threshold = 0.1, triggerOnce = true } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasAnimated(true)
            observer.unobserve(entry.target)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, triggerOnce])

  return { elementRef, isVisible: triggerOnce ? hasAnimated : isVisible }
}
