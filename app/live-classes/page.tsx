import { db } from "@/src/lib/db";
import { Video, Calendar, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/src/lib/utils";
import { Aurora } from "@/src/components/effects/aurora";
import { AnimatedGrid } from "@/src/components/effects/animated-grid";

export const metadata = {
  title: "Live Classes | Nexora",
  description: "Join interactive live sessions with expert instructors.",
};

export default async function LiveClassesPage() {
  const classes = await db.liveClass.findMany({
    where: {
      status: { in: ["SCHEDULED", "LIVE"] },
      scheduledAt: { gte: new Date() },
    },
    orderBy: { scheduledAt: "asc" },
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <Aurora className="opacity-60" />
        <AnimatedGrid />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs font-semibold tracking-wide mb-5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              Live Interactive Learning
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 leading-[1.05]">
              Live classes with <span className="gradient-text-hero">expert mentors</span>
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Interact in real-time, ask questions, and learn from working professionals at India&apos;s top companies.
            </p>
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {classes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((cls) => (
                <article
                  key={cls.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" />

                  <div className="relative p-5 border-b border-border/60">
                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        variant={cls.status === "LIVE" ? "destructive" : "secondary"}
                        className={cls.status === "LIVE" ? "animate-pulse uppercase tracking-wider" : "uppercase tracking-wider"}
                      >
                        {cls.status === "LIVE" ? "● Live" : "Upcoming"}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-full bg-muted border border-border/50">
                        <Users className="w-3 h-3 mr-1.5" />
                        {cls._count.enrollments} enrolled
                      </div>
                    </div>
                    <h3 className="text-lg font-bold font-display line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-2">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{cls.description}</p>
                  </div>

                  <div className="relative p-5 space-y-4">
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-3 text-foreground/75">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium">{formatDate(cls.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/75">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium">
                          {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          <span className="text-muted-foreground"> · {cls.duration} mins</span>
                        </span>
                      </div>
                    </div>

                    <Button asChild className="w-full gradient-bg text-white shadow-brand rounded-xl">
                      <Link href="/dashboard/student/live-classes">
                        Reserve your spot
                        <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-16 text-center rounded-3xl border-2 border-dashed border-border bg-card/40">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Video className="w-9 h-9 text-primary/80" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-2">No upcoming live classes</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our instructors are preparing new exciting sessions. In the meantime, our on-demand catalog has 200+ premium courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="gradient-bg text-white rounded-xl">
                  <Link href="/courses">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse on-demand courses
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
