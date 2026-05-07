"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Star,
  Play,
  CheckCircle2,
  Zap,
  Globe,
  Shield,
  Code2,
  FileSpreadsheet,
  MessageSquare,
  FileText,
  Database,
  Palette,
  ChevronRight,
  GraduationCap,
  Building,
  Laptop,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Navbar } from "@/src/components/layout/navbar";
import { Footer } from "@/src/components/layout/footer";

// ── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// ── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "50K+", label: "Active Learners", icon: Users },
  { value: "1200+", label: "Expert-Led Courses", icon: BookOpen },
  { value: "300+", label: "Internship Partners", icon: Building },
  { value: "95%", label: "Placement Rate", icon: TrendingUp },
];

const categories = [
  { name: "Programming", icon: Code2, color: "from-violet-500 to-indigo-600", count: 240 },
  { name: "AI & Machine Learning", icon: Sparkles, color: "from-purple-500 to-pink-600", count: 180 },
  { name: "MS Office", icon: FileSpreadsheet, color: "from-blue-500 to-cyan-600", count: 85 },
  { name: "Business Skills", icon: TrendingUp, color: "from-amber-500 to-orange-600", count: 120 },
  { name: "Communication", icon: MessageSquare, color: "from-emerald-500 to-teal-600", count: 95 },
  { name: "Resume & Interview", icon: FileText, color: "from-red-500 to-rose-600", count: 70 },
  { name: "Data Science", icon: Database, color: "from-teal-500 to-cyan-600", count: 110 },
  { name: "Design", icon: Palette, color: "from-pink-500 to-rose-600", count: 90 },
];

