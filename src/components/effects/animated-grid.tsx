"use client";

import { cn } from "@/src/lib/utils";

export function AnimatedGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className
      )}
    >
      <div
        className="absolute inset-0 animate-grid-pan"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)/0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <style>{`
        @keyframes gridPan {
          0%   { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-56px,-56px,0); }
        }
        .animate-grid-pan { animation: gridPan 14s linear infinite; }
      `}</style>
    </div>
  );
}
