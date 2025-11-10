"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassicThemeToggle } from "@/components/classic/theme-toggle";
import { getContent, loadContent } from "@/lib/content-cms";
import type { PortfolioContent } from "@/lib/content-cms";

const navItems = [
  { href: "/classic", label: "About", id: "about" },
  { href: "/classic/projects", label: "Projects", id: "projects" },
  { href: "/classic/skills", label: "Skills", id: "skills" },
  { href: "/classic/contact", label: "Contact", id: "contact" },
];

export function ClassicNav() {
  const pathname = usePathname();
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch(() => {
        setContent(getContent());
      });
  }, []);

  const portfolioName = content?.metadata.name || "Portfolio";

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    /* Responsive navbar with neo-futuristic glass effect */
    <nav className="sticky top-0 z-40 smooth-transition">
      <div className="absolute inset-0 bg-linear-to-b from-background/80 to-background/40 backdrop-blur-xl border-b border-white/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/classic"
          className="relative group text-lg sm:text-xl font-bold tracking-wider smooth-transition shrink-0"
        >
          <span className="absolute inset-0 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent opacity-0 group-hover:opacity-100 smooth-transition blur-sm" />
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            {portfolioName.split(" ")[0]}
          </span>
          <span className="text-foreground/80 ml-1 hidden sm:inline-block">
            {portfolioName.split(" ").slice(1).join(" ")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href}>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 rounded-lg blur opacity-0 group-hover:opacity-100 smooth-transition ${
                      isActive
                        ? "bg-linear-to-r from-primary to-accent opacity-50"
                        : "bg-linear-to-r from-primary/50 to-accent/50"
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative rounded-lg font-semibold tracking-wide smooth-transition text-sm ${
                      isActive
                        ? "bg-white/10 text-primary"
                        : "text-foreground/70 hover:text-primary hover:bg-white/5 border border-transparent hover:border-primary/30"
                    }`}
                  >
                    {item.label}
                  </Button>
                </div>
              </Link>
            );
          })}

          <div className="h-6 w-px bg-linear-to-b from-primary/50 via-white/10 to-transparent mx-2 lg:mx-3 opacity-50" />

          <div className="flex items-center gap-2">
            <ClassicThemeToggle />
            {/* 
            <Link href="/fantasy">
              <Button
                size="sm"
                className="ml-1 relative group overflow-hidden rounded-lg smooth-transition font-semibold text-sm"
              >
                <div className="absolute inset-0 bg-linear-to-r from-mystical/20 to-accent/20 opacity-0 group-hover:opacity-100 smooth-transition" />
                <span className="relative z-10 flex items-center gap-1 lg:gap-2">
                  ✨ <span className="hidden lg:inline">Fantasy</span>
                </span>
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Mobile Menu Button & Theme */}
        <div className="md:hidden flex items-center gap-2">
          <ClassicThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-white/10 animate-in fade-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.id} href={item.href}>
                  <div className="relative group w-full">
                    <div
                      className={`absolute inset-0 rounded-lg blur opacity-0 group-hover:opacity-100 smooth-transition ${
                        isActive
                          ? "bg-linear-to-r from-primary to-accent opacity-50"
                          : "bg-linear-to-r from-primary/50 to-accent/50"
                      }`}
                    />
                    <Button
                      variant="ghost"
                      className={`relative w-full justify-start rounded-lg font-semibold smooth-transition ${
                        isActive
                          ? "bg-white/10 text-primary"
                          : "text-foreground/70 hover:text-primary hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Button>
                  </div>
                </Link>
              );
            })}

            <div className="h-px bg-linear-to-r from-primary/50 via-white/10 to-transparent my-2 opacity-50" />

            {/* <Link href="/fantasy" className="w-full">
              <Button className="w-full relative group overflow-hidden rounded-lg smooth-transition font-semibold">
                <div className="absolute inset-0 bg-linear-to-r from-mystical/20 to-accent/20 opacity-0 group-hover:opacity-100 smooth-transition" />
                <span className="relative z-10 flex items-center gap-2">
                  ✨ Fantasy Realm
                </span>
              </Button>
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
}
