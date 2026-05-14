import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BookOpen, Plus, MoreVertical, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { enrollments: true, sections: true } }
    }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Manage Courses</h1>
          <p className="text-muted-foreground mt-1">Create and manage your platform&apos;s courses.</p>
        </div>
        <Button asChild className="gradient-bg text-white shadow-brand">
          <Link href="/dashboard/admin/courses/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Students</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.category?.name || "Uncategorized"} • {course._count.sections} sections</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.status === "PUBLISHED" ? "success" : course.status === "DRAFT" ? "warning" : "secondary"}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {course.isFree ? "Free" : `₹${course.price}`}
                    </td>
                    <td className="px-6 py-4">
                      {course._count.enrollments}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/courses/${course.id}`} target="_blank">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                            <Edit className="w-4 h-4 text-primary" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No courses found. Create your first course to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
