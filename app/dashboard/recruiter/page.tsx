import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Briefcase, Users, CheckCircle, Clock, FileText, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default async function RecruiterDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") redirect("/login");

  const [internships, totalEarnings] = await Promise.all([
    db.internship.findMany({
      where: { recruiterId: session.user.id },
      include: {
        _count: { select: { applications: true } },
        applications: {
          select: { status: true }
        }
      }
    }),
    db.payment.aggregate({
      where: { userId: session.user.id, status: "COMPLETED" },
      _sum: { amount: true }
    })
  ]);

  const activeInternships = internships.filter(i => i.status === "OPEN").length;
  const totalApplications = internships.reduce((sum, i) => sum + i._count.applications, 0);
  const acceptedCandidates = internships.reduce((sum, i) => sum + i.applications.filter(a => a.status === "ACCEPTED").length, 0);
  const pendingReview = internships.reduce((sum, i) => sum + i.applications.filter(a => a.status === "PENDING").length, 0);

  const stats = [
    { label: "Active Postings", value: activeInternships, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Applications", value: totalApplications, icon: FileText, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Pending Review", value: pendingReview, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Hired Candidates", value: acceptedCandidates, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Earnings", value: `₹${totalEarnings._sum.amount || 0}`, icon: DollarSign, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Recruiter Overview</h1>
        <p className="text-muted-foreground mt-1">Manage your internship pipeline and track candidates.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-semibold">Your Internship Postings</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/dashboard/recruiter/internships">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {internships.slice(0, 4).map((internship) => (
              <div key={internship.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium text-sm">{internship.title}</p>
                  <p className="text-xs text-muted-foreground">{internship.company} • {internship.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{internship._count.applications} Applicants</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${internship.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    {internship.status}
                  </span>
                </div>
              </div>
            ))}
            {internships.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm mb-4">You haven&apos;t posted any internships yet.</p>
                <Button asChild>
                  <Link href="/dashboard/recruiter/internships/new">Post an Internship</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2 rounded-xl">
              <Link href="/dashboard/recruiter/applications">
                <FileText className="w-6 h-6 text-violet-500" />
                Review Applications
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2 rounded-xl">
              <Link href="/dashboard/recruiter/internships/new">
                <Briefcase className="w-6 h-6 text-blue-500" />
                Post Internship
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2 rounded-xl">
              <Link href="/dashboard/recruiter/candidates">
                <Users className="w-6 h-6 text-amber-500" />
                Browse Candidates
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col gap-2 rounded-xl">
              <Link href="/dashboard/recruiter/earnings">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                Earnings Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
