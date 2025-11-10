import { getBio } from "@/lib/cms-loader";
import { AnimatedSection } from "@/components/animated-section";

export async function ClassicAbout() {
  const bio = await getBio();

  if (!bio) {
    return <div>Bio data not available</div>;
  }

  return (
    <section id="about" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 left-1/3 w-96 h-96 bg-linear-to-br from-primary/12 to-accent/8 rounded-full blur-3xl opacity-50 neo-glow animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute -bottom-1/2 right-1/4 w-80 h-80 bg-linear-to-tl from-accent/10 to-primary/6 rounded-full blur-3xl opacity-40 neo-glow animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12">
        <AnimatedSection animation="fade-up">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            <p className="text-lg text-foreground/75 leading-relaxed max-w-2xl">
              {bio.about}
            </p>
          </div>
        </AnimatedSection>

        {/* Key Achievements */}
        {bio.keyAchievements && bio.keyAchievements.length > 0 && (
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Key Achievements
              </h3>
              <ul className="space-y-3">
                {bio.keyAchievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="group relative p-4 rounded-lg overflow-hidden hover:scale-[1.01] smooth-transition cursor-pointer dark:neo-glow"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-accent/8 backdrop-blur-sm rounded-lg border border-primary/30 group-hover:border-primary/60 group-hover:bg-linear-to-r group-hover:from-primary/15 group-hover:to-accent/12 smooth-transition dark:neo-glow" />
                    <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-accent/3 opacity-0 group-hover:opacity-100 smooth-transition" />

                    <div className="relative z-10 flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-primary to-accent mt-2 shrink-0" />
                      <p className="text-foreground/80 group-hover:text-foreground smooth-transition text-sm leading-relaxed">
                        {achievement}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        )}

        {/* Featured Skills Preview */}
        <AnimatedSection animation="fade-up" delay={300}>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Core Competencies
            </h3>

            {/* Frontend Skills */}
            {bio.skills.frontend?.expert &&
              bio.skills.frontend.expert.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">
                    Frontend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {bio.skills.frontend.expert.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-primary/20 to-accent/15 border border-primary/40 text-foreground/85 group-hover:border-primary/70 smooth-transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Backend Skills */}
            {bio.skills.backend?.expert &&
              bio.skills.backend.expert.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">
                    Backend
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {bio.skills.backend.expert.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-primary/20 to-accent/15 border border-primary/40 text-foreground/85"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Tools & DevOps */}
            {bio.skills.devops?.advanced &&
              bio.skills.devops.advanced.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">
                    DevOps & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {bio.skills.devops.advanced.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-primary/20 to-accent/15 border border-primary/40 text-foreground/85"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
