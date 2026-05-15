"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, ArrowRight, BookOpen, Briefcase, Award, Users,
  TrendingUp, Star, Play, CheckCircle2, Zap, Globe, Shield,
  Code2, FileSpreadsheet, MessageSquare, FileText, Database,
  Palette, ChevronRight, GraduationCap, Building, Laptop,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { HeroCanvas } from "@/src/components/three/hero-canvas";
import { Aurora } from "@/src/components/effects/aurora";
import { AnimatedGrid } from "@/src/components/effects/animated-grid";
import { Spotlight } from "@/src/components/effects/spotlight";
import { ShinyText } from "@/src/components/effects/shiny-text";
import { SparkleDot } from "@/src/components/effects/sparkle-dot";

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

const stats = [
  { value: "50K+", label: "Active Learners",  icon: Users },
  { value: "200+", label: "Expert Courses",   icon: BookOpen },
  { value: "98%",  label: "Completion Rate",  icon: TrendingUp },
  { value: "300+", label: "Hiring Partners",  icon: Building },
];

const categories = [
  { name: "Programming",           icon: Code2,           color: "from-violet-500 to-indigo-600", count: 40 },
  { name: "AI & Machine Learning", icon: Sparkles,        color: "from-purple-500 to-pink-600",   count: 28 },
  { name: "MS Office",             icon: FileSpreadsheet, color: "from-blue-500 to-cyan-600",     count: 15 },
  { name: "Business Skills",       icon: TrendingUp,      color: "from-amber-500 to-orange-600",  count: 20 },
  { name: "Communication",         icon: MessageSquare,   color: "from-emerald-500 to-teal-600",  count: 18 },
  { name: "Resume & Interview",    icon: FileText,        color: "from-red-500 to-rose-600",      count: 12 },
  { name: "Data Science",          icon: Database,        color: "from-teal-500 to-cyan-600",     count: 22 },
  { name: "Design",                icon: Palette,         color: "from-pink-500 to-rose-600",     count: 16 },
];

