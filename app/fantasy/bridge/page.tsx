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
const BridgeRealm = dynamic(
  () =>
    import("@/components/fantasy/bridge").then((mod) => ({
      default: mod.BridgeRealm,
    })),
  { ssr: false }
);

export default function BridgePage() {
  return (
    <>
      <FantasyNav />
      <main className="bg-background min-h-screen">
        <BridgeRealm />
      </main>
      <FantasyFooter />
    </>
  );
}
