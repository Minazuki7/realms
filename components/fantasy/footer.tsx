"use client";

import { useEffect, useState } from "react";
import { getContent, loadContent } from "@/lib/content-cms";
import type { PortfolioContent } from "@/lib/content-cms";

export function FantasyFooter() {
  const [content, setContent] = useState<PortfolioContent | null>(null);

  useEffect(() => {
    // Load fresh content from KV on mount
    loadContent()
      .then(setContent)
      .catch(() => {
        setContent(getContent());
      });
  }, []);

  if (!content) {
    return (
      <footer className="border-t border-mystical/20 py-12 px-6">
        <div />
      </footer>
    );
  }

  return (
    <footer className="border-t border-mystical/20 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm text-muted-foreground italic">
          "Between worlds, across dimensions, through the veil of
          possibility..."
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {content.metadata.name}. All realms
          reserved.
        </p>
      </div>
    </footer>
  );
}
