import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { classId } = await params;

    const liveClass = await db.liveClass.findUnique({
      where: { id: classId }
    });

    if (!liveClass || liveClass.status !== "SCHEDULED") {
      return new NextResponse("Class not available", { status: 400 });
    }

    await db.liveClassEnrollment.create({
      data: {
        userId: session.user.id,
        liveClassId: classId,
      }
    });

    // redirect to the same page to show enrolled status
    return NextResponse.redirect(new URL('/dashboard/student/live-classes', req.url));
  } catch (error) {
    console.error("[LIVE_CLASS_ENROLL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
