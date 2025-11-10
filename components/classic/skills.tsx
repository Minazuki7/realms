import { getBio } from "@/lib/cms-loader";
import { AnimatedSection } from "@/components/animated-section";

export async function ClassicSkills() {
  const bio = await getBio();

  if (!bio) {
    return <div>Skills data not available</div>;
  }

  // Organize skills from bio organized by category
  const skillCategories: Array<{
    name: string;
    items: any[];
    proficiency?: string;
  }> = [];

  // Frontend
  if (bio.skills.frontend?.expert) {
    skillCategories.push({
      name: "Frontend - Expert",
      items: bio.skills.frontend.expert,
      proficiency: "expert",
    });
  }
  if (bio.skills.frontend?.advanced) {
    skillCategories.push({
      name: "Frontend - Advanced",
      items: bio.skills.frontend.advanced,
      proficiency: "advanced",
    });
  }

  // Backend
  if (bio.skills.backend?.expert) {
    skillCategories.push({
      name: "Backend - Expert",
      items: bio.skills.backend.expert,
      proficiency: "expert",
    });
  }
  if (bio.skills.backend?.advanced) {
    skillCategories.push({
      name: "Backend - Advanced",
      items: bio.skills.backend.advanced,
      proficiency: "advanced",
    });
  }

  // Databases
  if (bio.skills.databases?.advanced) {
    skillCategories.push({
      name: "Databases",
      items: bio.skills.databases.advanced,
      proficiency: "advanced",
    });
  }

  // DevOps
  if (bio.skills.devops?.advanced) {
    skillCategories.push({
      name: "DevOps & Tools",
      items: bio.skills.devops.advanced,
      proficiency: "advanced",
    });
  }

  // Mobile
  if (bio.skills.mobile?.intermediate) {
    skillCategories.push({
      name: "Mobile Development",
      items: bio.skills.mobile.intermediate,
      proficiency: "intermediate",
    });
  }

  // AI/ML
  if (bio.skills.aiml?.intermediate) {
    skillCategories.push({
      name: "AI & Machine Learning",
      items: bio.skills.aiml.intermediate,
      proficiency: "intermediate",
    });
  }

  // Methodologies
  const methodologyItems = [
    ...((typeof bio.skills.methodologies === "object" &&
      !Array.isArray(bio.skills.methodologies) &&
      bio.skills.methodologies?.expert) ||
      []),
    ...((typeof bio.skills.methodologies === "object" &&
      !Array.isArray(bio.skills.methodologies) &&
      bio.skills.methodologies?.advanced) ||
      []),
  ];
  if (methodologyItems.length > 0) {
    skillCategories.push({
      name: "Methodologies & Practices",
      items: methodologyItems,
      proficiency: "expert",
    });
  }

  return (
    <section id="skills" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-1/3 w-96 h-96 bg-linear-to-br from-primary/12 to-accent/8 rounded-full blur-3xl opacity-45 neo-glow animate-float"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-80 h-80 bg-linear-to-tl from-accent/10 to-primary/6 rounded-full blur-3xl opacity-40 neo-glow animate-float"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-12">
        <AnimatedSection animation="fade-up">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Technical Skills
              </span>
            </h2>
            <p className="mt-3 text-foreground/60">
              Technologies and expertise organized by category
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
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-transparent bg-linear-to-r from-primary to-accent bg-clip-text group-hover:text-primary smooth-transition">
                    {category.name}
                  </h3>
                  {category.proficiency === "expert" && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary border border-primary/40">
                      Expert
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <li
                      key={item}
                      className="group/item relative p-3 rounded-lg overflow-hidden hover:scale-105 smooth-transition cursor-pointer neo-button"
                      style={{ animationDelay: `${itemIdx * 50}ms` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/15 backdrop-blur-sm rounded-lg border border-primary/40 group-hover/item:border-primary/70 group-hover/item:bg-linear-to-r group-hover/item:from-primary/30 group-hover/item:to-accent/20 smooth-transition neo-glow" />
                      <div className="absolute inset-0 bg-linear-to-r from-primary/15 to-accent/10 opacity-0 group-hover/item:opacity-100 smooth-transition" />

                      <div className="relative z-10 flex items-center gap-3 smooth-transition group-hover/item:translate-x-1">
                        <span className="w-2 h-2 rounded-full bg-linear-to-r from-primary to-accent group-hover/item:scale-150 smooth-transition neo-pulse" />
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
