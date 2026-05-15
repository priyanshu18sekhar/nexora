"use client";

import { cn } from "@/src/lib/utils";

export function ShinyText({
  children,
  className,
  speed = 4,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(110deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 35%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 65%, hsl(var(--foreground)) 100%)",
        backgroundSize: "220% 100%",
        animation: `shiny ${speed}s linear infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes shiny {
          0%   { background-position: 220% 50%; }
          100% { background-position: -120% 50%; }
        }
      `}</style>
    </span>
  );
}
