import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { Video, Calendar, Clock, ExternalLink, Play, CheckCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { formatDate } from "@/src/lib/utils";

export default async function StudentLiveClassesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") redirect("/login");

  // Fetch all classes and student's enrollments
  const [allClasses, enrollments] = await Promise.all([
    db.liveClass.findMany({
      orderBy: { scheduledAt: "desc" },
    }),
    db.liveClassEnrollment.findMany({
      where: { userId: session.user.id }
    })
  ]);

  const enrolledClassIds = new Set(enrollments.map(e => e.liveClassId));

  // Partition into upcoming and past
  const now = new Date();
  const upcomingClasses = allClasses.filter(c => new Date(c.scheduledAt) > now || c.status === "LIVE");
  const pastClasses = allClasses.filter(c => new Date(c.scheduledAt) <= now && c.status !== "LIVE");

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Live Classes</h1>
        <p className="text-muted-foreground mt-1">Join interactive sessions and view past recordings.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Upcoming Sessions
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingClasses.map((cls) => {
            const isEnrolled = enrolledClassIds.has(cls.id);
            return (
              <Card key={cls.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <CardContent className="p-0 flex flex-col flex-1">
                  <div className="p-5 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant={cls.status === "LIVE" ? "destructive" : "default"} className={cls.status === "LIVE" ? "animate-pulse" : ""}>
                        {cls.status}
                      </Badge>
                      {isEnrolled && (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-2">{cls.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cls.description}</p>
                  </div>
                  
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium text-foreground">{formatDate(cls.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(cls.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {cls.duration} mins</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 mt-auto">
                      {isEnrolled ? (
                        <Button 
                          asChild 
                          variant={cls.status === "LIVE" ? "default" : "outline"} 
                          className={`w-full ${cls.status === "LIVE" ? "bg-rose-500 hover:bg-rose-600 text-white" : ""}`}
                          disabled={!cls.meetLink}
                        >
                          <a href={cls.meetLink || "#"} target="_blank" rel="noopener noreferrer">
                            <Video className="w-4 h-4 mr-2" />
                            {cls.status === "LIVE" ? "Join Now" : "Meeting Link"}
                          </a>
                        </Button>
                      ) : (
                        <form action={`/api/live-classes/${cls.id}/enroll`} method="POST">
                          <Button type="submit" className="w-full gradient-bg text-white shadow-brand">
                            Enroll Now
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {upcomingClasses.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Upcoming Classes</h3>
              <p className="text-muted-foreground">Check back later for new scheduled sessions.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" /> Past Recordings
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastClasses.map((cls) => (
            <Card key={cls.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-5 border-b border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <h3 className="font-semibold line-clamp-1">{cls.title}</h3>
                  <div className="text-xs text-muted-foreground mt-2">
                    {formatDate(cls.scheduledAt)}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/10">
                  <Button asChild variant="outline" className="w-full" disabled={!cls.recordingUrl}>
                    <a href={cls.recordingUrl || "#"} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {cls.recordingUrl ? "Watch Recording" : "Recording Unavailable"}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {pastClasses.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No past classes available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
