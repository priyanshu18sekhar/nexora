import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Flame, BrainCircuit, Target, CheckCircle, XCircle, Award, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { formatDate } from "@/src/lib/utils";

export default async function StudentProgressPage() {
  const session = await auth();
  if (!session?.user || !["STUDENT", "PROFESSIONAL"].includes(session.user.role)) redirect("/login");

  const [quizAttempts, enrollments] = await Promise.all([
    db.quizAttempt.findMany({
      where: { userId: session.user.id },
      include: {
        quiz: {
          select: {
            title: true,
            passingScore: true,
            lesson: { select: { section: { select: { course: { select: { title: true } } } } } },
          },
        },
      },
      orderBy: { attemptedAt: "desc" },
      take: 20,
    }),
    db.enrollment.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { title: true, thumbnail: true } } },
      orderBy: { enrolledAt: "desc" },
    }),
  ]);

  const totalAttempts = quizAttempts.length;
  const passedAttempts = quizAttempts.filter((a) => a.passed).length;
  const averageScore = totalAttempts > 0
    ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-15" />
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-white/75 text-xs uppercase tracking-wider font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Learning analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-2">My Progress</h1>
          <p className="text-white/80 text-sm max-w-md">
            Track your quiz scores, completion streaks, and overall course performance.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-white/85 text-sm">Average Score</p>
          </div>
          <p className="relative text-5xl font-bold font-display tabular-nums leading-none">
            {averageScore}<span className="text-2xl text-white/70">%</span>
          </p>
          <p className="relative text-xs text-white/70 mt-3">across {totalAttempts} quiz attempt{totalAttempts === 1 ? "" : "s"}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="font-semibold text-sm">Pass Rate</p>
          </div>
          <p className="relative text-5xl font-bold font-display tabular-nums leading-none">
            {passRate}<span className="text-2xl text-muted-foreground">%</span>
          </p>
          <p className="relative text-xs text-muted-foreground mt-3">
            {passedAttempts} passed of {totalAttempts}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl" />
          <div className="relative flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <p className="font-semibold text-sm">Learning Streak</p>
          </div>
          <p className="relative text-5xl font-bold font-display tabular-nums leading-none">
            3<span className="text-2xl text-muted-foreground">d</span>
          </p>
          <p className="relative text-xs text-muted-foreground mt-3">Log in tomorrow to extend</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent attempts */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-bold font-display text-base">Recent quiz attempts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30 border-b border-border/50">
                  <th className="px-5 py-3 text-left font-semibold">Quiz</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                  <th className="px-5 py-3 text-left font-semibold">Score</th>
                  <th className="px-5 py-3 text-left font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {quizAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-sm">{attempt.quiz.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {attempt.quiz.lesson.section.course.title}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(attempt.attemptedAt)}
                    </td>
                    <td className="px-5 py-3.5 font-bold tabular-nums">
                      {Math.round(attempt.score)}%
                    </td>
                    <td className="px-5 py-3.5">
                      {attempt.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" /> Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {quizAttempts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No quizzes attempted yet. Enroll in a course and complete your first milestone.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course overview */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-bold font-display text-base">Course progress</h2>
          </div>
          <div className="divide-y divide-border/50">
            {enrollments.map((e) => (
              <div key={e.id} className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {e.status === "COMPLETED" ? (
                    <Award className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-primary/70" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm line-clamp-1 mb-1.5">{e.course.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${e.status === "COMPLETED" ? "bg-emerald-500" : "gradient-bg"}`}
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums font-semibold w-9 text-right">
                      {Math.round(e.progress)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {enrollments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No courses enrolled yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
