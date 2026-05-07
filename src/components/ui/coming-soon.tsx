import React from "react";
import Link from "next/link";
import { Hammer, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface ComingSoonProps {
  title?: string;
  description?: string;
  backLink?: string;
}

export function ComingSoon({
  title = "Under Construction",
  description = "We are working hard to bring you this feature. Stay tuned!",
  backLink,
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Hammer className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground max-w-md mb-8">{description}</p>
      
      {backLink ? (
        <Button asChild>
          <Link href={backLink}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </Button>
      )}
    </div>
  );
}
