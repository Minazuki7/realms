"use client";

import dynamic from "next/dynamic";
import { FantasyFooter } from "@/components/fantasy/footer";

// Dynamically import components that use useTheme to avoid SSR issues
const FantasyNav = dynamic(
  () =>
    import("@/components/fantasy/nav").then((mod) => ({
      default: mod.FantasyNav,
    })),
  { ssr: false }
);
const CodexRealm = dynamic(
  () =>
    import("@/components/fantasy/codex").then((mod) => ({
      default: mod.CodexRealm,
    })),
  { ssr: false }
);

export default function CodexPage() {
  return (
    <>
      <FantasyNav />
      <main className="bg-background min-h-screen">
        <CodexRealm />
      </main>
      <FantasyFooter />
    </>
  );
}
