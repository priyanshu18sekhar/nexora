import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { lessonId } = await params;

    // Verify lesson exists
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });

    if (!lesson) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Verify user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.section.courseId,
        },
      },
    });

    if (!enrollment) {
      return new NextResponse("Not Enrolled", { status: 403 });
    }

    // Mark as completed or update if exists
    await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        userId: session.user.id,
        lessonId,
        isCompleted: true,
      },
    });

    // Update course progress calculation
    const course = await db.course.findUnique({
      where: { id: lesson.section.courseId },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (course) {
      const allLessons = course.sections.flatMap(s => s.lessons);
      const totalLessons = allLessons.length;
      
      const completedLessons = await db.lessonProgress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: allLessons.map(l => l.id) },
          isCompleted: true,
        },
      });

      const progressPercentage = (completedLessons / totalLessons) * 100;

      await db.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: progressPercentage,
          status: progressPercentage === 100 ? "COMPLETED" : "ACTIVE",
          completedAt: progressPercentage === 100 ? new Date() : null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LESSON_COMPLETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
