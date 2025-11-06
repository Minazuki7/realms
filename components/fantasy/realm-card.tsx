"use client"

interface RealmCardProps {
  title: string
  description: string
  content: string
  heroText?: string
}

export function RealmCard({ title, description, content, heroText }: RealmCardProps) {
  return (
    <div className="space-y-8 py-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-block">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-mystical text-balance glow">{title}</h1>
        </div>
        <p className="text-lg text-muted-foreground italic max-w-2xl">{description}</p>
      </div>

      {/* Hero Text */}
      {heroText && (
        <blockquote className="border-l-4 border-mystical pl-6 py-4 text-xl italic text-foreground">
          "{heroText}"
        </blockquote>
      )}

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">{content}</p>
      </div>
    </div>
  )
}
