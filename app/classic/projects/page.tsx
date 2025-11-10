import { ClassicNav } from "@/components/classic/nav";
import { ClassicProjects } from "@/components/classic/projects";
import { ClassicFooter } from "@/components/classic/footer";

export default function ProjectsPage() {
  return (
    <>
      <ClassicNav />
      <main className="bg-background min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-12 bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              All Projects
            </h1>
            <ClassicProjects />
          </div>
        </section>
      </main>
      <ClassicFooter />
    </>
  );
}