const features = [
  {
    icon: Zap,
    title: "Learn at your own pace",
    description:
      "Flexible schedules with lifetime access to course content. Learn when it suits you.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Globe,
    title: "Industry mentors",
    description:
      "Get guided by working professionals from top companies. Real-world insights, not just theory.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "Verified certificates",
    description:
      "Earn certificates recognized by hundreds of partner companies. Boost your resume instantly.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Briefcase,
    title: "Direct internship access",
    description:
      "Apply to exclusive internships from our recruiter network. No middlemen, faster decisions.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const courses = [
  {
    title: "Full-Stack Web Development",
    instructor: "Rajesh Kumar",
    rating: 4.9,
    students: 12400,
    price: 49.99,
    level: "Beginner",
    badge: "Bestseller",
    badgeColor: "warning" as const,
    gradient: "from-violet-600 to-indigo-700",
    icon: Code2,
  },
  {
    title: "ChatGPT & AI Tools Mastery",
    instructor: "Priya Sharma",
    rating: 4.8,
    students: 8700,
    price: 39.99,
    level: "Beginner",
    badge: "Trending",
    badgeColor: "info" as const,
    gradient: "from-purple-600 to-pink-700",
    icon: Sparkles,
  },
  {
    title: "MS Office Complete Course",
    instructor: "Anita Mehta",
    rating: 4.7,
    students: 15200,
    price: 29.99,
    level: "All Levels",
    badge: "Top Rated",
    badgeColor: "success" as const,
    gradient: "from-blue-600 to-cyan-700",
    icon: FileSpreadsheet,
  },
  {
    title: "Interview Preparation Bootcamp",
    instructor: "Vikram Singh",
    rating: 4.9,
    students: 6800,
    price: 59.99,
    level: "Intermediate",
    badge: "New",
    badgeColor: "purple" as const,
    gradient: "from-emerald-600 to-teal-700",
    icon: MessageSquare,
  },
];

const testimonials = [
  {
    name: "Aisha Patel",
    role: "Software Engineer at Google",
    content:
      "Nexora completely changed my career trajectory. The internship I got through the platform led directly to my dream job. The courses are world-class!",
    rating: 5,
    avatar: "AP",
  },
  {
    name: "Ravi Menon",
    role: "Data Analyst at Microsoft",
    content:
      "I went from zero to landing a job in data science in 4 months. The mentorship system is what makes Nexora truly special. My mentor was always available.",
    rating: 5,
    avatar: "RM",
  },
  {
    name: "Sunita Verma",
    role: "Retired teacher, now Digital Marketing Specialist",
    content:
      "At 55, I was worried about learning digital skills. Nexora's beginner-friendly approach and patient instructors made it easy. Now I run my own online consulting!",
    rating: 5,
    avatar: "SV",
  },
];

const audienceSegments = [
  {
    icon: GraduationCap,
    title: "Engineering Students",
    description:
      "Bridge the gap between academics and industry. Build real projects and land your first internship.",
    color: "from-violet-500 to-purple-600",
    href: "/for-students",
  },
  {
    icon: Laptop,
    title: "Working Professionals",
    description:
      "Upskill without quitting your job. Advance your career with in-demand skills at your own pace.",
    color: "from-blue-500 to-cyan-600",
    href: "/for-professionals",
  },
  {
    icon: Users,
    title: "Beginners & Seniors",
    description:
      "No prior experience needed. Our structured learning paths take you from zero to confident.",
    color: "from-emerald-500 to-teal-600",
    href: "/for-beginners",
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center pt-16">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  India&apos;s #1 Learning Platform for Career Growth
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
              >
                Learn. Intern.{" "}
                <span className="gradient-text">Succeed.</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                variants={fadeUp}
                className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed"
              >
                From programming to AI tools, MS Office to communication skills —
                Nexora gives you the skills, internships, and mentorship to build
                the career you deserve.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="xl" asChild id="hero-start-btn">
                  <Link href="/register">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild id="hero-explore-btn">
                  <Link href="/courses">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Explore Courses
                  </Link>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-4"
              >
                {[
                  "No credit card required",
                  "Free courses available",
                  "Cancel anytime",
                  "Certificates included",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Floating course card preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 relative"
            >
              <div className="relative max-w-4xl mx-auto">
                {/* Main stats bar */}
                <div className="glass-dark rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Audience Section ─────────────────────────────────────────────── */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Built for every kind of learner
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Whether you&apos;re a student, professional, or senior citizen —
                  Nexora is designed for you.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-3 gap-6">
                {audienceSegments.map((segment) => (
                  <motion.div key={segment.title} variants={scaleIn}>
                    <Link href={segment.href}>
                      <Card variant="hover" className="h-full group">
                        <CardContent className="p-6">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${segment.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <segment.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {segment.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {segment.description}
                          </p>
                          <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                            Learn more <ChevronRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Categories ───────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Course Categories</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Explore what you want to learn
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  From cutting-edge AI to fundamental office skills — we have
                  something for every goal and skill level.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <motion.div key={cat.name} variants={fadeUp}>
                    <Link href={`/courses?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <div className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                        >
                          <cat.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-medium text-sm mb-1">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {cat.count}+ courses
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Featured Courses ─────────────────────────────────────────────── */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10"
              >
                <div>
                  <Badge variant="secondary" className="mb-2">Top Courses</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold">
                    Most popular courses
                  </h2>
                </div>
                <Button variant="outline" asChild className="mt-4 sm:mt-0">
                  <Link href="/courses">
                    View all courses <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <motion.div key={course.title} variants={fadeUp}>
                    <Card variant="hover" className="overflow-hidden group">
                      {/* Thumbnail */}
                      <div
                        className={`relative h-40 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}
                      >
                        <course.icon className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute top-3 left-3">
                          <Badge variant={course.badgeColor}>{course.badge}</Badge>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                            {course.level}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {course.instructor}
                        </p>
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold">
                            {course.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({(course.students / 1000).toFixed(1)}K)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            ${course.price}
                          </span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            Enroll
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Why Nexora?</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Everything you need to succeed
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  We go beyond just courses. Nexora is a complete career
                  acceleration platform.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                  <motion.div key={feature.title} variants={fadeUp}>
                    <Card variant="elevated" className="h-full">
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                        >
                          <feature.icon className={`w-6 h-6 ${feature.color}`} />
                        </div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Success Stories</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Join thousands of success stories
                </h2>
              </motion.div>

              <div className="grid sm:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <motion.div key={testimonial.name} variants={fadeUp}>
                    <Card variant="elevated" className="h-full">
                      <CardContent className="p-6 flex flex-col gap-4">
                        {/* Stars */}
                        <div className="flex gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        {/* Quote */}
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        {/* Author */}
                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {testimonial.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div
                variants={scaleIn}
                className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center text-white"
              >
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    Start your journey today
                  </h2>
                  <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                    Join 50,000+ learners who transformed their careers with Nexora.
                    Free courses available — no credit card needed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="xl"
                      variant="glass"
                      asChild
                      id="cta-register-btn"
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      <Link href="/register">
                        Create Free Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      size="xl"
                      className="bg-white text-primary hover:bg-white/90 shadow-lg"
                      asChild
                      id="cta-courses-btn"
                    >
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
