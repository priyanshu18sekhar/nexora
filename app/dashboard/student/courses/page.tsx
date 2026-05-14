import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { BookOpen, CheckCircle, PlayCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

export default async function StudentCoursesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") redirect("/login");

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          category: true,
          _count: { select: { sections: true } }
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">My Courses</h1>
          <p className="text-muted-foreground mt-1">Pick up where you left off or start something new.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Catalog
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => {
          const isCompleted = enrollment.status === "COMPLETED";
          
          return (
            <Card key={enrollment.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
              <div className="aspect-video relative bg-muted overflow-hidden">
                {enrollment.course.thumbnail ? (
                  <img 
                    src={enrollment.course.thumbnail} 
                    alt={enrollment.course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
                
                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {enrollment.course.category?.name || "Course"}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {enrollment.course._count.sections} Sections
                  </span>
                </div>
                
                <h3 className="font-bold text-lg line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                  <Link href={`/courses/${enrollment.course.id}`}>
                    {enrollment.course.title}
                  </Link>
                </h3>
                
                <div className="mt-auto space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{isCompleted ? "Completed" : "In Progress"}</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                        style={{ width: `${enrollment.progress}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {isCompleted ? (
                      <>
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/courses/${enrollment.courseId}/learn`}>
                            Review Material
                          </Link>
                        </Button>
                        <Button asChild className="gradient-bg text-white shadow-brand">
                          <Link href="/dashboard/student/certificates">
                            <Trophy className="w-4 h-4 mr-2" />
                            Certificate
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button asChild className="w-full gradient-bg text-white shadow-brand">
                        <Link href={`/courses/${enrollment.courseId}/learn`}>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {enrollment.progress === 0 ? "Start Learning" : "Resume"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {enrollments.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven&apos;t enrolled in any courses. Browse our catalog to start your learning journey.
            </p>
            <Button asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
