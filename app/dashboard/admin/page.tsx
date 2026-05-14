import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Users, BookOpen, Video, Briefcase, DollarSign, TrendingUp, Award, Plus, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  // Fetch real stats
  const [
    totalUsers,
    totalStudents,
    totalCourses,
    totalLiveClasses,
    totalInternships,
    totalRevenue
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "STUDENT" } }),
    db.course.count(),
    db.liveClass.count(),
    db.internship.count(),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } })
  ]);

  const upcomingClasses = await db.liveClass.findMany({
    where: { status: "SCHEDULED" },
    orderBy: { scheduledAt: "asc" },
    take: 3,
    include: { _count: { select: { enrollments: true } } }
  });

  const recentEnrollments = await db.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    }
  });

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Students", value: totalStudents, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Courses", value: totalCourses, icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Live Classes", value: totalLiveClasses, icon: Video, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Internships", value: totalInternships, icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Revenue", value: `₹${totalRevenue._sum.amount || 0}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid sm:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-20 flex flex-col gap-2 rounded-xl">
                <Link href="/dashboard/admin/courses/new">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  Create Course
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col gap-2 rounded-xl">
                <Link href="/dashboard/admin/live-classes/new">
                  <Video className="w-5 h-5 text-rose-500" />
                  Schedule Class
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col gap-2 rounded-xl">
                <Link href="/dashboard/admin/certificates/issue">
                  <Award className="w-5 h-5 text-emerald-500" />
                  Issue Certificate
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-semibold">Recent Enrollments</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="/dashboard/admin/users">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentEnrollments.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {recentEnrollments.map((enr) => (
                    <div key={enr.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{enr.user.name}</p>
                        <p className="text-xs text-muted-foreground">{enr.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm line-clamp-1 max-w-[200px] font-medium">{enr.course.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(enr.enrolledAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">No recent enrollments</div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Upcoming Live Classes */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                Upcoming Live Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingClasses.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm line-clamp-1">{cls.title}</h4>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(cls.scheduledAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                          <Users className="w-3 h-3" /> {cls._count.enrollments}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">No scheduled classes</div>
              )}
              <div className="p-3 border-t border-border/50 bg-muted/10">
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link href="/dashboard/admin/live-classes">
                    Manage Classes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
