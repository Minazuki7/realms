"use client"

import { RealmCard } from "./realm-card"
import { getContent } from "@/lib/content-cms"

export function ForgeRealm() {
  const content = getContent()
  const forge = content.fantasy.forge

  return (
    <section id="forge" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <RealmCard title={forge.title} description={forge.description} content={forge.content} />

        {/* Magical Artifacts (Projects) */}
        <div className="mt-20 space-y-8">
          <h2 className="text-2xl font-bold text-mystical">Magical Artifacts Created</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.classic.projects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-lg border border-mystical/20 bg-mystical/5 hover:bg-mystical/10 smooth-transition group cursor-pointer"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-mystical group-hover:text-glow smooth-transition">
                    {project.title}
                  </h3>
                  <p className="text-sm text-foreground/70">{project.description}</p>
                  <p className="text-sm text-muted-foreground">{project.content}</p>

                  {/* Rune tags */}
                  <div className="flex flex-wrap gap-2 pt-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-mystical/20 text-mystical/80 border border-mystical/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
