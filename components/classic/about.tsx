import { getBio } from "@/lib/cms";
import { AnimatedSection } from "@/components/animated-section";

export function ClassicAbout() {
  const bio = getBio();

  return (
    <section id="about" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/12 to-accent/8 rounded-full blur-3xl opacity-50 neo-glow animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute -bottom-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-accent/10 to-primary/6 rounded-full blur-3xl opacity-40 neo-glow animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12">
        <AnimatedSection animation="fade-up">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            <p className="text-lg text-foreground/75 leading-relaxed max-w-2xl">
              {bio.about}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ...bio.skills.languages.slice(0, 2),
              ...bio.skills.frontend.slice(0, 2),
              ...bio.skills.backend.slice(0, 2),
            ].map((skill, idx) => (
              <div
                key={skill}
                className="group relative p-6 rounded-xl overflow-hidden cursor-pointer hover:scale-105 smooth-transition neo-button"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/12 backdrop-blur-xl rounded-xl border border-primary/40 group-hover:border-primary/70 group-hover:bg-gradient-to-br group-hover:from-primary/25 group-hover:to-accent/20 smooth-transition neo-glow" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/8 opacity-0 group-hover:opacity-100 smooth-transition" />

                <div className="relative z-10 text-center">
                  <div className="font-semibold text-foreground group-hover:text-primary smooth-transition">
                    {skill}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
