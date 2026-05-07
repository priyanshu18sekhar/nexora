import React from "react";
import { ComingSoon } from "@/src/components/ui/coming-soon";

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <ComingSoon 
        title="Progress" 
        description="This feature is coming soon to the Nexora MVP."
        backLink="/dashboard/student"
      />
    </div>
  );
}
