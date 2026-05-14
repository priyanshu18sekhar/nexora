"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ChevronRight, Loader2, Award } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string | null;
}

interface QuizPlayerProps {
  quizId: string;
  title: string;
  questions: Question[];
  passingScore: number;
  courseId: string;
}

export function QuizPlayer({ quizId, title, questions, passingScore, courseId }: QuizPlayerProps) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const question = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const isAnswered = answers[question.id] !== undefined;

  const handleSelect = (idx: number) => {
    if (isAnswered) return; // Prevent changing answer after selection
    setAnswers({ ...answers, [question.id]: idx });
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIdx(currentIdx + 1);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) return;
    
    setIsSubmitting(true);
    
    // Calculate local score
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passingScore;

    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, score, passed, courseId }),
      });
      
      if (!res.ok) throw new Error("Failed to submit quiz");
      
      const data = await res.json();
      setResult({ score, passed });
      
      if (passed) {
        toast.success(`You passed with ${score}%!`);
        if (data.certificateGenerated) {
          toast.success("Course complete! Certificate generated.", { duration: 5000 });
        }
      } else {
        toast.error(`You scored ${score}%. Minimum passing is ${passingScore}%.`);
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
  };

  if (result) {
    return (
      <Card className="max-w-2xl mx-auto overflow-hidden border-border/50 shadow-xl">
        <div className={cn(
          "h-32 flex flex-col items-center justify-center text-white",
          result.passed ? "bg-emerald-500" : "bg-rose-500"
        )}>
          {result.passed ? (
            <Award className="w-16 h-16 mb-2 text-white/90" />
          ) : (
            <XCircle className="w-16 h-16 mb-2 text-white/90" />
          )}
        </div>
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold font-display mb-2">
            {result.passed ? "Congratulations!" : "Keep Trying!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            You scored <span className={cn("font-bold", result.passed ? "text-emerald-500" : "text-rose-500")}>{result.score}%</span>. 
            Passing score is {passingScore}%.
          </p>
          
          <div className="flex gap-4 justify-center">
            {result.passed ? (
              <Button asChild className="gradient-bg text-white shadow-brand">
                <a href={`/dashboard/student/courses`}>Back to Dashboard</a>
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={resetQuiz}>
                  Retry Quiz
                </Button>
                <Button asChild variant="default">
                  <a href={`/courses/${courseId}/learn`}>Review Material</a>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-display tracking-tight">{title}</h2>
        <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Question {currentIdx + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out" 
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="border-border/50 shadow-md">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const isSelected = answers[question.id] === i;
              const showResult = isAnswered;
              const isCorrect = showResult && i === question.correctIndex;
              const isWrong = showResult && isSelected && i !== question.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                    !isAnswered && "hover:border-primary hover:bg-primary/5",
                    isSelected && !showResult && "border-primary bg-primary/10 ring-1 ring-primary",
                    isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    isWrong && "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400",
                    !isSelected && !isCorrect && showResult && "opacity-50 border-border bg-muted/30"
                  )}
                >
                  <span className="font-medium">{opt}</span>
                  {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && question.explanation && (
            <div className={cn(
              "mt-6 p-4 rounded-xl text-sm",
              answers[question.id] === question.correctIndex 
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "bg-muted text-foreground/80"
            )}>
              <span className="font-bold block mb-1">
                {answers[question.id] === question.correctIndex ? "Correct!" : "Incorrect."}
              </span>
              {question.explanation}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex justify-end">
            {isAnswered && !isLastQuestion && (
              <Button onClick={handleNext} className="group">
                Next Question
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            
            {isAnswered && isLastQuestion && (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="gradient-bg text-white shadow-brand min-w-[140px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Submit Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
