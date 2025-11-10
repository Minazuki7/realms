import { ClassicNav } from "@/components/classic/nav";
import ClassicHero from "@/components/classic/hero";
import { ClassicAbout } from "@/components/classic/about";
import { ClassicProjects } from "@/components/classic/projects";
import { ClassicSkills } from "@/components/classic/skills";
import { ClassicContact } from "@/components/classic/contact";
import { ClassicFooter } from "@/components/classic/footer";

export const runtime = "edge";

export default function ClassicPage() {
  return (
    <>
      <ClassicNav />
      <main className="relative min-h-screen bg-gradient-to-br from-background via-card to-secondary before:content-[''] before:fixed before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-accent/5 before:pointer-events-none before:z-0">
        <div className="relative z-10">
          <ClassicHero />
          <ClassicAbout />
          <ClassicProjects />
          <ClassicSkills />
          <ClassicContact />
          <ClassicFooter />
        </div>
      </main>
    </>
  );
}
