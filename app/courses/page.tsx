import React from "react";
import Link from "next/link";
import { Search, Filter, Star, Clock, BookOpen } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";
import { courseCategories } from "@/src/config";
import { db } from "@/src/lib/db";

// Example mock data fallback if DB is empty
const MOCK_COURSES = [
  {
    id: "mock-1",
    title: "Complete Python Developer in 2024",
    instructor: { name: "Sarah Connor", image: null },
    rating: 4.8,
    totalRatings: 12400,
    price: 49.99,
    level: "All Levels",
    duration: 1200,
    thumbnail: null,
    category: { name: "Programming" },
  },
  {
    id: "mock-2",
    title: "UI/UX Design Masterclass",
    instructor: { name: "Alex Rivera", image: null },
    rating: 4.9,
    totalRatings: 8300,
    price: 39.99,
    level: "Beginner",
    duration: 800,
    thumbnail: null,
    category: { name: "Design" },
  },
];

export default async function CoursesPage() {
  // Fetch courses from DB (if any)
  let courses: {
    id: string;
    title: string;
    instructor: { name: string; image: string | null };
    rating: number;
    totalRatings: number;
    price: number;
    level: string;
    duration: number;
    thumbnail: string | null;
    category: { name: string } | null;
  }[] = [];
  try {
    courses = await db.course.findMany({
      where: { status: "PUBLISHED" },
      include: {
        instructor: { select: { name: true, image: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  const displayCourses = courses.length > 0 ? courses : MOCK_COURSES;

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
            <p className="text-muted-foreground">
              Level up your skills with our expert-led courses
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Input
                placeholder="Search for courses..."
                leftIcon={<Search className="w-4 h-4" />}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 custom-scrollbar gap-2">
          <Badge variant="default" className="px-4 py-2 text-sm rounded-full cursor-pointer shrink-0">
            All Categories
          </Badge>
          {courseCategories.map((cat) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="px-4 py-2 text-sm rounded-full cursor-pointer shrink-0 bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card variant="hover" className="h-full flex flex-col group overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full gradient-bg flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  {course.category?.name && (
                    <Badge className="absolute top-3 left-3" variant="secondary">
                      {course.category.name}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3 mt-auto">
                    <Avatar
                      src={course.instructor.image}
                      name={course.instructor.name}
                      size="xs"
                    />
                    <span className="text-sm text-muted-foreground truncate">
                      {course.instructor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{course.rating}</span>
                      <span>({course.totalRatings})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{Math.floor(course.duration / 60)}h {(course.duration % 60) || 0}m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-bold text-lg text-primary">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                      {course.level}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
