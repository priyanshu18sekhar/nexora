import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { quizId } = await params;
    const body = await req.json();
    const { answers, score, passed, courseId } = body;

    // Verify quiz exists
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { lesson: { include: { section: true } } },
    });

    if (!quiz) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Record the attempt
    await db.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        answers,
        score,
        passed,
      },
    });

    let certificateGenerated = false;

    if (passed) {
      // Mark the lesson associated with this quiz as completed
      await db.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: quiz.lessonId,
          },
        },
        update: { isCompleted: true },
        create: {
          userId: session.user.id,
          lessonId: quiz.lessonId,
          isCompleted: true,
        },
      });

      // Update course progress
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          sections: { include: { lessons: true } },
        },
      });

      if (course) {
        const allLessons = course.sections.flatMap((s) => s.lessons);
        const totalLessons = allLessons.length;
        
        const completedLessonsCount = await db.lessonProgress.count({
          where: {
            userId: session.user.id,
            lessonId: { in: allLessons.map((l) => l.id) },
            isCompleted: true,
          },
        });

        const progressPercentage = (completedLessonsCount / totalLessons) * 100;
        const isCompleted = progressPercentage === 100;

        await db.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId,
            },
          },
          data: {
            progress: progressPercentage,
            status: isCompleted ? "COMPLETED" : "ACTIVE",
            completedAt: isCompleted ? new Date() : null,
          },
        });

        // Generate certificate if course is fully completed
        if (isCompleted) {
          const existingCert = await db.certificate.findUnique({
            where: {
              userId_courseId: {
                userId: session.user.id,
                courseId,
              },
            },
          });

          if (!existingCert) {
            // Get average quiz score for the course
            const courseQuizzes = await db.quiz.findMany({
              where: { lesson: { section: { courseId } } },
              select: { id: true },
            });

            let finalScore = score;
            if (courseQuizzes.length > 0) {
              const attempts = await db.quizAttempt.findMany({
                where: {
                  userId: session.user.id,
                  quizId: { in: courseQuizzes.map((q) => q.id) },
                },
                orderBy: { attemptedAt: "desc" },
                distinct: ["quizId"],
              });
              if (attempts.length > 0) {
                const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
                finalScore = totalScore / attempts.length;
              }
            }

            // Free courses → cert is PENDING until user pays the certificate fee.
            // Paid courses → cert is ISSUED immediately (already paid for enrollment).
            const issueNow = !course.isFree;
            await db.certificate.create({
              data: {
                userId: session.user.id,
                courseId,
                status: issueNow ? "ISSUED" : "PENDING",
                issuedAt: issueNow ? new Date() : null,
                score: finalScore,
              },
            });
            certificateGenerated = issueNow;
          }
        }
      }
    }

    return NextResponse.json({ success: true, certificateGenerated });
  } catch (error) {
    console.error("[QUIZ_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
