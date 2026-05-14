import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/src/components/courses/video-player";
import { CheckCircle, PlayCircle, Lock, LayoutList, HelpCircle } from "lucide-react";
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

  // Verify enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses/${courseId}`); // redirect to course landing page if not enrolled
  }

  // Fetch course with sections, lessons, quizzes, and progress
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              quiz: true,
            },
          },
        },
      },
    },
  });

  if (!course) redirect("/courses");

  // Get user progress
  const progress = await db.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lessonId: {
        in: course.sections.flatMap((s) => s.lessons.map((l) => l.id)),
      },
      isCompleted: true,
    },
  });

  const completedLessonIds = new Set(progress.map((p) => p.lessonId));

  // Determine active lesson
  const allLessons = course.sections.flatMap((s) => s.lessons);
  let activeLesson = allLessons[0];

  if (lessonId) {
    const requestedLesson = allLessons.find((l) => l.id === lessonId);
    if (requestedLesson) activeLesson = requestedLesson;
  } else {
    // Find first uncompleted lesson
    const firstUncompleted = allLessons.find((l) => !completedLessonIds.has(l.id));
    if (firstUncompleted) activeLesson = firstUncompleted;
  }

  if (!activeLesson) return <div>No lessons available.</div>;

  // Find next items for navigation logic (simplified for now)
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] pt-16 overflow-hidden">
      {/* Sidebar - Lesson Tree */}
      <aside className="w-80 border-r border-border bg-card overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {Math.round(enrollment.progress)}% Complete
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${enrollment.progress}%` }} 
            />
          </div>
        </div>

        <div className="p-2 space-y-4">
          {course.sections.map((section, sIdx) => (
            <div key={section.id}>
              <h3 className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Section {sIdx + 1}: {section.title}
              </h3>
              <ul className="mt-1 space-y-0.5">
                {section.lessons.map((lesson, lIdx) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  const isActive = lesson.id === activeLesson.id;

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${courseId}/learn?lessonId=${lesson.id}`}
                        className={cn(
                          "flex items-start gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-muted text-foreground/80"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className="line-clamp-2 leading-tight">
                          {lesson.order}. {lesson.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          {activeLesson.videoUrl && (
            <VideoPlayer
              lessonId={activeLesson.id}
              videoUrl={activeLesson.videoUrl}
              title={activeLesson.title}
              isCompleted={completedLessonIds.has(activeLesson.id)}
              nextLessonId={nextLesson?.id}
              nextQuizId={activeLesson.quiz?.id}
            />
          )}

          <div className="mt-8 space-y-6">
            <h1 className="text-2xl font-bold">{activeLesson.title}</h1>
            
            {activeLesson.description && (
              <div className="prose dark:prose-invert max-w-none">
                <p>{activeLesson.description}</p>
              </div>
            )}

            {/* Quiz CTA if lesson has an associated quiz */}
            {activeLesson.quiz && (
              <div className="p-6 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Test Your Knowledge</h3>
                    <p className="text-sm text-muted-foreground">
                      Take the quiz to complete this section.
                    </p>
                  </div>
                </div>
                <Button asChild className="gradient-bg text-white">
                  <Link href={`/courses/${courseId}/quiz/${activeLesson.quiz.id}`}>
                    Start Quiz
                  </Link>
                </Button>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
              <div /> {/* Placeholder for previous button */}
              {nextLesson && !activeLesson.quiz && (
                <Button asChild variant="outline">
                  <Link href={`/courses/${courseId}/learn?lessonId=${nextLesson.id}`}>
                    Next Lesson →
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
