"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { HeroCanvas } from "@/src/components/three/hero-canvas";
import { Aurora } from "@/src/components/effects/aurora";
import { SparkleDot } from "@/src/components/effects/sparkle-dot";

interface BrandPanelProps {
  title: string;
  description: string;
  bullets: string[];
}

export function BrandPanel({ title, description, bullets }: BrandPanelProps) {
  return (
    <div
      className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center p-12 text-white"
      style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #2563eb 100%)" }}
    >
      <Aurora className="opacity-60 mix-blend-screen" />
      <SparkleDot className="opacity-40" />
      <div className="absolute inset-0 bg-dot-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-transparent to-cyan-500/20" />

      <div className="absolute inset-6 rounded-[2rem]" style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.05), transparent 70%)" }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <Link href="/" className="flex items-center gap-3 justify-center mb-10 group">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight">Nexora</span>
        </Link>

        <div className="relative w-72 h-72 mb-8">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl" />
          <HeroCanvas className="absolute inset-0" />
        </div>

        <h2 className="text-3xl font-bold font-display mb-3 leading-tight">
          {title}
        </h2>
        <p className="text-white/70 leading-relaxed text-sm mb-8">
          {description}
        </p>

        <div className="w-full space-y-3 text-left">
          {bullets.map((t) => (
            <div key={t} className="flex items-center gap-3 text-sm text-white/85">
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
