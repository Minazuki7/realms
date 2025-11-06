import { getProjects } from "@/lib/cms";
import { AnimatedSection } from "@/components/animated-section";
import { StaggeredContainer } from "@/components/staggered-container";

export function ClassicProjects() {
  const projects = getProjects();

  return (
    <section id="projects" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/6 rounded-full blur-3xl opacity-30 animate-float" />
        <div
          className="absolute -bottom-1/3 right-0 w-80 h-80 bg-gradient-to-tl from-accent/8 to-primary/5 rounded-full blur-3xl opacity-25 animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12">
        <AnimatedSection animation="fade-up">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="mt-3 text-foreground/60">
              Crafted solutions that drive results
            </p>
          </div>
        </AnimatedSection>

        <StaggeredContainer staggerDelay={100}>
          {projects.map((project) => (
            <AnimatedSection key={project.id} animation="fade-up">
              <div className="group relative rounded-2xl overflow-hidden hover:scale-[1.02] smooth-transition cursor-pointer dark:neo-glow ">
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-lg rounded-2xl border border-white/10 group-hover:border-primary/50 group-hover:bg-white/[0.08] smooth-transition dark:border-purple-500/40 dark:group-hover:border-primary/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/12 opacity-0 group-hover:opacity-100 smooth-transition rounded-2xl dark:from-primary/25 dark:to-accent/20" />

                <div className="relative z-10 p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary smooth-transition">
                    {project.title}
                  </h3>
                  <p className="text-foreground/75 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary/25 to-accent/20 border border-primary/50 text-foreground/85 group-hover:border-primary/70 smooth-transition dark:from-primary/35 dark:to-accent/30 dark:border-primary/60 dark:group-hover:shadow-lg dark:group-hover:shadow-primary/25"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}
