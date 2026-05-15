"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";

export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handler = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    parent.addEventListener("mousemove", handler);
    return () => parent.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300",
        className
      )}
      style={{
        background:
          "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary) / 0.18), transparent 40%)",
      }}
    />
  );
}
