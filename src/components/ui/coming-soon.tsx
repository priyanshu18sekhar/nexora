"use client";

import React from "react";
import Link from "next/link";
import { Hammer, ArrowLeft, Sparkles, Bell } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Aurora } from "@/src/components/effects/aurora";
import { AnimatedGrid } from "@/src/components/effects/animated-grid";
import { SparkleDot } from "@/src/components/effects/sparkle-dot";

interface ComingSoonProps {
  title?: string;
  description?: string;
  backLink?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "We're polishing this experience. Drop your email and we'll let you know the moment it's live.",
  backLink = "/",
}: ComingSoonProps) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      <Aurora className="opacity-60" />
      <AnimatedGrid />
      <SparkleDot className="opacity-40" />

      <div className="relative max-w-xl text-center">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full gradient-bg opacity-40 blur-2xl animate-pulse-ring" />
            <div className="relative w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center shadow-brand">
              <Hammer className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-semibold tracking-wide mb-5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          In development
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-4 leading-tight">
          {title}
          <span className="gradient-text-hero"> is on the way</span>
        </h1>

        <p className="text-foreground/65 text-lg leading-relaxed mb-8 max-w-md mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gradient-bg text-white font-semibold shadow-brand rounded-2xl h-12 px-7">
            <Link href={backLink}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl h-12 px-7 border-border font-semibold backdrop-blur-md">
            <Link href="/courses">
              <Bell className="w-4 h-4 mr-2" />
              Explore courses meanwhile
            </Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Building India&apos;s best skill platform — one feature at a time.
        </p>
      </div>
    </div>
  );
}
