"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface InternshipApplyButtonProps {
  internshipId: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function InternshipApplyButton({ internshipId, className, size = "default" }: InternshipApplyButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (status === "unauthenticated") {
      toast.error("Please login to apply for internships.");
      router.push(`/login?callbackUrl=/internships/${internshipId}`);
      return;
    }

    setLoading(true);
    
    // Simulate API call for MVP
    setTimeout(() => {
      setLoading(false);
      setApplied(true);
      toast.success("Application submitted successfully! Check your email.");
      // Optional: router.push("/dashboard/student/internships");
    }, 1500);
  };

  if (applied) {
    return (
      <Button 
        className={\`\${className} bg-emerald-500 hover:bg-emerald-600\`}
        size={size}
        disabled
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Applied
      </Button>
    );
  }

  return (
    <Button 
      className={className} 
      size={size}
      onClick={handleApply}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Submitting..." : "Apply Now"}
    </Button>
  );
}
