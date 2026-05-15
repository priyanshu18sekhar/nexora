import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/src/components/courses/video-player";
import {
  CheckCircle, PlayCircle, HelpCircle, ChevronLeft, ChevronRight,
  BookOpen, Sparkles, Trophy, Lock,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export default async function CourseLearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lessonId?: string }>;
}) {
  const { courseId } = await params;
  const { lessonId } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (!enrollment) redirect(`/courses/${courseId}`);

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" }, include: { quiz: true } },
        },
      },
    },
  });
  if (!course) redirect("/courses");

  const progress = await db.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lessonId: { in: course.sections.flatMap((s) => s.lessons.map((l) => l.id)) },
      isCompleted: true,
    },
  });
  const completedLessonIds = new Set(progress.map((p) => p.lessonId));

  const allLessons = course.sections.flatMap((s) => s.lessons);
  let activeLesson = allLessons[0];
  if (lessonId) {
    const requested = allLessons.find((l) => l.id === lessonId);
    if (requested) activeLesson = requested;
  } else {
    const firstUncompleted = allLessons.find((l) => !completedLessonIds.has(l.id));
    if (firstUncompleted) activeLesson = firstUncompleted;
  }
  if (!activeLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No lessons available yet for this course.</p>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isCompleted = completedLessonIds.has(activeLesson.id);
  const completedCount = completedLessonIds.size;
  const totalLessons = allLessons.length;
  const courseProgress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border bg-card overflow-y-auto hidden md:flex flex-col custom-scrollbar">
        <div className="p-5 border-b border-border bg-gradient-to-br from-primary/8 via-card to-card sticky top-0 backdrop-blur-md z-10">
          <Link
            href={`/courses/${courseId}`}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to course
          </Link>
          <h2 className="font-bold font-display text-base line-clamp-2 mb-3">{course.title}</h2>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium">
              {completedCount} / {totalLessons} lessons
            </span>
            <span className="font-bold text-primary tabular-nums">{courseProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full gradient-bg transition-all duration-500"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>

        <nav className="p-3 space-y-5 flex-1">
          {course.sections.map((section, sIdx) => {
            const sectionLessons = section.lessons;
            const sectionCompleted = sectionLessons.filter((l) => completedLessonIds.has(l.id)).length;
            return (
              <div key={section.id}>
                <div className="flex items-center justify-between px-2 pb-2">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    Section {sIdx + 1} · {section.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground tabular-nums font-semibold">
                    {sectionCompleted}/{sectionLessons.length}
                  </span>
                </div>
                <ul className="space-y-0.5">
                  {sectionLessons.map((lesson) => {
                    const lessonCompleted = completedLessonIds.has(lesson.id);
                    const isActive = lesson.id === activeLesson.id;
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/courses/${courseId}/learn?lessonId=${lesson.id}`}
                          className={cn(
                            "flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors group",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-muted text-foreground/75 hover:text-foreground"
                          )}
                        >
                          <span className="flex-shrink-0 mt-0.5">
                            {lessonCompleted ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : isActive ? (
                              <PlayCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70" />
                            )}
                          </span>
                          <span className="line-clamp-2 leading-tight flex-1">
                            {lesson.title}
                          </span>
                          {lesson.quiz && (
                            <HelpCircle className="w-3.5 h-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {courseProgress === 100 && (
          <div className="p-4 border-t border-border bg-emerald-500/5">
            <div className="rounded-xl border border-emerald-500/20 bg-card p-3">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs font-semibold">Course complete!</p>
                  <Link href="/dashboard/student/certificates" className="text-[11px] text-primary hover:underline">
                    Get your certificate →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={`/courses/${courseId}`} className="hover:text-foreground transition-colors">{course.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground/80">Lesson {currentIndex + 1} of {totalLessons}</span>
          </div>

          {/* Video */}
          {activeLesson.videoUrl ? (
            <VideoPlayer
              lessonId={activeLesson.id}
              videoUrl={activeLesson.videoUrl}
              title={activeLesson.title}
              isCompleted={isCompleted}
              nextLessonId={nextLesson?.id}
              nextQuizId={activeLesson.quiz?.id}
            />
          ) : (
            <div className="aspect-video rounded-2xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center text-muted-foreground">
              <Lock className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">Video coming soon for this lesson.</p>
            </div>
          )}

          {/* Lesson body */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-primary/80 mb-2">
                  <Sparkles className="w-3 h-3" />
                  Lesson {currentIndex + 1}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
                  {activeLesson.title}
                </h1>
              </div>
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20 flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
            </div>

            {activeLesson.description && (
              <p className="text-foreground/75 leading-relaxed">{activeLesson.description}</p>
            )}
          </div>

          {/* Quiz CTA */}
          {activeLesson.quiz && (
            <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 text-white">
              <div className="absolute inset-0 bg-dot-pattern opacity-15" />
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15 blur-3xl" />
              <div className="relative flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-white/75 mb-1">Milestone</p>
                    <h3 className="font-bold font-display text-lg">Test your knowledge</h3>
                    <p className="text-sm text-white/80 mt-0.5">
                      Pass the MCQ assessment to complete this section.
                    </p>
                  </div>
                </div>
                <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl rounded-xl flex-shrink-0">
                  <Link href={`/courses/${courseId}/quiz/${activeLesson.quiz.id}`}>
                    Start Quiz
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Prev/Next */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-border">
            {prevLesson ? (
              <Button variant="outline" asChild className="rounded-xl">
                <Link href={`/courses/${courseId}/learn?lessonId=${prevLesson.id}`}>
                  <ChevronLeft className="w-4 h-4 mr-1.5" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextLesson && !activeLesson.quiz ? (
              <Button asChild className="gradient-bg text-white rounded-xl shadow-brand">
                <Link href={`/courses/${courseId}/learn?lessonId=${nextLesson.id}`}>
                  Next lesson
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            ) : !nextLesson && !activeLesson.quiz ? (
              <Button asChild className="gradient-bg text-white rounded-xl shadow-brand">
                <Link href="/dashboard/student/certificates">
                  <Trophy className="w-4 h-4 mr-1.5" />
                  Claim certificate
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Mobile sidebar trigger area for next lesson */}
        <div className="md:hidden p-4 border-t border-border bg-card">
          <Link
            href={`/courses/${courseId}`}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3 h-3" />
            View all lessons
          </Link>
        </div>
      </main>
    </div>
  );
}
