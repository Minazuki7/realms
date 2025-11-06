import { getBio } from "@/lib/cms";
import { AnimatedSection } from "@/components/animated-section";

export function ClassicSkills() {
  const bio = getBio();

  const skillCategories = [
    {
      name: "Languages",
      items: bio.skills.languages,
    },
    {
      name: "Frontend",
      items: bio.skills.frontend,
    },
    {
      name: "Backend",
      items: bio.skills.backend,
    },
    {
      name: "Tools & DevOps",
      items: bio.skills.tools,
    },
  ];

  return (
    <section id="skills" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-br from-primary/12 to-accent/8 rounded-full blur-3xl opacity-45 neo-glow animate-float"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-tl from-accent/10 to-primary/6 rounded-full blur-3xl opacity-40 neo-glow animate-float"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12">
        <AnimatedSection animation="fade-up">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Technical Skills
              </span>
            </h2>
            <p className="mt-3 text-foreground/60">
              Technologies and expertise
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, catIdx) => (
            <AnimatedSection
              key={category.name}
              animation="fade-up"
              delay={catIdx * 100}
            >
              <div className="group space-y-6">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text group-hover:text-primary smooth-transition">
                  {category.name}
                </h3>

                <ul className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <li
                      key={item}
                      className="group/item relative p-3 rounded-lg overflow-hidden hover:scale-105 smooth-transition cursor-pointer neo-button"
                      style={{ animationDelay: `${itemIdx * 50}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/15 backdrop-blur-sm rounded-lg border border-primary/40 group-hover/item:border-primary/70 group-hover/item:bg-gradient-to-r group-hover/item:from-primary/30 group-hover/item:to-accent/20 smooth-transition neo-glow" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-accent/10 opacity-0 group-hover/item:opacity-100 smooth-transition" />

                      <div className="relative z-10 flex items-center gap-3 smooth-transition group-hover/item:translate-x-1">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent group-hover/item:scale-150 smooth-transition neo-pulse" />
                        <span className="text-foreground/85 group-hover/item:text-primary smooth-transition font-medium">
                          {item}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
