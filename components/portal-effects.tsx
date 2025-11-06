"use client"

export function PortalEffects() {
  return (
    <>
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 - Classic light */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse" />

        {/* Blob 2 - Fantasy mystical */}
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-mystical/15 rounded-full blur-3xl opacity-30 animate-pulse" />

        {/* Blob 3 - Accent */}
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-accent/10 rounded-full blur-3xl opacity-25 animate-pulse" />
      </div>

      {/* Animated grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </>
  )
}
