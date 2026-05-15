import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, internshipId, coverLetter } =
    await req.json();

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !internshipId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  await db.payment.updateMany({
    where: { providerOrderId: razorpay_order_id, userId: session.user.id! },
    data: { status: "COMPLETED", providerTxnId: razorpay_payment_id },
  });

  const application = await db.internshipApplication.upsert({
    where: { userId_internshipId: { userId: session.user.id!, internshipId } },
    create: {
      userId: session.user.id!,
      internshipId,
      status: "PENDING",
      coverLetter: typeof coverLetter === "string" ? coverLetter : null,
    },
    update: { status: "PENDING" },
  });

  return NextResponse.json({ success: true, applicationId: application.id });
}
