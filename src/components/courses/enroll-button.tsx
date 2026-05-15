"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Loader2, Lock, BookOpen } from "lucide-react";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
  isFree: boolean;
  courseName?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CourseEnrollButton({ courseId, price, isFree, courseName }: CourseEnrollButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFreeEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");
      toast.success("Enrolled! Let's start learning.");
      router.push(`/courses/${courseId}/learn`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePaidEnroll = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load payment gateway. Check your connection.");
        setLoading(false);
        return;
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nexora",
        description: courseName || "Course Enrollment",
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            toast.error("Payment verification failed. Contact support if amount was deducted.");
            return;
          }
          toast.success("Payment successful! Enjoy the course.");
          router.push(`/courses/${courseId}/learn`);
        },
        prefill: {
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
        },
        theme: { color: "#6366F1" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to enroll.");
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }
    if (isFree || price === 0) {
      await handleFreeEnroll();
    } else {
      await handlePaidEnroll();
    }
  };

  return (
    <Button
      className="w-full h-12 text-base font-semibold gradient-bg text-white shadow-brand hover:opacity-90 transition-opacity rounded-xl"
      size="lg"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isFree || price === 0 ? (
        <BookOpen className="mr-2 h-4 w-4" />
      ) : (
        <Lock className="mr-2 h-4 w-4" />
      )}
      {loading
        ? "Processing…"
        : isFree || price === 0
        ? "Enroll for Free"
        : "Pay & Enroll"}
    </Button>
  );
}
