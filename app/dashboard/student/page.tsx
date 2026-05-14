import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BookOpen, Video, Award, Target, Flame, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") redirect("/login");

  // Fetch student data
  const [enrollments, liveClasses, certificates, completedQuizzes] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: { select: { title: true, thumbnail: true } }
      },
      orderBy: { enrolledAt: "desc" },
      take: 3
    }),
    db.liveClassEnrollment.findMany({
      where: { userId: session.user.id, liveClass: { status: "SCHEDULED" } },
      include: {
        liveClass: true
      },
      orderBy: { liveClass: { scheduledAt: "asc" } },
      take: 2
    }),
    db.certificate.count({ where: { userId: session.user.id } }),
    db.quizAttempt.count({ where: { userId: session.user.id, passed: true } })
  ]);

  const activeCourses = enrollments.filter(e => e.status === "ACTIVE").length;
  const completedCourses = enrollments.filter(e => e.status === "COMPLETED").length;

  const stats = [
    { label: "Active Courses", value: activeCourses, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Completed Courses", value: completedCourses, icon: Target, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Certificates Earned", value: certificates, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Quizzes Passed", value: completedQuizzes, icon: Flame, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Welcome back, {session.user.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl font-bold">
          <Flame className="w-5 h-5" />
          <span>3 Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-semibold">Continue Learning</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/dashboard/student/courses">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {enrollments.length > 0 ? (
              <div className="divide-y divide-border/50">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {enrollment.course.thumbnail ? (
                          <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{enrollment.course.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{Math.round(enrollment.progress)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" asChild className={enrollment.progress === 100 ? "variant-outline" : "gradient-bg text-white"}>
                      <Link href={`/courses/${enrollment.courseId}/learn`}>
                        {enrollment.progress === 100 ? "Review" : <><PlayCircle className="w-4 h-4 mr-1.5" /> Resume</>}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="mb-4">You are not enrolled in any courses yet.</p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-500" />
              Upcoming Live Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {liveClasses.length > 0 ? (
              <div className="divide-y divide-border/50">
                {liveClasses.map(({ liveClass }) => (
                  <div key={liveClass.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <h4 className="font-semibold text-sm line-clamp-1 mb-2">{liveClass.title}</h4>
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-muted-foreground">
                        {new Date(liveClass.scheduledAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                      {liveClass.meetLink && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                          <a href={liveClass.meetLink} target="_blank" rel="noopener noreferrer">Join Link</a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <p className="mb-3">No upcoming live classes.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/student/live-classes">Browse Classes</Link>
                </Button>
              </div>
            )}
            <div className="p-3 border-t border-border/50 bg-muted/10">
              <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                <Link href="/dashboard/student/live-classes">
                  View Schedule <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
