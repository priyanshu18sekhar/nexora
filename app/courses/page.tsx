import React from "react";
import Link from "next/link";
import { Star, Clock, BookOpen, Users, Sparkles } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Avatar } from "@/src/components/ui/avatar";
import { db } from "@/src/lib/db";
import { Aurora } from "@/src/components/effects/aurora";
import { AnimatedGrid } from "@/src/components/effects/animated-grid";
import { CoursesFilter } from "@/src/components/courses/courses-filter";

interface DisplayCourse {
  id: string;
  title: string;
  instructor: { name: string | null; image: string | null };
  rating: number;
  totalRatings: number;
  totalStudents?: number;
  price: number;
  isFree?: boolean;
  level: string;
  duration: number | null;
  thumbnail: string | null;
  category: { name: string } | null;
}

const MOCK_COURSES: DisplayCourse[] = [
  { id: "mock-1", title: "Complete Python Developer in 2024",        instructor: { name: "Sarah Connor",  image: null }, rating: 4.8, totalRatings: 12400, totalStudents: 45000, price: 999,  isFree: false, level: "All Levels",   duration: 1200, thumbnail: null, category: { name: "Programming" } },
  { id: "mock-2", title: "UI/UX Design Masterclass",                  instructor: { name: "Alex Rivera",   image: null }, rating: 4.9, totalRatings: 8300,  totalStudents: 22000, price: 1499, isFree: false, level: "Beginner",     duration: 800,  thumbnail: null, category: { name: "Design" } },
  { id: "mock-3", title: "AI Tools for Productivity",                 instructor: { name: "Nexora Team",    image: null }, rating: 4.8, totalRatings: 5400,  totalStudents: 17000, price: 0,    isFree: true,  level: "Beginner",     duration: 480,  thumbnail: null, category: { name: "AI Tools" } },
  { id: "mock-4", title: "MS Excel Complete Course",                  instructor: { name: "Nexora Team",    image: null }, rating: 4.7, totalRatings: 15200, totalStudents: 38000, price: 499,  isFree: false, level: "All Levels",   duration: 720,  thumbnail: null, category: { name: "MS Office" } },
  { id: "mock-5", title: "Interview Prep Bootcamp",                   instructor: { name: "Career Coach",   image: null }, rating: 4.9, totalRatings: 6800,  totalStudents: 12000, price: 1299, isFree: false, level: "Intermediate", duration: 540,  thumbnail: null, category: { name: "Resume & Interview" } },
  { id: "mock-6", title: "Data Science with Python",                  instructor: { name: "Nexora Team",    image: null }, rating: 4.8, totalRatings: 9100,  totalStudents: 28000, price: 1999, isFree: false, level: "Intermediate", duration: 1500, thumbnail: null, category: { name: "Data Science" } },
];

const gradients = [
  "from-violet-600 to-indigo-700",
  "from-purple-600 to-pink-700",
  "from-blue-600 to-cyan-700",
  "from-emerald-600 to-teal-700",
  "from-amber-600 to-orange-700",
  "from-rose-600 to-pink-700",
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;

  let courses: DisplayCourse[] = [];
  try {
    const rows = await db.course.findMany({
      where: { status: "PUBLISHED" },
      include: {
        instructor: { select: { name: true, image: true } },
        category:   { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    courses = rows as unknown as DisplayCourse[];
  } catch (err) {
    console.error("Failed to fetch courses:", err);
  }

  let displayCourses: DisplayCourse[] = courses.length > 0 ? courses : MOCK_COURSES;

  if (q) {
    const needle = q.toLowerCase();
    displayCourses = displayCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.instructor.name?.toLowerCase().includes(needle) ||
        c.category?.name.toLowerCase().includes(needle)
    );
  }
  if (category) {
    const catName = category.replace(/-/g, " ");
    displayCourses = displayCourses.filter(
      (c) => c.category?.name.toLowerCase() === catName.toLowerCase()
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <Aurora className="opacity-70" />
        <AnimatedGrid />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-semibold tracking-wide mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> 200+ courses · refreshed weekly
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 leading-[1.05]">
              Explore <span className="gradient-text-hero">premium courses</span>
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Hand-picked by industry pros. Verified certificates. Direct internship pipeline.
            </p>
          </div>

          <CoursesFilter initialQuery={q} initialCategory={category} />
        </div>
      </section>

      {/* Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayCourses.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-border bg-card">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-1">No courses found</p>
              <p className="text-sm text-muted-foreground mb-4">Try a different search term or category.</p>
              <Link href="/courses" className="text-sm text-primary font-semibold hover:underline">
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{displayCourses.length}</span> course{displayCourses.length === 1 ? "" : "s"}
                  {category && <> in <span className="font-semibold text-foreground">{category.replace(/-/g, " ")}</span></>}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayCourses.map((course, i) => {
                  const grad = gradients[i % gradients.length];
                  const dur = course.duration ?? 0;
                  return (
                    <Link key={course.id} href={`/courses/${course.id}`} className="group">
                      <article className="h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                        <div className={`aspect-[16/10] relative overflow-hidden bg-gradient-to-br ${grad}`}>
                          {course.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-20" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="w-14 h-14 text-white/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                              </div>
                            </>
                          )}
                          {course.category?.name && (
                            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-md">
                              {course.category.name}
                            </span>
                          )}
                          {course.isFree && (
                            <Badge className="absolute top-3 right-3" variant="success">Free</Badge>
                          )}
                          <span className="absolute bottom-3 right-3 text-[11px] px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-md font-medium">
                            {course.level}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold text-base line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar src={course.instructor.image} name={course.instructor.name} size="xs" />
                            <span className="text-xs text-muted-foreground truncate">{course.instructor.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-foreground">{course.rating}</span>
                              <span>({course.totalRatings.toLocaleString()})</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {Math.floor(dur / 60)}h{dur % 60 ? ` ${dur % 60}m` : ""}
                            </span>
                          </div>
                          {course.totalStudents != null && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                              <Users className="w-3.5 h-3.5" />
                              {course.totalStudents.toLocaleString()} students
                            </div>
                          )}
                          <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                            <span className="font-bold text-lg text-primary">
                              {course.isFree || course.price === 0 ? "Free" : `₹${course.price}`}
                            </span>
                            <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                              View →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
