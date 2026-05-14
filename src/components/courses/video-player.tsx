"use client";

import React, { useState } from "react";
import { CheckCircle, Play, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VideoPlayerProps {
  lessonId: string;
  videoUrl: string;
  title: string;
  isCompleted: boolean;
  nextLessonId?: string;
  nextQuizId?: string;
}

export function VideoPlayer({
  lessonId,
  videoUrl,
  title,
  isCompleted: initialIsCompleted,
  nextLessonId,
  nextQuizId,
}: VideoPlayerProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkComplete = async () => {
    if (isCompleted) return;
    setIsMarking(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark complete");
      
      setIsCompleted(true);
      toast.success("Lesson completed! 🎉");
      router.refresh();
      
      // Auto-navigate to next if available
      if (nextLessonId) {
        // We will handle navigation externally or suggest it
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsMarking(false);
    }
  };

  // Convert watch URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url; // Assume it's already an embed link
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="w-full space-y-4">
      {/* 16:9 Aspect Ratio Container for YouTube */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-border">
        {embedUrl ? (
          <iframe
            src={`${embedUrl}?rel=0&modestbranding=1&controls=1&showinfo=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
            <Play className="w-12 h-12 mb-2 opacity-50" />
            <p>Video unavailable</p>
          </div>
        )}
      </div>

      {/* Controls below video */}
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {isCompleted ? "You have completed this lesson." : "Mark as complete to track your progress."}
          </p>
        </div>
        
        <Button 
          onClick={handleMarkComplete} 
          disabled={isCompleted || isMarking}
          variant={isCompleted ? "outline" : "default"}
          className={isCompleted ? "text-emerald-500 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20" : ""}
        >
          {isMarking ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2 opacity-70" />
          )}
          {isCompleted ? "Completed" : "Mark as Complete"}
        </Button>
      </div>
    </div>
  );
}
