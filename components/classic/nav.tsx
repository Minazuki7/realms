"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClassicThemeToggle } from "@/components/classic/theme-toggle";
import { getContent } from "@/lib/content-cms";

const navItems = [
  { href: "/classic", label: "About", id: "about" },
  { href: "/classic/projects", label: "Projects", id: "projects" },
  { href: "/classic/skills", label: "Skills", id: "skills" },
  { href: "/classic/contact", label: "Contact", id: "contact" },
];

export function ClassicNav() {
  const pathname = usePathname();
  const content = getContent();
  const portfolioName = content.metadata.name;

  return (
    /* Completely redesigned navbar with neo-futuristic glass effect and premium styling */
    <nav className="sticky top-0 z-40 smooth-transition">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-xl border-b border-white/10" />

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/classic"
          className="relative group text-xl font-bold tracking-wider smooth-transition"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent opacity-0 group-hover:opacity-100 smooth-transition blur-sm" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {portfolioName.split(" ")[0]}
          </span>
          <span className="text-foreground/80 ml-1">
            {portfolioName.split(" ").slice(1).join(" ")}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href}>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 rounded-lg blur opacity-0 group-hover:opacity-100 smooth-transition ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-accent opacity-50"
                        : "bg-gradient-to-r from-primary/50 to-accent/50"
                    }`}
                  />
                  <Button
                    variant="ghost"
                    className={`relative rounded-lg font-semibold tracking-wide smooth-transition ${
                      isActive
                        ? "bg-white/10 text-primary "
                        : "text-foreground/70 hover:text-primary hover:bg-white/5 border border-transparent hover:border-primary/30"
                    }`}
                  >
                    {item.label}
                  </Button>
                </div>
              </Link>
            );
          })}

          <div className="h-6 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent mx-3 opacity-50" />

          <div className="flex items-center gap-2">
            <ClassicThemeToggle />

            <Link href="/fantasy">
              <Button className="ml-1 relative group overflow-hidden rounded-lg smooth-transition font-semibold">
                <div className="absolute inset-0 bg-gradient-to-r from-mystical/20 to-accent/20 opacity-0 group-hover:opacity-100 smooth-transition" />
                <span className="relative z-10 flex items-center gap-2">
                  ✨ Fantasy
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
