import { getBio } from "@/lib/cms";
import { AnimatedSection } from "@/components/animated-section";
import { HoverCardAnimated } from "@/components/hover-card-animated";
import AnimatedGradientName from "@/components/animated-gradient-name";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ClassicHero = () => {
  const bio = getBio();

  const [firstName, ...lastNameArr] = bio.name.split(" ");
  const lastName = lastNameArr.join(" ");

  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/15 to-accent/10 rounded-full blur-3xl opacity-60 animate-float" />
        <div
          className="absolute bottom-0 right-20 w-72 h-72 bg-gradient-to-tl from-accent/12 to-primary/8 rounded-full blur-3xl opacity-50 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/8 to-accent/5 rounded-full blur-3xl opacity-40 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-8">
        <AnimatedSection animation="fade-up">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-balance leading-tight">
              <AnimatedGradientName text={firstName} />{" "}
              <AnimatedGradientName text={lastName} />
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 text-balance leading-relaxed max-w-3xl font-light">
              {bio.intro}
            </p>

            <div className="flex items-center gap-3 pt-4">
              <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
              <span className="text-sm font-medium text-primary tracking-widest uppercase">
                {bio.title}
              </span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="flex flex-wrap gap-4 pt-8">
            <Link href="#projects">
              <Button
                glow={true}
                gradientBg
                variant="default"
                size="lg"
                className="font-semibold tracking-wide px-10 py-5 rounded-lg shadow-lg animate-glow text-lg min-h-14 min-w-[260px] flex items-center justify-center text-black dark:text-white border-2 border-primary-foreground dark:border-primary"
              >
                <span className="flex items-center gap-2">
                  Explore My Work
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 smooth-transition"
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
                </span>
              </Button>
            </Link>

            <Link href="#contact">
              <Button
                glow
                border="border-black"
                variant="default"
                size="lg"
                className="font-semibold tracking-wide px-10 py-5 rounded-lg shadow-lg text-lg min-h-14 min-w-[260px] flex items-center justify-center border border-primary-foreground dark:border-primary text-black dark:text-white bg-transparent hover:bg-transparent filter-none"
              >
                <span className="flex items-center gap-2">
                  Start a Conversation
                  <svg
                    className="w-5 h-5 group-hover:scale-110 smooth-transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-3 gap-4 pt-16">
          {[
            { label: "Projects", value: "30+" },
            { label: "Clients", value: "50+" },
            { label: "Experience", value: "8yrs" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative p-4 rounded-xl overflow-hidden hover:scale-105 smooth-transition dark:neo-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 smooth-transition dark:hidden" />
              <div className="absolute inset-0 border border-white/10 group-hover:border-primary/30 rounded-xl smooth-transition dark:border-purple-500/30 dark:group-hover:border-primary/60" />
              <div className="relative z-10 text-center">
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/60 mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ClassicHero;
