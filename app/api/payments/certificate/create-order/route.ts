import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import Razorpay from "razorpay";

const CERTIFICATE_FEE_INR = 299;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { certificateId } = await req.json();
  if (!certificateId) {
    return NextResponse.json({ error: "certificateId required" }, { status: 400 });
  }

  const cert = await db.certificate.findUnique({
    where: { id: certificateId },
    include: { course: { select: { title: true } } },
  });
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  if (cert.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (cert.status === "ISSUED") {
    return NextResponse.json({ error: "Certificate already issued" }, { status: 409 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const amountInPaise = CERTIFICATE_FEE_INR * 100;
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `cert_${certificateId.slice(0, 12)}_${Date.now()}`,
    notes: { certificateId, userId: session.user.id! },
  });

  await db.payment.create({
    data: {
      userId: session.user.id!,
      amount: CERTIFICATE_FEE_INR,
      currency: "INR",
      status: "PENDING",
      provider: "razorpay",
      providerOrderId: order.id,
      courseId: cert.courseId,
      metadata: { certificateId, type: "certificate" },
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    feeInr: CERTIFICATE_FEE_INR,
    courseTitle: cert.course.title,
  });
}
