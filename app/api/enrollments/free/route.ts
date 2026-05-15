import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  if (!course.isFree && course.price > 0) {
    return NextResponse.json({ error: "Course is not free" }, { status: 400 });
  }

  const enrollment = await db.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id!, courseId } },
    create: { userId: session.user.id!, courseId, status: "ACTIVE" },
    update: { status: "ACTIVE" },
  });

  return NextResponse.json({ success: true, enrollmentId: enrollment.id });
}
