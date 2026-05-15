import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import {
  BookOpen, Award, Target, Flame, ArrowRight, PlayCircle,
  Sparkles, TrendingUp, Calendar, ChevronRight, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { calculateProfileCompletion } from "@/src/lib/profile-completion";
import { ProfileCompletionCard } from "@/src/components/dashboard/profile-completion-card";
import { PointsCard } from "@/src/components/dashboard/points-card";
import { RecommendedCourses } from "@/src/components/dashboard/recommended-courses";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user || !["STUDENT", "PROFESSIONAL"].includes(session.user.role)) redirect("/login");

  const userId = session.user.id;

  const [user, enrollments, certificates, quizStats] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        name: true, image: true, headline: true, bio: true, location: true,
        linkedinUrl: true, githubUrl: true, website: true, skills: true,
      },
    }),
    db.enrollment.findMany({
      where: { userId },
      include: { course: { select: { title: true, thumbnail: true, id: true } } },
      orderBy: { enrolledAt: "desc" },
      take: 5,
    }),
    db.certificate.count({ where: { userId, status: "ISSUED" } }),
    db.quizAttempt.findMany({
      where: { userId },
      select: { passed: true, score: true },
    }),
  ]);

  const passedQuizzes = quizStats.filter((q) => q.passed).length;
  const totalAttempts = quizStats.length;
  const averageScore = totalAttempts > 0
    ? Math.round(quizStats.reduce((s, q) => s + q.score, 0) / totalAttempts)
    : 0;

  const activeCourses    = enrollments.filter((e) => e.status === "ACTIVE").length;
  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
  const totalCourses     = enrollments.length;
  const avgProgress = totalCourses
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / totalCourses)
    : 0;

  const profileCompletion = calculateProfileCompletion(user ?? {});

  const stats = [
    { label: "Active",      value: activeCourses,    icon: BookOpen, gradient: "from-violet-500 to-indigo-600" },
    { label: "Completed",   value: completedCourses, icon: Target,   gradient: "from-blue-500 to-cyan-600" },
    { label: "Certificates",value: certificates,     icon: Award,    gradient: "from-emerald-500 to-teal-600" },
    { label: "Quizzes",     value: passedQuizzes,    icon: Flame,    gradient: "from-rose-500 to-pink-600" },
  ];

  const firstName = session.user.name?.split(" ")[0] || "there";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg-hero p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-15" />
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wider font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-white/75 text-sm max-w-md">
              {totalCourses > 0
                ? `You're ${avgProgress}% through your active courses. Keep it up!`
                : "Pick a course below and start your learning streak today."}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl shadow-md">
              <Link href="/courses">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Explore
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm rounded-xl font-semibold">
              <Link href="/dashboard/student/courses">My Courses</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-4 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/15 blur-xl" />
            <div className="relative w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="relative text-3xl font-bold font-display tabular-nums leading-none">{stat.value}</p>
            <p className="relative text-xs font-medium mt-1.5 text-white/85">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid: 2/3 + 1/3 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PlayCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-bold font-display text-base">Continue learning</h2>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground gap-1">
                <Link href="/dashboard/student/courses">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>

            {enrollments.length > 0 ? (
              <div className="divide-y divide-border/50">
                {enrollments.map((enrollment) => {
                  const done = enrollment.progress >= 100;
                  return (
                    <div key={enrollment.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-16 h-12 bg-muted rounded-xl overflow-hidden flex-shrink-0 relative">
                          {enrollment.course.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full gradient-bg flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-white/70" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm line-clamp-1">{enrollment.course.title}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="w-32 sm:w-40 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${done ? "bg-emerald-500" : "gradient-bg"}`}
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums font-medium">
                              {Math.round(enrollment.progress)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        asChild
                        className={done
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 flex-shrink-0 rounded-xl"
                          : "gradient-bg text-white flex-shrink-0 rounded-xl shadow-brand"}
                      >
                        <Link href={`/courses/${enrollment.course.id}/learn`}>
                          {done ? "Review" : <><PlayCircle className="w-3.5 h-3.5 mr-1.5" />Resume</>}
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-primary/70" />
                </div>
                <p className="font-semibold mb-1">Your learning starts here</p>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                  You haven&apos;t enrolled in any courses yet. Browse our catalog.
                </p>
                <Button asChild className="gradient-bg text-white rounded-xl shadow-brand">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Recommended courses */}
          <RecommendedCourses
            userId={userId}
            userSkills={user?.skills ?? []}
            enrolledCourseIds={enrollments.map((e) => e.course.id)}
          />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <ProfileCompletionCard user={user ?? {}} />

          <PointsCard
            completedCourses={completedCourses}
            activeCourses={activeCourses}
            passedQuizzes={passedQuizzes}
            certificates={certificates}
            averageScore={averageScore}
            profileCompletionPct={profileCompletion.percent}
          />

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Quick actions</h3>
            </div>
            {[
              { href: "/dashboard/student/progress",     icon: TrendingUp,    label: "Track progress" },
              { href: "/dashboard/student/certificates", icon: Award,         label: "My certificates" },
              { href: "/internships",                    icon: GraduationCap, label: "Browse internships" },
              { href: "/dashboard/student/live-classes", icon: Calendar,      label: "Upcoming live classes" },
            ].map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted transition-colors group"
              >
                <span className="flex items-center gap-2.5 text-sm">
                  <q.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium">{q.label}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
