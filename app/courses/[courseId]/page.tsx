import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Star, Users, CheckCircle2, PlayCircle, Lock, MonitorPlay, FileText, Award } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";
import { db } from "@/src/lib/db";
import { formatPrice } from "@/src/lib/utils";
import { CourseEnrollButton } from "@/src/components/courses/enroll-button";

// Mock data if db query fails or no course found
const MOCK_COURSE = {
  id: "mock-1",
  title: "Complete Python Developer in 2024",
  description: "Learn Python from scratch and build real-world applications. This comprehensive course covers everything from basics to advanced topics including web development, data science, and machine learning.",
  shortDesc: "Master Python by building 100 projects in 100 days. Learn to build websites, games, apps, plus scraping and data science.",
  price: 49.99,
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
        { id: "les-1", title: "Introduction to Python", duration: 300, isFree: true },
        { id: "les-2", title: "Installing Python & IDE", duration: 420, isFree: true },
        { id: "les-3", title: "Your First Python Program", duration: 600, isFree: false },
      ]
    },
    {
      id: "sec-2",
      title: "Data Types & Variables",
      lessons: [
        { id: "les-4", title: "Numbers & Strings", duration: 900, isFree: false },
        { id: "les-5", title: "Lists, Tuples & Sets", duration: 1200, isFree: false },
      ]
    }
  ],
  requirements: ["No programming experience needed", "Mac or PC computer with internet", "No paid software required"],
  whatYouWillLearn: ["Build 100 real Python projects", "Master Data Science & Machine Learning", "Create full-stack web apps", "Automate daily tasks"]
};

export default async function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  let course = null;
  try {
    course = await db.course.findUnique({
      where: { id: params.courseId },
      include: {
        instructor: true,
        sections: {
          include: { lessons: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch course details:", error);
  }

  // Fallback to mock for UI demonstration
  const displayCourse = course || MOCK_COURSE;

  if (!displayCourse) {
    notFound();
  }

  const totalDuration = displayCourse.sections?.reduce((acc, sec) => 
    acc + sec.lessons.reduce((lAcc, l) => lAcc + (l.duration || 0), 0)
  , 0) || 0;

  const totalLessons = displayCourse.sections?.reduce((acc, sec) => acc + sec.lessons.length, 0) || 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-foreground text-background py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-sm text-background/60 mb-4">
                <Link href="/courses" className="hover:text-background transition-colors">Courses</Link>
                <span>›</span>
                <span className="text-background/90 font-medium">Programming</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {displayCourse.title}
              </h1>
              
              <p className="text-lg text-background/80 leading-relaxed">
                {displayCourse.shortDesc || displayCourse.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm pt-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  {displayCourse.rating}
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-background/60 font-normal">
                    ({displayCourse.totalRatings} ratings)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-background/80">
                  <Users className="w-4 h-4" />
                  {(displayCourse.totalStudents || 0).toLocaleString()} students
                </div>
                <div className="flex items-center gap-1.5 text-background/80">
                  <Clock className="w-4 h-4" />
                  Last updated 10/2024
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Avatar src={displayCourse.instructor.image} name={displayCourse.instructor.name} size="sm" />
                <div className="text-sm">
                  Created by <span className="font-medium text-background underline underline-offset-4">{displayCourse.instructor.name}</span>
                </div>
              </div>
            </div>

            {/* Desktop Sticky Card Space */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 relative">
          
          {/* Main Content */}
          <div className="lg:col-span-2 py-12 space-y-12">
            
            {/* What you'll learn */}
            <Card variant="elevated">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6">What you'll learn</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(((displayCourse as any).whatYouWillLearn) || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <div>
              <h2 className="text-xl font-bold mb-6">Course content</h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{displayCourse.sections?.length || 0} sections • {totalLessons} lectures • {Math.floor(totalDuration/60)}h {totalDuration%60}m total length</span>
              </div>
              
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                {displayCourse.sections?.map((section, idx) => (
                  <div key={section.id} className="border-b border-border last:border-0">
                    <div className="bg-muted/50 p-4 font-medium flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold shrink-0 shadow-sm border border-border">
                          {idx + 1}
                        </span>
                        <span>{section.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground font-normal">
                        {section.lessons.length} lectures
                      </span>
                    </div>
                    <div className="divide-y divide-border">
                      {section.lessons.map(lesson => (
                        <div key={lesson.id} className="p-4 flex items-start sm:items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-start sm:items-center gap-3">
                            <MonitorPlay className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                            <span className={lesson.isFree ? "text-primary font-medium" : "text-foreground"}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            {lesson.isFree && (
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Preview</span>
                            )}
                            <span className="text-sm text-muted-foreground tabular-nums">
                              {Math.floor((lesson.duration || 0)/60)}:{(lesson.duration || 0)%60 < 10 ? '0' : ''}{(lesson.duration || 0)%60}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {(((displayCourse as any).requirements) || []).map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {displayCourse.description}
              </div>
            </div>

          </div>

          {/* Sidebar / Floating Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 lg:-mt-64 z-10">
              <Card variant="elevated" className="overflow-hidden border-border shadow-2xl">
                {/* Video Preview */}
                <div className="aspect-video bg-muted relative group cursor-pointer border-b border-border">
                  <div className="absolute inset-0 gradient-bg opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-white drop-shadow-md">
                    Preview this course
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-6">
                    {displayCourse.isFree ? "Free" : formatPrice(displayCourse.price)}
                  </div>

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
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center gap-3">
                        <MonitorPlay className="w-4 h-4" /> {Math.floor(totalDuration/60)} hours on-demand video
                      </li>
                      <li className="flex items-center gap-3">
                        <FileText className="w-4 h-4" /> 15 articles and resources
                      </li>
                      <li className="flex items-center gap-3">
                        <Lock className="w-4 h-4" /> Full lifetime access
                      </li>
                      <li className="flex items-center gap-3">
                        <Award className="w-4 h-4" /> Certificate of completion
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
  );
}
