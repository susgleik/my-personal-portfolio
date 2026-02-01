"use client"

import { useState, useEffect, ReactNode } from "react"

interface PageLoaderProps {
  children: ReactNode
  minLoadTime?: number
}

export default function PageLoader({ children, minLoadTime = 400 }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Wait for minimum load time to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Small delay before showing content for smooth fade
      setTimeout(() => setShowContent(true), 50)
    }, minLoadTime)

    return () => clearTimeout(timer)
  }, [minLoadTime])

  return (
    <>
      {/* Loading Screen */}
      <div
        className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-300 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Animated Logo/Spinner */}
          <div className="relative">
            {/* Outer ring */}
            <div
              className="w-16 h-16 rounded-full border-2 border-white/10"
              style={{
                background: "radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent 70%)",
              }}
            />
            {/* Spinning arc */}
            <div
              className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin"
            />
            {/* Inner glow */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Loading text */}
          <div className="flex items-center gap-1">
            <span className="text-white/50 text-sm font-medium tracking-wider">AH</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div
        className={`transition-opacity duration-300 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  )
}
