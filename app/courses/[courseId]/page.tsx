import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock, Star, Users, CheckCircle2, PlayCircle, Lock,
  MonitorPlay, FileText, Award, Globe, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";
import { db } from "@/src/lib/db";
import { formatPrice } from "@/src/lib/utils";
import { CourseEnrollButton } from "@/src/components/courses/enroll-button";
import { Aurora } from "@/src/components/effects/aurora";

const MOCK_COURSE = {
  id: "mock-1",
  title: "Complete Python Developer in 2024",
  description:
    "Learn Python from scratch and build real-world applications. This comprehensive course covers everything from basics to advanced topics including web development, data science, and machine learning.",
  shortDesc:
    "Master Python by building 100 projects in 100 days. Learn to build websites, games, apps, plus scraping and data science.",
  price: 999,
  isFree: false,
  level: "All Levels",
  language: "English",
  rating: 4.8,
  totalRatings: 12400,
  totalStudents: 45000,
  instructor: {
    name: "Sarah Connor",
    headline: "Senior Software Engineer & Tech Educator",
    image: null,
    bio: "I have been teaching programming for over 10 years to more than 500,000 students worldwide.",
  },
  sections: [
    {
      id: "sec-1",
      title: "Getting Started with Python",
      lessons: [
        { id: "les-1", title: "Introduction to Python",      duration: 300, isFree: true },
        { id: "les-2", title: "Installing Python & IDE",     duration: 420, isFree: true },
        { id: "les-3", title: "Your First Python Program",   duration: 600, isFree: false },
      ],
    },
    {
      id: "sec-2",
      title: "Data Types & Variables",
      lessons: [
        { id: "les-4", title: "Numbers & Strings",           duration: 900,  isFree: false },
        { id: "les-5", title: "Lists, Tuples & Sets",        duration: 1200, isFree: false },
      ],
    },
  ],
  requirements: [
    "No programming experience needed",
    "Mac or PC computer with internet",
    "No paid software required",
  ],
  whatYouWillLearn: [
    "Build 100 real Python projects",
    "Master Data Science & Machine Learning",
    "Create full-stack web apps",
    "Automate daily tasks",
  ],
};

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  let course = null;
  try {
    course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
        sections: {
          include: { lessons: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (err) {
    console.error("Failed to fetch course details:", err);
  }

  const displayCourse = course || MOCK_COURSE;
  if (!displayCourse) notFound();

  const totalDuration =
    displayCourse.sections?.reduce(
      (acc, sec) => acc + sec.lessons.reduce((lAcc, l) => lAcc + (l.duration || 0), 0),
      0,
    ) || 0;
  const totalLessons = displayCourse.sections?.reduce((acc, sec) => acc + sec.lessons.length, 0) || 0;
  const learnList =
    (displayCourse as unknown as { whatYouWillLearn?: string[] }).whatYouWillLearn || [];
  const reqList =
    (displayCourse as unknown as { requirements?: string[] }).requirements || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative pt-24 pb-12 lg:pb-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
        <Aurora className="opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-sm text-white/55">
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white/90 font-medium">Programming</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-display tracking-tight leading-[1.05]">
                {displayCourse.title}
              </h1>

              <p className="text-lg text-white/75 leading-relaxed max-w-2xl">
                {displayCourse.shortDesc || displayCourse.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-400">{displayCourse.rating}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white/60">({displayCourse.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Users className="w-4 h-4" />
                  {(displayCourse.totalStudents || 0).toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Globe className="w-4 h-4" />
                  {displayCourse.language || "English"}
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Clock className="w-4 h-4" />
                  Last updated 10/2024
                </span>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Avatar src={displayCourse.instructor.image} name={displayCourse.instructor.name} size="sm" />
                <div className="text-sm">
                  Created by{" "}
                  <span className="font-semibold underline underline-offset-4">
                    {displayCourse.instructor.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 relative">
          {/* Main */}
          <div className="lg:col-span-2 py-12 space-y-12">
            {/* What you'll learn */}
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </span>
                  What you&apos;ll learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  {learnList.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/75 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <div>
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-xl font-bold font-display">Course content</h2>
                <span className="text-sm text-muted-foreground">
                  {displayCourse.sections?.length || 0} sections · {totalLessons} lectures · {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                </span>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden bg-card">
                {displayCourse.sections?.map((section, idx) => (
                  <details key={section.id} open={idx === 0} className="border-b border-border last:border-0 group/details">
                    <summary className="cursor-pointer list-none bg-muted/30 hover:bg-muted/50 transition-colors p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg gradient-bg text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold truncate">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                        <span>{section.lessons.length} lectures</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-open/details:rotate-90" />
                      </div>
                    </summary>
                    <div className="divide-y divide-border">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-4 flex items-start sm:items-center justify-between hover:bg-muted/20 transition-colors gap-3"
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            {lesson.isFree ? (
                              <PlayCircle className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5 sm:mt-0" />
                            )}
                            <span className={`text-sm ${lesson.isFree ? "text-primary font-medium" : "text-foreground/85"} truncate`}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {lesson.isFree && (
                              <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                Preview
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {Math.floor((lesson.duration || 0) / 60)}:{((lesson.duration || 0) % 60).toString().padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-bold font-display mb-4">Requirements</h2>
              <ul className="space-y-2.5 text-foreground/75">
                {reqList.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold font-display mb-4">Description</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/75 leading-relaxed whitespace-pre-wrap">
                {displayCourse.description}
              </div>
            </div>
          </div>

          {/* Sticky enroll card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 lg:-mt-72 z-10">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/40 via-blue-500/30 to-purple-500/40 blur-xl opacity-60" />
                <Card variant="elevated" className="relative overflow-hidden border-border shadow-2xl rounded-2xl">
                  <div className="aspect-video relative group cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-700" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 text-center text-sm font-medium text-white drop-shadow-md">
                      Preview this course
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-3 mb-1">
                      <div className="text-3xl font-bold font-display">
                        {displayCourse.isFree ? "Free" : formatPrice(displayCourse.price)}
                      </div>
                      {!displayCourse.isFree && displayCourse.price < 2000 && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{(displayCourse.price * 3).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {!displayCourse.isFree && (
                      <p className="text-xs text-rose-500 font-semibold mb-5">
                        ⏰ Limited-time offer — 67% off
                      </p>
                    )}

                    <div className="space-y-3 mb-6">
                      <CourseEnrollButton
                        courseId={displayCourse.id}
                        price={displayCourse.price}
                        isFree={displayCourse.isFree}
                      />
                      <p className="text-center text-xs text-muted-foreground">
                        30-Day Money-Back Guarantee
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <h4 className="font-semibold text-sm">This course includes:</h4>
                      <ul className="space-y-3 text-sm text-foreground/75">
                        <li className="flex items-center gap-3">
                          <MonitorPlay className="w-4 h-4 text-primary/80" />
                          {Math.floor(totalDuration / 60)} hours on-demand video
                        </li>
                        <li className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-primary/80" />
                          15 articles and resources
                        </li>
                        <li className="flex items-center gap-3">
                          <Lock className="w-4 h-4 text-primary/80" />
                          Full lifetime access
                        </li>
                        <li className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-primary/80" />
                          Certificate of completion
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
