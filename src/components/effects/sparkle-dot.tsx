"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";

type Particle = { x: number; y: number; r: number; vx: number; vy: number; life: number; max: number; hue: number };

export function SparkleDot({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      const { width, height } = canvas.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.6 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          life: 0,
          max: 240 + Math.random() * 240,
          hue: 220 + Math.random() * 60,
        });
      }
    };

    const tick = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      if (particles.length < 80) spawn();

      particles = particles.filter((p) => p.life < p.max);
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = Math.sin((p.life / p.max) * Math.PI) * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 85%, 70%, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 w-full h-full", className)}
    />
  );
}
