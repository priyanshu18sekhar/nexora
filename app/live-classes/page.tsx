import { db } from "@/src/lib/db";
import { Navbar } from "@/src/components/layout/navbar";
import { Footer } from "@/src/components/layout/footer";
import { Card, CardContent } from "@/src/components/ui/card";
import { Video, Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/src/lib/utils";

export const metadata = {
  title: "Live Classes | Nexora",
  description: "Join interactive live sessions with expert instructors.",
};

export default async function LiveClassesPage() {
  const classes = await db.liveClass.findMany({
    where: { 
      status: { in: ["SCHEDULED", "LIVE"] },
      scheduledAt: { gte: new Date() }
    },
    orderBy: { scheduledAt: "asc" },
    include: {
      _count: { select: { enrollments: true } }
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 px-3 py-1 text-sm font-medium">
              <Video className="w-4 h-4 mr-2 inline-block" /> Live Interactive Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4">
              Master New Skills with <span className="text-transparent bg-clip-text gradient-bg">Expert Instructors</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our live masterclasses to interact directly with industry professionals, ask questions in real-time, and accelerate your career growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} className="overflow-hidden hover:shadow-xl transition-all group border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0 flex flex-col h-full relative">
                  {/* Decorative blur blob */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-colors" />
                  
                  <div className="p-6 border-b border-border/50">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={cls.status === "LIVE" ? "destructive" : "default"} className={cls.status === "LIVE" ? "animate-pulse" : ""}>
                        {cls.status}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground font-medium bg-background px-2 py-1 rounded-full border border-border/50">
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        {cls._count.enrollments} Enrolled
                      </div>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">{cls.title}</h3>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{cls.description}</p>
                  </div>
                  
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-end">
                    <div className="space-y-3 text-sm font-medium">
                      <div className="flex items-center gap-3 text-foreground/80">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        {formatDate(cls.scheduledAt)}
                      </div>
                      <div className="flex items-center gap-3 text-foreground/80">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        {new Date(cls.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({cls.duration} mins)
                      </div>
                    </div>

                    <Button asChild className="w-full mt-4 group/btn overflow-hidden relative">
                      <Link href="/dashboard/student/live-classes">
                        <span className="relative z-10 flex items-center">
                          Reserve Your Spot
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {classes.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl bg-muted/5">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Upcoming Classes</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Our instructors are preparing new exciting sessions. Check back soon for our upcoming live class schedule.
                </p>
                <Button asChild variant="outline">
                  <Link href="/courses">Explore Video Courses Instead</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
