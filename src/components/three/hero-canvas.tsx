"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <SceneFallback /> }
);

function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-48 h-48 rounded-full gradient-bg opacity-30 blur-3xl animate-pulse" />
    </div>
  );
}

export function HeroCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <HeroScene />
    </div>
  );
}
