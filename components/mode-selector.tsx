"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeSelector() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") {
        handleSelect("classic");
      } else if (e.key.toLowerCase() === "f") {
        handleSelect("fantasy");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleSelect = (mode: "classic" | "fantasy") => {
    router.push(mode === "classic" ? "/classic" : "/fantasy");
  };

  if (!mounted) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6 py-8">
      {/* Classic Mode Card */}
      <button
        onClick={() => handleSelect("classic")}
        onKeyDown={(e) => e.key === "Enter" && handleSelect("classic")}
        className="group relative p-8 rounded-lg border-2 border-border hover:border-primary smooth-transition overflow-hidden"
      >
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />

        <div className="relative space-y-4">
          <div className="text-5xl font-light">📊</div>
          <h2 className="text-2xl font-semibold tracking-tight">The Classic</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A professional portfolio grounded in clarity, precision, and
            purpose. Where credentials meet creativity.
          </p>
        </div>

        <div className="mt-6 opacity-0 group-hover:opacity-100 smooth-transition">
          <Button asChild className="w-full">
            Enter The Classic
          </Button>
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 group-hover:text-muted-foreground/70 smooth-transition">
          Press C
        </div>
      </button>

      {/* Fantasy Mode Card */}
      <button
        onClick={() => handleSelect("fantasy")}
        onKeyDown={(e) => e.key === "Enter" && handleSelect("fantasy")}
        className="group relative p-8 rounded-lg border-2 border-mystical hover:border-glow smooth-transition overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-mystical/10 opacity-0 group-hover:opacity-100 smooth-transition glow" />

        <div className="relative space-y-4">
          <div className="text-5xl font-light">✨</div>
          <h2 className="text-2xl font-semibold tracking-tight text-mystical">
            The Fantasy
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A magical realm where imagination manifests and wonder reigns. Where
            dreams become digital art.
          </p>
        </div>

        <div className="mt-6 opacity-0 group-hover:opacity-100 smooth-transition">
          <Button
            asChild
            className="w-full bg-mystical hover:bg-arcane text-primary-foreground"
          >
            Enter The Fantasy
          </Button>
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 group-hover:text-muted-foreground/70 smooth-transition">
          Press F
        </div>
      </button>
    </div>
  );
}