const features = [
  { icon: Zap,       title: "Learn at your own pace",  description: "Flexible schedules with lifetime access. Study when and where it suits you.",       color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10" },
  { icon: Globe,     title: "Industry-led content",    description: "Courses designed by working professionals from India's top companies.",              color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/10" },
  { icon: Shield,    title: "Verified certificates",   description: "Certificates recognised by 300+ partner companies and trusted by recruiters.",      color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Briefcase, title: "Internship access",       description: "Apply to exclusive internships from our recruiter network — no middleman.",          color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10" },
];

const courses = [
  { title: "Python for Beginners",     instructor: "Nexora Team", rating: 4.9, students: 12400, price: 999,  level: "Beginner",     badge: "Bestseller", badgeColor: "warning" as const, gradient: "from-violet-600 to-indigo-700", icon: Code2 },
  { title: "AI Tools Mastery",         instructor: "Nexora Team", rating: 4.8, students: 8700,  price: 799,  level: "Beginner",     badge: "Trending",   badgeColor: "info"    as const, gradient: "from-purple-600 to-pink-700",   icon: Sparkles },
  { title: "MS Excel Complete Course", instructor: "Nexora Team", rating: 4.7, students: 15200, price: 499,  level: "All Levels",   badge: "Top Rated",  badgeColor: "success" as const, gradient: "from-blue-600 to-cyan-700",     icon: FileSpreadsheet },
  { title: "Interview Prep Bootcamp",  instructor: "Nexora Team", rating: 4.9, students: 6800,  price: 1299, level: "Intermediate", badge: "New",        badgeColor: "purple"  as const, gradient: "from-emerald-600 to-teal-700",  icon: MessageSquare },
];

const testimonials = [
  { name: "Aisha Patel",  role: "Software Engineer, Infosys",   content: "Nexora completely changed my career. The Python course was crystal clear — I went from zero to getting placed within 3 months.", rating: 5, avatar: "AP" },
  { name: "Ravi Menon",   role: "Data Analyst, TCS",            content: "Went from zero to landing a data science role in 4 months. The structured learning path is what makes Nexora different.",          rating: 5, avatar: "RM" },
  { name: "Sunita Verma", role: "Digital Marketing Specialist", content: "At 32 I was worried about switching careers. Nexora's beginner-friendly courses made the transition smooth. 100% worth it.",       rating: 5, avatar: "SV" },
];

const segments = [
  { icon: GraduationCap, title: "College Students",      description: "Bridge the gap between academics and industry. Build real projects and crack your first job.", color: "from-violet-500 to-purple-600", href: "/courses" },
  { icon: Laptop,        title: "Working Professionals", description: "Upskill without quitting your job. Advance your career with in-demand skills at your own pace.", color: "from-blue-500 to-cyan-600",    href: "/courses" },
  { icon: Users,         title: "Freshers & Beginners",  description: "No prior experience needed. Our structured paths take you from absolute zero to job-ready.",     color: "from-emerald-500 to-teal-600", href: "/courses" },
];

const trustBrands = ["Infosys", "TCS", "Wipro", "Flipkart", "Zomato", "Swiggy", "PhonePe", "Razorpay", "CRED", "Paytm"];

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroFade  = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroLift  = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <main className="overflow-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 lg:pt-24 bg-background"
      >
        <Aurora />
        <AnimatedGrid />
        <Spotlight />
        <SparkleDot className="opacity-50" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <motion.div
            style={{ opacity: heroFade, y: heroLift }}
            className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* Left: copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 text-center lg:text-left space-y-7"
            >
              <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  India&apos;s fastest-growing skill platform
                  <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-[5.4rem] xl:text-[6rem] font-bold font-display tracking-tight leading-[1.02]"
              >
                <ShinyText className="font-bold">Learn.</ShinyText>{" "}
                <ShinyText className="font-bold" speed={5}>Grow.</ShinyText>
                <br />
                <span className="gradient-text-hero">Get Hired.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-foreground/65 leading-relaxed"
              >
                From Python to AI tools — Nexora gives you the{" "}
                <span className="text-foreground font-semibold">skills</span>,{" "}
                <span className="text-foreground font-semibold">internships</span>, and{" "}
                <span className="text-foreground font-semibold">certificates</span>{" "}
                to build the career you deserve.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="lg" asChild className="gradient-bg text-white font-semibold shadow-brand rounded-2xl h-13 px-8 text-base hover:opacity-90 group">
                  <Link href="/register">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-2xl h-13 px-8 text-base border-border font-semibold hover:bg-muted backdrop-blur-md">
                  <Link href="/courses">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Explore Courses
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-foreground/55 pt-2">
                {["No credit card for free courses", "UPI & card payments", "Verified certificates", "Cancel anytime"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: 3D scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-square max-w-[560px] mx-auto">
                <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/8 via-transparent to-blue-400/10 blur-2xl" />
                <HeroCanvas className="absolute inset-0" />
                {/* Floating UI chips */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute top-8 left-2 sm:left-6 glass-card rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold leading-tight">Certificate earned</div>
                    <div className="text-muted-foreground leading-tight">Python Pro</div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.25, duration: 0.5 }}
                  className="absolute bottom-8 right-2 sm:right-6 glass-card rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold leading-tight">Internship offer</div>
                    <div className="text-muted-foreground leading-tight">Bengaluru, ₹25k</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 lg:mt-20"
          >
            <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="flex justify-center mb-2.5">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-brand">
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-display gradient-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-foreground/40"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-border bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-6">
            Trusted by graduates working at
          </p>
          <div className="relative [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {[...trustBrands, ...trustBrands].map((b, i) => (
                <span key={`${b}-${i}`} className="text-2xl font-bold font-display text-foreground/30 hover:text-foreground/70 transition-colors flex-shrink-0">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .animate-marquee { animation: marquee 28s linear infinite; }
          `}</style>
        </div>
      </section>

      {/* ── AUDIENCE ──────────────────────────────────────────────────────── */}
      <section className="py-24 section-tinted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Who it&apos;s for</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                Built for every kind of learner
              </h2>
              <p className="text-foreground/55 max-w-xl mx-auto text-lg">
                Whether you&apos;re a student, professional, or career-switcher — Nexora is made for you.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6">
              {segments.map((seg) => (
                <motion.div key={seg.title} variants={scaleIn}>
                  <Link href={seg.href}>
                    <Card variant="hover" className="relative h-full group p-6 overflow-hidden">
                      <Spotlight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${seg.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                        <seg.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="relative z-10 font-bold text-lg mb-2 font-display">{seg.title}</h3>
                      <p className="relative z-10 text-foreground/55 text-sm leading-relaxed">{seg.description}</p>
                      <div className="relative z-10 mt-4 flex items-center text-primary text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                        Browse courses <ChevronRight className="w-4 h-4" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Course Categories</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                Explore what you want to learn
              </h2>
              <p className="text-foreground/55 max-w-xl mx-auto">
                From cutting-edge AI to office productivity — we cover every skill the market demands.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <motion.div key={cat.name} variants={fadeUp}>
                  <Link href={`/courses?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="group relative p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer overflow-hidden">
                      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity`} />
                      <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                        <cat.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="relative font-semibold text-sm mb-1">{cat.name}</h3>
                      <p className="relative text-xs text-muted-foreground">{cat.count}+ courses</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── COURSES ───────────────────────────────────────────────────────── */}
      <section className="py-24 section-tinted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="secondary" className="mb-3 px-3 py-1 rounded-full text-xs font-semibold">Top Courses</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight">Most popular courses</h2>
              </div>
              <Button variant="outline" asChild className="rounded-xl font-semibold flex-shrink-0">
                <Link href="/courses">View all <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {courses.map((course) => (
                <motion.div key={course.title} variants={fadeUp}>
                  <Link href="/courses">
                    <Card variant="hover" className="overflow-hidden group h-full">
                      <div className={`relative h-40 bg-gradient-to-br ${course.gradient} flex items-center justify-center overflow-hidden`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-20" />
                        <course.icon className="w-14 h-14 text-white/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <Badge variant={course.badgeColor}>{course.badge}</Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm font-medium">{course.level}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1 leading-snug">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2.5">{course.instructor}</p>
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{course.rating}</span>
                          <span className="text-xs text-muted-foreground">({(course.students / 1000).toFixed(1)}K)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary text-sm">₹{course.price}</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold rounded-lg hover:bg-primary/8 hover:text-primary">Enroll</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── WHY NEXORA ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <Aurora className="opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Why Nexora?</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                Everything you need to{" "}
                <span className="gradient-text">succeed</span>
              </h2>
              <p className="text-foreground/55 max-w-xl mx-auto">
                We go beyond courses. Nexora is a complete career acceleration platform built for India.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <Card variant="elevated" className="h-full p-6 backdrop-blur-md bg-card/80">
                    <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5`}>
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="font-bold mb-2 font-display">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 section-tinted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Success Stories</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                Join thousands of success stories
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <motion.div key={t.name} variants={fadeUp}>
                  <Card variant="elevated" className="h-full p-6 flex flex-col gap-4 relative overflow-hidden group">
                    <Spotlight className="opacity-0 group-hover:opacity-100" />
                    <div className="flex gap-1 relative">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed flex-1 relative">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-border relative">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden rounded-3xl gradient-bg-hero p-12 sm:p-16 text-center text-white"
            >
              <div className="absolute inset-0 bg-dot-pattern opacity-10" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-white/10 rounded-full blur-3xl" />
              <SparkleDot className="opacity-30" />
              <div className="relative">
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                  Start your journey today
                </h2>
                <p className="text-white/75 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
                  Join 50,000+ learners across India who transformed their careers with Nexora.
                  Free courses available — no credit card needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl rounded-2xl h-13 px-8">
                    <Link href="/register">
                      Create Free Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" asChild className="bg-white/15 text-white hover:bg-white/25 border border-white/25 font-bold rounded-2xl h-13 px-8 backdrop-blur-sm">
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

    </main>
  );
}
