"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle, Lock, IndianRupee } from "lucide-react";

const INTERNSHIP_PROGRAM_FEE_INR = 499;

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

interface InternshipApplyButtonProps {
  internshipId: string;
  internshipTitle?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function InternshipApplyButton({
  internshipId,
  internshipTitle,
  className,
  size = "default",
}: InternshipApplyButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to apply.");
      router.push(`/login?callbackUrl=/internships/${internshipId}`);
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load payment gateway. Check your connection.");
        setLoading(false);
        return;
      }

      const orderRes = await fetch("/api/payments/internship/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nexora",
        description: `Internship program fee — ${internshipTitle || "Application"}`,
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/internship/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              internshipId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            toast.error("Payment verification failed. Contact support if amount was deducted.");
            return;
          }
          toast.success("Application submitted! Track it in your dashboard.");
          setApplied(true);
          router.push("/dashboard/student/internships");
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
      toast.error(err instanceof Error ? err.message : "Application failed");
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <Button className={`${className} bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl`} size={size} disabled>
        <CheckCircle className="mr-1.5 h-4 w-4" />
        Applied
      </Button>
    );
  }

  return (
    <Button
      className={className || "gradient-bg text-white shadow-brand rounded-xl"}
      size={size}
      onClick={handleApply}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <Lock className="mr-1.5 h-3.5 w-3.5" />
      )}
      <span className="flex items-center">
        Pay
        <IndianRupee className="mx-0.5 w-3.5 h-3.5" />
        {INTERNSHIP_PROGRAM_FEE_INR} & Apply
      </span>
    </Button>
  );
}
