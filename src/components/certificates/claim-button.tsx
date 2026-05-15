"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Loader2, Lock, IndianRupee, Award } from "lucide-react";

const CERTIFICATE_FEE_INR = 299;

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

interface ClaimCertificateButtonProps {
  certificateId: string;
  courseTitle?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function ClaimCertificateButton({
  certificateId,
  courseTitle,
  className,
  size = "default",
}: ClaimCertificateButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load payment gateway. Check your connection.");
        setLoading(false);
        return;
      }

      const orderRes = await fetch("/api/payments/certificate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nexora",
        description: `Certificate — ${courseTitle || orderData.courseTitle || "Course completion"}`,
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/certificate/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              certificateId,
            }),
          });
          if (!verifyRes.ok) {
            toast.error("Payment verification failed. Contact support if amount was deducted.");
            return;
          }
          toast.success("Certificate issued! 🎉");
          router.refresh();
        },
        prefill: {
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
        },
        theme: { color: "#6366F1" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  };

  return (
    <Button
      className={className || "gradient-bg text-white shadow-brand rounded-xl"}
      size={size}
      onClick={handleClaim}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <Award className="mr-1.5 h-4 w-4" />
      )}
      <span className="flex items-center">
        Claim for
        <IndianRupee className="mx-0.5 w-3.5 h-3.5" />
        {CERTIFICATE_FEE_INR}
      </span>
    </Button>
  );
}
