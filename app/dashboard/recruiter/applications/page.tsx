import { Prisma } from "@prisma/client";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Search, Filter, ExternalLink, Check, X, Mail } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { formatDate } from "@/src/lib/utils";

export default async function RecruiterApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ internshipId?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") redirect("/login");

  // Fetch internships for the filter dropdown
  const internships = await db.internship.findMany({
    where: { recruiterId: session.user.id },
    select: { id: true, title: true }
  });

  // Fetch applications
  const whereClause: Prisma.InternshipApplicationWhereInput = {
    internship: { recruiterId: session.user.id }
  };
  
  if (params.internshipId) {
    whereClause.internshipId = params.internshipId;
  }

  const applications = await db.internshipApplication.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true, image: true, skills: true } },
      internship: { select: { title: true } }
    },
    orderBy: { appliedAt: "desc" }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Applications</h1>
        <p className="text-muted-foreground mt-1">Review and manage candidate applications.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Input 
            placeholder="Search candidates..." 
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          {/* Mock Dropdown for filtering - in a real app use a Select component */}
          <div className="bg-card border border-border rounded-md px-3 py-2 flex items-center text-sm font-medium">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            {params.internshipId 
              ? internships.find(i => i.id === params.internshipId)?.title || "All Internships" 
              : "All Internships"}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Candidate</th>
                  <th className="px-6 py-4 font-medium">Internship</th>
                  <th className="px-6 py-4 font-medium">Applied On</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Links</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={app.user.image} name={app.user.name} size="sm" />
                        <div>
                          <p className="font-semibold text-foreground">{app.user.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <Mail className="w-3 h-3 mr-1" />
                            {app.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium line-clamp-1">{app.internship.title}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        app.status === "ACCEPTED" ? "success" : 
                        app.status === "REJECTED" ? "destructive" : 
                        app.status === "SHORTLISTED" ? "default" : 
                        app.status === "REVIEWING" ? "secondary" : 
                        "outline"
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {app.resumeUrl && (
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center">
                            Resume <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                        {app.portfolioUrl && (
                          <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center">
                            Portfolio <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" title="Accept Candidate" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="Reject Candidate" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
