"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
  isFree: boolean;
}

export function CourseEnrollButton({ courseId, price, isFree }: CourseEnrollButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (status === "unauthenticated") {
      toast.error("Please login to enroll in this course.");
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setLoading(true);
    
    // Simulate API call for MVP
    setTimeout(() => {
      setLoading(false);
      toast.success(isFree ? "Successfully enrolled for free!" : `Payment of $${price} successful!`);
      router.push("/dashboard/student/courses");
    }, 1500);
  };

  return (
    <Button 
      className="w-full text-base h-12 shadow-lg hover:shadow-xl" 
      size="lg"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Processing..." : isFree ? "Enroll for Free" : "Enroll Now"}
    </Button>
  );
}
