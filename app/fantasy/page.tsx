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
const OriginRealm = dynamic(
  () =>
    import("@/components/fantasy/origin").then((mod) => ({
      default: mod.OriginRealm,
    })),
  { ssr: false }
);

export default function FantasyPage() {
  return (
    <>
      <FantasyNav />
      <main className="bg-background min-h-screen">
        <OriginRealm />
      </main>
      <FantasyFooter />
    </>
  );
}
