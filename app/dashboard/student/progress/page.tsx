import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Flame, BrainCircuit, Target, CheckCircle, XCircle, Award, BookOpen } from "lucide-react";
import { formatDate } from "@/src/lib/utils";

export default async function StudentProgressPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") redirect("/login");

  const [quizAttempts, enrollments] = await Promise.all([
    db.quizAttempt.findMany({
      where: { userId: session.user.id },
      include: {
        quiz: {
          select: { title: true, passingScore: true, lesson: { select: { section: { select: { course: { select: { title: true } } } } } } }
        }
      },
      orderBy: { attemptedAt: "desc" }
    }),
    db.enrollment.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { title: true } } }
    })
  ]);

  const totalAttempts = quizAttempts.length;
  const passedAttempts = quizAttempts.filter(a => a.passed).length;
  const averageScore = totalAttempts > 0 
    ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) 
    : 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">My Progress</h1>
        <p className="text-muted-foreground mt-1">Track your performance and quiz scores.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-indigo-100">Average Score</p>
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-5xl font-bold font-display">{averageScore}%</h2>
            </div>
            <p className="text-indigo-200 text-sm mt-4">Across all your quiz attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
            </div>
            <h3 className="text-3xl font-bold font-display ml-13">
              {totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0}%
            </h3>
            <p className="text-xs text-muted-foreground mt-2 ml-13">
              {passedAttempts} passed out of {totalAttempts} total attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Learning Streak</p>
            </div>
            <h3 className="text-3xl font-bold font-display ml-13">3 Days</h3>
            <p className="text-xs text-muted-foreground mt-2 ml-13">Keep it up! Log in tomorrow to extend.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Quiz Attempts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Quiz</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {quizAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{attempt.quiz.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{attempt.quiz.lesson.section.course.title}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(attempt.attemptedAt)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {attempt.score}%
                      </td>
                      <td className="px-6 py-4">
                        {attempt.passed ? (
                          <span className="flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium w-fit">
                            <CheckCircle className="w-3 h-3 mr-1" /> Passed
                          </span>
                        ) : (
                          <span className="flex items-center text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-1 rounded-full text-xs font-medium w-fit">
                            <XCircle className="w-3 h-3 mr-1" /> Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {quizAttempts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        You haven&apos;t taken any quizzes yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {enrollments.map(e => (
                <div key={e.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 w-2/3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {e.status === "COMPLETED" ? <Award className="w-4 h-4 text-emerald-500" /> : <BookOpen className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <p className="font-medium text-sm line-clamp-2">{e.course.title}</p>
                  </div>
                  <div className="text-right w-1/3">
                    <span className="text-sm font-bold">{Math.round(e.progress)}%</span>
                  </div>
                </div>
              ))}
              {enrollments.length === 0 && (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No courses enrolled.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
