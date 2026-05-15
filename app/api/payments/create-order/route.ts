import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import Razorpay from "razorpay";

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

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id!, courseId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const amountInPaise = Math.round(course.price * 100);

  let order: Awaited<ReturnType<typeof razorpay.orders.create>>;
  try {
    order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `course_${courseId}_${Date.now()}`.substring(0, 40),
      notes: { courseId, userId: session.user.id! },
    });
  } catch (rzpErr: unknown) {
    const msg =
      typeof rzpErr === "object" && rzpErr !== null
        ? JSON.stringify(rzpErr)
        : String(rzpErr);
    console.error("Razorpay order creation failed:", msg);
    return NextResponse.json({ error: "Payment gateway error", detail: msg }, { status: 502 });
  }

  await db.payment.create({
    data: {
      userId: session.user.id!,
      amount: course.price,
      currency: "INR",
      status: "PENDING",
      provider: "razorpay",
      providerOrderId: order.id,
      courseId,
    },
  });

  return NextResponse.json({ orderId: order.id, amount: amountInPaise, currency: "INR" });
}
