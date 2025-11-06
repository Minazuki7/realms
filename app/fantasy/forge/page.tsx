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
const ForgeRealm = dynamic(
  () =>
    import("@/components/fantasy/forge").then((mod) => ({
      default: mod.ForgeRealm,
    })),
  { ssr: false }
);

export default function ForgePage() {
  return (
    <>
      <FantasyNav />
      <main className="bg-background min-h-screen">
        <ForgeRealm />
      </main>
      <FantasyFooter />
    </>
  );
}
