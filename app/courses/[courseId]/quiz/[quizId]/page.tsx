import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { QuizPlayer } from "@/src/components/courses/quiz-player";
import { ArrowLeft, HelpCircle, Clock, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await params;
  await auth();

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) redirect(`/courses/${courseId}/learn`);

  const questions = quiz.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options as string[],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));

  return (
    <div className="min-h-screen pt-20 pb-12 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div>
          <Link
            href={`/courses/${courseId}/learn`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to lesson
          </Link>

          <div className="relative overflow-hidden rounded-3xl gradient-bg-hero p-6 sm:p-8 text-white">
            <div className="absolute inset-0 bg-dot-pattern opacity-15" />
            <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-12 left-1/4 w-48 h-48 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-white/75 text-xs uppercase tracking-wider font-semibold mb-2">
                  <Sparkles className="w-3 h-3" />
                  Milestone assessment
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-3">{quiz.title}</h1>
                {quiz.description && (
                  <p className="text-white/85 text-sm leading-relaxed max-w-lg mb-4">{quiz.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/15">
                    <Trophy className="w-3 h-3" />
                    Pass at {quiz.passingScore}%
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/15">
                    {questions.length} question{questions.length === 1 ? "" : "s"}
                  </span>
                  {quiz.timeLimit && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/15">
                      <Clock className="w-3 h-3" />
                      {quiz.timeLimit} min limit
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <QuizPlayer
          quizId={quiz.id}
          title={quiz.title}
          questions={questions}
          passingScore={quiz.passingScore}
          courseId={courseId}
        />
      </div>
    </div>
  );
}
