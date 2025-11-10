import { ClassicNav } from "@/components/classic/nav";
import { ClassicSkills } from "@/components/classic/skills";
import { ClassicFooter } from "@/components/classic/footer";

export const runtime = "edge";

export default function SkillsPage() {
  return (
    <>
      <ClassicNav />
      <main className="bg-background min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <ClassicSkills />
          </div>
        </section>
      </main>
      <ClassicFooter />
    </>
  );
}
