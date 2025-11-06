import { getBio, getSettings } from "@/lib/cms";
import { AnimatedSection } from "@/components/animated-section";
import { ContactForm } from "@/components/contact-form";

export function ClassicContact() {
  const bio = getBio();
  const settings = getSettings();

  return (
    <section id="contact" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/6 rounded-full blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tl from-accent/8 to-primary/5 rounded-full blur-3xl opacity-25 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12">
        <AnimatedSection animation="fade-up">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="mt-3 text-foreground/60">
              Let's collaborate on something great
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-up" delay={100}>
            <ContactForm />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="space-y-8">
              {/* Email contact card */}
              <div className="group relative p-6 rounded-xl overflow-hidden dark:neo-glow">
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl border border-white/10 group-hover:border-primary/50 group-hover:bg-white/[0.08] rounded-xl smooth-transition dark:border-purple-500/40 dark:group-hover:border-primary/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/12 opacity-0 group-hover:opacity-100 smooth-transition rounded-xl dark:from-primary/25 dark:to-accent/20" />

                <div className="relative z-10">
                  <h3 className="font-bold text-foreground/80 mb-2">Email</h3>
                  <a
                    href={`mailto:${bio.email}`}
                    className="text-primary hover:text-accent smooth-transition font-medium flex items-center gap-2"
                  >
                    {bio.email}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Social links card */}
              <div className="group relative p-6 rounded-xl overflow-hidden dark:neo-glow">
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl border border-white/10 group-hover:border-primary/50 group-hover:bg-white/[0.08] rounded-xl smooth-transition dark:border-purple-500/40 dark:group-hover:border-primary/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/12 opacity-0 group-hover:opacity-100 smooth-transition rounded-xl dark:from-primary/25 dark:to-accent/20" />

                <div className="relative z-10">
                  <h3 className="font-bold text-foreground/80 mb-4">Connect</h3>
                  <div className="space-y-2">
                    {Object.entries(settings.socials)
                      .filter(([, url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-accent smooth-transition capitalize font-medium flex items-center gap-2 group/link"
                        >
                          {platform}
                          <svg
                            className="w-4 h-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 smooth-transition"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
