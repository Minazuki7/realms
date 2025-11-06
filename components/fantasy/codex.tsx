"use client"

import { RealmCard } from "./realm-card"
import { getContent } from "@/lib/content-cms"

export function CodexRealm() {
  const content = getContent()
  const codex = content.fantasy.codex

  const arcaneArts = [
    {
      rune: "⚛️",
      name: "React Incantations",
      powers: ["Component Binding", "State Alchemy", "Hook Sorcery"],
    },
    {
      rune: "▲",
      name: "Next.js Spellcraft",
      powers: ["Server Components", "Route Portals", "API Incantations"],
    },
    {
      rune: "🎨",
      name: "Design Enchantments",
      powers: ["TailwindCSS Weaving", "Responsive Transmutation", "Animation Magic"],
    },
    {
      rune: "🔮",
      name: "Arcane Knowledge",
      powers: ["TypeScript Runes", "PostgreSQL Divination", "System Architecture"],
    },
  ]

  return (
    <section id="codex" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <RealmCard title={codex.title} description={codex.description} content={codex.content} />

        {/* Arcane Arts Grid */}
        <div className="mt-20 space-y-8">
          <h2 className="text-2xl font-bold text-mystical">Arcane Arts Mastered</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {arcaneArts.map((art, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-mystical/30 bg-gradient-to-br from-mystical/10 to-arcane/10 hover:border-mystical/60 smooth-transition"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{art.rune}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-mystical mb-3">{art.name}</h3>
                    <ul className="space-y-1">
                      {art.powers.map((power, pidx) => (
                        <li key={pidx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-mystical" />
                          {power}
                        </li>
                      ))}
                    </ul>
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
