import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import {
  BookOpen,
  Briefcase,
  Award,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Flame,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar } from "@/src/components/ui/avatar";
import { formatDate } from "@/src/lib/utils";

async function getStudentData(userId: string) {
  const [enrollments, applications, certificates, notifications] = await Promise.all([
    db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            totalLessons: true,
            instructor: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 5,
    }),
    db.internshipApplication.findMany({
      where: { userId },
      include: {
        internship: { select: { title: true, company: true, companyLogo: true } },
      },
      orderBy: { appliedAt: "desc" },
      take: 5,
    }),
    db.certificate.count({ where: { userId, status: "ISSUED" } }),
    db.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const avgProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

  return {
    enrollments,
    applications,
    certificates,
    notifications,
    avgProgress,
    stats: {
      totalCourses: enrollments.length,
      totalApplications: applications.length,
      totalCertificates: certificates,
      avgProgress,
    },
  };
}

const statusColors: Record<string, "success" | "warning" | "info" | "destructive" | "outline"> = {
  ACTIVE: "info",
  COMPLETED: "success",
  PENDING: "warning",
  REVIEWING: "info",
  SHORTLISTED: "success",
  ACCEPTED: "success",
  REJECTED: "destructive",
};

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Non-admin/mentor roles can use student dashboard
  const data = await getStudentData(session.user.id);
  const { enrollments, applications, certificates, notifications, stats } = data;

  const statCards = [
    {
      label: "Enrolled Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      change: "+2 this month",
    },
    {
      label: "Avg. Progress",
      value: `${stats.avgProgress}%`,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      change: "Keep going!",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      icon: Briefcase,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      change: "3 in review",
    },
    {
      label: "Certificates",
      value: stats.totalCertificates,
      icon: Award,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      change: "Verified",
    },
  ];

  return (
    <div className="p-6 lg:p-8 xl:p-10 space-y-8 max-w-7xl">
      {/* Premium Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">
              {session.user.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Here&apos;s what&apos;s happening with your learning journey today.
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex-shrink-0">
            <Badge variant="default" className="rounded-full px-3 py-1 text-xs font-semibold shadow-brand gradient-bg text-white border-0">
              {notifications.length} new alerts
            </Badge>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={stat.label} variant="elevated" className="group overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} transition-transform duration-200 group-hover:scale-110`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold font-display tracking-tight mb-0.5">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              {/* Accent bar */}
              <div className={`mt-3 h-0.5 w-8 rounded-full ${stat.bg} opacity-80`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
              </div>
              Continue Learning
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/8 font-medium text-xs">
              <Link href="/dashboard/student/courses">
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          {enrollments.length > 0 ? (
            <div className="space-y-3">
              {enrollments.slice(0, 3).map((enrollment) => (
                <Card key={enrollment.id} variant="elevated" className="group hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-brand">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {enrollment.course.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar
                            src={enrollment.course.instructor.image}
                            name={enrollment.course.instructor.name}
                            size="xs"
                          />
                          <span className="text-xs text-muted-foreground">
                            {enrollment.course.instructor.name}
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild className="flex-shrink-0 text-xs font-semibold rounded-lg">
                        <Link href={`/courses/${enrollment.courseId}/learn`}>
                          Resume
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="elevated">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-bg-soft flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">No courses enrolled yet</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                  Explore our curated library of 1,200+ courses and start your journey today.
                </p>
                <Button asChild className="gradient-bg text-white font-semibold shadow-brand rounded-xl">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Applications */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                    <Target className="w-3 h-3 text-amber-500" />
                  </div>
                  Applications
                </span>
                <Button variant="ghost" size="icon-sm" asChild className="w-7 h-7 text-muted-foreground hover:text-foreground">
                  <Link href="/dashboard/student/internships">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {applications.length > 0 ? (
                <div className="space-y-1.5">
                  {applications.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {app.internship.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.internship.company}
                        </p>
                      </div>
                      <Badge variant={statusColors[app.status] || "outline"} className="ml-2 flex-shrink-0 text-xs">
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/8 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">No applications yet</p>
                  <Button variant="outline" size="sm" asChild className="text-xs rounded-lg">
                    <Link href="/internships">Find Internships</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {[
                { label: "Browse Courses", href: "/courses", icon: BookOpen, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/8" },
                { label: "Find Internships", href: "/internships", icon: Briefcase, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/8" },
                { label: "My Certificates", href: "/dashboard/student/certificates", icon: Award, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/8" },
                { label: "Track Progress", href: "/dashboard/student/progress", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/8" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium flex-1">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
