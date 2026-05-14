import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { Video, Plus, Users, Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { formatDate } from "@/src/lib/utils";

export default async function AdminLiveClassesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const classes = await db.liveClass.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      _count: { select: { enrollments: true } }
    }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Live Classes</h1>
          <p className="text-muted-foreground mt-1">Manage and schedule live sessions for students.</p>
        </div>
        <Button asChild className="gradient-bg text-white shadow-brand">
          <Link href="/dashboard/admin/live-classes/new">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Class
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-5 border-b border-border/50 bg-muted/10">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={
                    cls.status === "LIVE" ? "destructive" : 
                    cls.status === "SCHEDULED" ? "default" : 
                    "secondary"
                  } className={cls.status === "LIVE" ? "animate-pulse" : ""}>
                    {cls.status}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border border-border/50">
                    <Users className="w-3 h-3 mr-1" />
                    {cls._count.enrollments} Enrolled
                  </div>
                </div>
                <h3 className="font-semibold text-lg line-clamp-2">{cls.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cls.description}</p>
              </div>
              
              <div className="p-5 space-y-4">
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

                <div className="pt-4 border-t border-border/50 flex gap-2">
                  {cls.meetLink && (cls.status === "SCHEDULED" || cls.status === "LIVE") && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 mr-2" />
                        Join Meeting
                      </a>
                    </Button>
                  )}
                  {cls.recordingUrl && cls.status === "COMPLETED" && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={cls.recordingUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Recording
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="ghost" className="flex-1">
                    <Link href={`/dashboard/admin/live-classes/${cls.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {classes.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No Live Classes</h3>
            <p className="text-muted-foreground mb-4">Schedule your first live class to engage with students.</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/admin/live-classes/new">Schedule Class</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
