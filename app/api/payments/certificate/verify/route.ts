import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, certificateId } = await req.json();
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !certificateId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const cert = await db.certificate.findUnique({ where: { id: certificateId } });
  if (!cert || cert.userId !== session.user.id) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  await db.payment.updateMany({
    where: { providerOrderId: razorpay_order_id, userId: session.user.id! },
    data: { status: "COMPLETED", providerTxnId: razorpay_payment_id },
  });

  const issued = await db.certificate.update({
    where: { id: certificateId },
    data: { status: "ISSUED", issuedAt: new Date() },
  });

  return NextResponse.json({ success: true, certificateId: issued.id });
}
