import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { Plus, Briefcase, MapPin, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

export default async function RecruiterInternshipsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") redirect("/login");

  const internships = await db.internship.findMany({
    where: { recruiterId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } }
    }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">My Internships</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and view applicant counts.</p>
        </div>
        <Button asChild className="gradient-bg text-white shadow-brand">
          <Link href="/dashboard/recruiter/internships/new">
            <Plus className="w-4 h-4 mr-2" />
            Post Internship
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {internships.map((internship) => (
          <Card key={internship.id} className="overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-0 sm:flex items-center justify-between">
              <div className="p-5 sm:w-2/3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    internship.status === "OPEN" ? "success" : 
                    internship.status === "CLOSED" ? "secondary" : 
                    "default"
                  }>
                    {internship.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                    {internship.isRemote ? "Remote" : internship.location}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{internship.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1.5" />
                    {internship.company}
                  </span>
                  {internship.stipend && (
                    <span className="font-medium text-foreground">
                      {internship.currency} {internship.stipend}/mo
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-5 bg-muted/20 sm:w-1/3 flex flex-col sm:items-end justify-center border-t sm:border-t-0 sm:border-l border-border/50 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-2xl font-bold font-display">{internship._count.applications}</span>
                  <span className="text-sm text-muted-foreground">Applicants</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/recruiter/applications?internshipId=${internship.id}`}>
                      View Pipeline
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={`/dashboard/recruiter/internships/${internship.id}/edit`}>
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {internships.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Internships Posted</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven&apos;t created any internship listings yet. Post your first internship to start receiving applications.
            </p>
            <Button asChild>
              <Link href="/dashboard/recruiter/internships/new">Post an Internship</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
