"use client";

import { cn } from "@/src/lib/utils";

export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -top-32 -left-24 w-[680px] h-[680px] rounded-full opacity-40 blur-3xl aurora-a" />
      <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full opacity-35 blur-3xl aurora-b" />
      <div className="absolute bottom-0 left-1/3 w-[460px] h-[460px] rounded-full opacity-30 blur-3xl aurora-c" />
      <style>{`
        .aurora-a { background: radial-gradient(circle, hsl(242 90% 65% / 0.55) 0%, transparent 65%); animation: auroraA 14s ease-in-out infinite alternate; }
        .aurora-b { background: radial-gradient(circle, hsl(199 95% 60% / 0.5) 0%, transparent 65%); animation: auroraB 18s ease-in-out infinite alternate; }
        .aurora-c { background: radial-gradient(circle, hsl(285 80% 65% / 0.45) 0%, transparent 65%); animation: auroraC 16s ease-in-out infinite alternate; }
        @keyframes auroraA { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(40px,30px,0) scale(1.08); } }
        @keyframes auroraB { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-30px,40px,0) scale(1.12); } }
        @keyframes auroraC { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(30px,-30px,0) scale(1.1); } }
      `}</style>
    </div>
  );
}
