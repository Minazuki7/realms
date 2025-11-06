"use client"

import { RealmCard } from "./realm-card"
import { getContent } from "@/lib/content-cms"
import { AnimatedSection } from "@/components/animated-section"
import { HoverCardAnimated } from "@/components/hover-card-animated"

export function OriginRealm() {
  const content = getContent()
  const origin = content.fantasy.origin

  return (
    <section id="origin" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection animation="fade-up">
          <RealmCard
            title={origin.title}
            description={origin.description}
            content={origin.content}
            heroText={origin.heroText}
          />
        </AnimatedSection>

        {/* Journey Timeline */}
        <AnimatedSection animation="fade-up" delay={300}>
          <div className="mt-20 space-y-8">
            <h2 className="text-2xl font-bold text-mystical">The Journey Thus Far</h2>
            <div className="space-y-6">
              {[
                {
                  year: "2015",
                  event: "The First Spark",
                  description: "Awakening to the digital realm",
                },
                {
                  year: "2018",
                  event: "Mastery Begins",
                  description: "Harnessing the power of code",
                },
                {
                  year: "2021",
                  event: "The Bridge Forms",
                  description: "Connecting magic and technology",
                },
                {
                  year: "Present",
                  event: "Between Worlds",
                  description: "Walking the path of the Traveler",
                },
              ].map((milestone, idx) => (
                <HoverCardAnimated key={idx} scale>
                  <div
                    className="flex gap-6 relative animate-fade-in-left"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-mystical animate-glow-pulse" />
                      {idx < 3 && <div className="w-0.5 h-12 bg-gradient-to-b from-mystical to-transparent mt-3" />}
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                      <p className="text-sm text-mystical font-semibold">{milestone.year}</p>
                      <h3 className="text-lg font-bold mt-1">{milestone.event}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
                    </div>
                  </div>
                </HoverCardAnimated>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
