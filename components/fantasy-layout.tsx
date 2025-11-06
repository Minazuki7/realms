"use client";

import type React from "react";
import { FairyCursor } from "./fantasy/fairy-cursor";
import { ParticleBackground } from "./fantasy/particle-background";
import { ExtremeBackground } from "./fantasy/extreme-background";

interface FantasyLayoutProps {
  children: React.ReactNode;
}

export function FantasyLayout({ children }: FantasyLayoutProps) {
  return (
    <div className="fantasy-mode min-h-screen relative">
      <ExtremeBackground />
      <ParticleBackground />
      <FairyCursor />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
