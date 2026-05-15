import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import Razorpay from "razorpay";

const INTERNSHIP_PROGRAM_FEE_INR = 499;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { internshipId } = await req.json();
  if (!internshipId) {
    return NextResponse.json({ error: "internshipId required" }, { status: 400 });
  }

  const internship = await db.internship.findUnique({ where: { id: internshipId } });
  if (!internship) {
    return NextResponse.json({ error: "Internship not found" }, { status: 404 });
  }
  if (internship.status !== "OPEN") {
    return NextResponse.json({ error: "Applications closed" }, { status: 409 });
  }

  const existing = await db.internshipApplication.findUnique({
    where: { userId_internshipId: { userId: session.user.id!, internshipId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const amountInPaise = INTERNSHIP_PROGRAM_FEE_INR * 100;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `int_${internshipId.slice(0, 12)}_${Date.now()}`,
    notes: { internshipId, userId: session.user.id! },
  });

  await db.payment.create({
    data: {
      userId: session.user.id!,
      amount: INTERNSHIP_PROGRAM_FEE_INR,
      currency: "INR",
      status: "PENDING",
      provider: "razorpay",
      providerOrderId: order.id,
      internshipId,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    feeInr: INTERNSHIP_PROGRAM_FEE_INR,
  });
}
