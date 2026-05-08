"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles, ArrowRight, BookOpen, Briefcase, Award, Users,
  TrendingUp, Star, Play, CheckCircle2, Zap, Globe, Shield,
  Code2, FileSpreadsheet, MessageSquare, FileText, Database,
  Palette, ChevronRight, GraduationCap, Building, Laptop,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";

// ── Animation Variants ─────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

// ── Data ───────────────────────────────────────────────────────────────────

const stats = [
  { value: "50K+", label: "Active Learners",     icon: Users },
  { value: "1,200+", label: "Expert Courses",    icon: BookOpen },
  { value: "300+", label: "Hiring Partners",     icon: Building },
  { value: "95%", label: "Placement Rate",       icon: TrendingUp },
];

const categories = [
  { name: "Programming",       icon: Code2,          color: "from-violet-500 to-indigo-600", count: 240 },
  { name: "AI & Machine Learning", icon: Sparkles,   color: "from-purple-500 to-pink-600",   count: 180 },
  { name: "MS Office",         icon: FileSpreadsheet, color: "from-blue-500 to-cyan-600",    count: 85 },
  { name: "Business Skills",   icon: TrendingUp,     color: "from-amber-500 to-orange-600",  count: 120 },
  { name: "Communication",     icon: MessageSquare,  color: "from-emerald-500 to-teal-600",  count: 95 },
  { name: "Resume & Interview", icon: FileText,      color: "from-red-500 to-rose-600",      count: 70 },
  { name: "Data Science",      icon: Database,       color: "from-teal-500 to-cyan-600",     count: 110 },
  { name: "Design",            icon: Palette,        color: "from-pink-500 to-rose-600",     count: 90 },
];

