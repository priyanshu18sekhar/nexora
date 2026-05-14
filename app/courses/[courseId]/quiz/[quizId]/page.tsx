import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { QuizPlayer } from "@/src/components/courses/quiz-player";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await params;
  const session = await auth();

  // Fetch quiz with questions
  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!quiz) redirect(`/courses/${courseId}/learn`);

  // Map to QuizPlayer expected type
  const questions = quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options as string[],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/courses/${courseId}/learn`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground mb-2">
            Passing Score: {quiz.passingScore}%
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
