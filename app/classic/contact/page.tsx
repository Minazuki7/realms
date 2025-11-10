import { ClassicNav } from "@/components/classic/nav";
import { ClassicContact } from "@/components/classic/contact";
import { ClassicFooter } from "@/components/classic/footer";

export const runtime = "edge";

export default function ContactPage() {
  return (
    <>
      <ClassicNav />
      <main className="bg-background min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <ClassicContact />
          </div>
        </section>
      </main>
      <ClassicFooter />
    </>
  );
}