const features = [
  { icon: Zap,      title: "Learn at your own pace",    description: "Flexible schedules with lifetime access. Learn when it suits you.", color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10" },
  { icon: Globe,    title: "Industry mentors",           description: "Guided by working professionals from top companies worldwide.",      color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/10" },
  { icon: Shield,   title: "Verified certificates",     description: "Certificates recognized by 300+ partner companies.",               color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Briefcase, title: "Direct internship access", description: "Apply to exclusive internships from our recruiter network.",        color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10" },
];

const courses = [
  { title: "Full-Stack Web Development",    instructor: "Rajesh Kumar",  rating: 4.9, students: 12400, price: 49.99, level: "Beginner",      badge: "Bestseller", badgeColor: "warning" as const,  gradient: "from-violet-600 to-indigo-700", icon: Code2 },
  { title: "ChatGPT & AI Tools Mastery",   instructor: "Priya Sharma",  rating: 4.8, students: 8700,  price: 39.99, level: "Beginner",      badge: "Trending",   badgeColor: "info" as const,     gradient: "from-purple-600 to-pink-700",  icon: Sparkles },
  { title: "MS Office Complete Course",    instructor: "Anita Mehta",   rating: 4.7, students: 15200, price: 29.99, level: "All Levels",    badge: "Top Rated",  badgeColor: "success" as const,  gradient: "from-blue-600 to-cyan-700",    icon: FileSpreadsheet },
  { title: "Interview Prep Bootcamp",      instructor: "Vikram Singh",  rating: 4.9, students: 6800,  price: 59.99, level: "Intermediate",  badge: "New",        badgeColor: "purple" as const,   gradient: "from-emerald-600 to-teal-700", icon: MessageSquare },
];

const testimonials = [
  { name: "Aisha Patel",  role: "Software Engineer at Google",                    content: "Nexora completely changed my career trajectory. The internship I got through the platform led directly to my dream job.", rating: 5, avatar: "AP" },
  { name: "Ravi Menon",   role: "Data Analyst at Microsoft",                      content: "I went from zero to landing a data science job in 4 months. The mentorship system is what makes Nexora truly special.", rating: 5, avatar: "RM" },
  { name: "Sunita Verma", role: "Digital Marketing Specialist",                   content: "At 55, I was worried about learning digital skills. Nexora's beginner-friendly approach made it easy. Now I run my own consulting!", rating: 5, avatar: "SV" },
];

const segments = [
  { icon: GraduationCap, title: "Engineering Students",   description: "Bridge the gap between academics and industry. Build real projects and land your first internship.", color: "from-violet-500 to-purple-600", href: "/for-students" },
  { icon: Laptop,        title: "Working Professionals", description: "Upskill without quitting your job. Advance your career with in-demand skills at your own pace.",    color: "from-blue-500 to-cyan-600",    href: "/for-professionals" },
  { icon: Users,         title: "Beginners & Seniors",   description: "No prior experience needed. Our structured learning paths take you from zero to confident.",        color: "from-emerald-500 to-teal-600", href: "/for-beginners" },
];

// ── Animated section wrapper ───────────────────────────────────────────────

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <main className="overflow-hidden">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center pt-16 bg-background">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-dot-pattern opacity-60" />
          <div className="hero-blob-1 top-1/4 -left-32 opacity-60" />
          <div className="hero-blob-2 bottom-1/4 right-0 opacity-50" />
          {/* Soft gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-7">
              {/* Pill badge */}
              <motion.div variants={fadeUp} className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/6 text-primary text-sm font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  America&apos;s fastest-growing EdTech platform
                  <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-display tracking-tight leading-[1.08]">
                Learn. Intern.{" "}
                <span className="gradient-text-hero">Succeed.</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg sm:text-xl text-foreground/60 leading-relaxed font-normal">
                From programming to AI tools — Nexora gives you the skills,{" "}
                <span className="text-foreground/80 font-medium">internships</span>, and{" "}
                <span className="text-foreground/80 font-medium">mentorship</span> to build the career you deserve.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  asChild
                  id="hero-start-btn"
                  className="gradient-bg text-white font-semibold shadow-brand rounded-2xl h-13 px-8 text-base hover:opacity-90"
                >
                  <Link href="/register">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  id="hero-explore-btn"
                  className="rounded-2xl h-13 px-8 text-base border-border font-semibold hover:bg-muted"
                >
                  <Link href="/courses">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Explore Courses
                  </Link>
                </Button>
              </motion.div>

              {/* Trust chips */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/50 pt-2">
                {["No credit card required", "Free courses available", "Cancel anytime", "Verified certificates"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16"
            >
              <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
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
        </section>

        {/* ── AUDIENCE ──────────────────────────────────────────────────── */}
        <section className="py-24 section-tinted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section>
              <motion.div variants={fadeUp} className="text-center mb-14">
                <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Who it&apos;s for</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                  Built for every kind of learner
                </h2>
                <p className="text-foreground/55 max-w-xl mx-auto text-lg">
                  Whether you&apos;re a student, professional, or senior — Nexora is designed for you.
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-3 gap-6">
                {segments.map((seg) => (
                  <motion.div key={seg.title} variants={scaleIn}>
                    <Link href={seg.href}>
                      <Card variant="hover" className="h-full group p-6">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${seg.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                          <seg.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 font-display">{seg.title}</h3>
                        <p className="text-foreground/55 text-sm leading-relaxed">{seg.description}</p>
                        <div className="mt-4 flex items-center text-primary text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                          Learn more <ChevronRight className="w-4 h-4" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Section>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────────────────── */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section>
              <motion.div variants={fadeUp} className="text-center mb-14">
                <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Course Categories</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                  Explore what you want to learn
                </h2>
                <p className="text-foreground/55 max-w-xl mx-auto">
                  From cutting-edge AI to fundamental office skills — we have something for every goal.
                </p>
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <motion.div key={cat.name} variants={fadeUp}>
                    <Link href={`/courses?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <div className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-250 cursor-pointer">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                          <cat.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">{cat.count}+ courses</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Section>
          </div>
        </section>

        {/* ── COURSES ───────────────────────────────────────────────────── */}
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
                    <Card variant="hover" className="overflow-hidden group">
                      <div className={`relative h-40 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
                        <course.icon className="w-14 h-14 text-white/25 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute top-3 left-3">
                          <Badge variant={course.badgeColor}>{course.badge}</Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-black/25 text-white backdrop-blur-sm font-medium">{course.level}</span>
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
                          <span className="font-bold text-primary text-sm">${course.price}</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold rounded-lg hover:bg-primary/8 hover:text-primary">Enroll</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────── */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section>
              <motion.div variants={fadeUp} className="text-center mb-14">
                <Badge variant="secondary" className="mb-4 px-3 py-1 rounded-full text-xs font-semibold">Why Nexora?</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                  Everything you need to{" "}
                  <span className="gradient-text">succeed</span>
                </h2>
                <p className="text-foreground/55 max-w-xl mx-auto">
                  We go beyond just courses. Nexora is a complete career acceleration platform.
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f) => (
                  <motion.div key={f.title} variants={fadeUp}>
                    <Card variant="elevated" className="h-full p-6">
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

        {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
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
                    <Card variant="elevated" className="h-full p-6 flex flex-col gap-4">
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-foreground/65 leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-3 border-t border-border">
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

        {/* ── CTA BANNER ────────────────────────────────────────────────── */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Section>
              <motion.div
                variants={scaleIn}
                className="relative overflow-hidden rounded-3xl gradient-bg-hero p-12 sm:p-16 text-center text-white"
              >
                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-white/8 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
                    Start your journey today
                  </h2>
                  <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
                    Join 50,000+ learners who transformed their careers with Nexora.
                    Free courses available — no credit card needed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      asChild
                      id="cta-register-btn"
                      className="bg-white text-primary hover:bg-white/90 font-bold shadow-xl rounded-2xl h-13 px-8"
                    >
                      <Link href="/register">
                        Create Free Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      id="cta-courses-btn"
                      className="bg-white/15 text-white hover:bg-white/25 border border-white/25 font-bold rounded-2xl h-13 px-8 backdrop-blur-sm"
                    >
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Section>
          </div>
        </section>

      </main>
    </>
  );
}
