import React from "react";
import { ComingSoon } from "@/src/components/ui/coming-soon";

export default function LearnPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="container mx-auto py-10">
      <ComingSoon 
        title="Learning Environment" 
        description="The interactive video player and lesson environment is coming soon to the MVP."
        backLink={\`/courses/\${params.courseId}\`}
      />
    </div>
  );
}
