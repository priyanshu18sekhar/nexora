import React from "react";
import Link from "next/link";
import { MapPin, Briefcase, Clock, Building, ArrowRight, Sparkles, IndianRupee } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { db } from "@/src/lib/db";
import { formatRelativeTime } from "@/src/lib/utils";
import { Aurora } from "@/src/components/effects/aurora";
import { AnimatedGrid } from "@/src/components/effects/animated-grid";

interface DisplayInternship {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  stipend: number | null;
  duration: string;
  createdAt: Date;
  skills: string[];
  companyLogo?: string | null;
}

const MOCK_INTERNSHIPS: DisplayInternship[] = [
  { id: "mock-int-1", title: "Software Engineering Intern", company: "TechNova Solutions", location: "Bangalore, India", isRemote: true,  stipend: 25000, duration: "3 Months", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), skills: ["React", "Node.js", "TypeScript"],  companyLogo: null },
  { id: "mock-int-2", title: "Product Design Intern",       company: "CreativeFlow",      location: "Remote",            isRemote: true,  stipend: 20000, duration: "6 Months", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),      skills: ["Figma", "UI/UX", "Prototyping"], companyLogo: null },
  { id: "mock-int-3", title: "Data Analyst Intern",         company: "Insight Labs",      location: "Mumbai, India",     isRemote: false, stipend: 18000, duration: "4 Months", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),     skills: ["Python", "SQL", "Tableau"],      companyLogo: null },
  { id: "mock-int-4", title: "Marketing Intern",            company: "GrowthHub",         location: "Hyderabad, India",  isRemote: true,  stipend: 15000, duration: "3 Months", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), skills: ["SEO", "Content", "Analytics"],   companyLogo: null },
];

export default async function InternshipsPage() {
  let internships: DisplayInternship[] = [];
  try {
    const rows = await db.internship.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
    });
    internships = rows as unknown as DisplayInternship[];
  } catch (err) {
    console.error("Failed to fetch internships:", err);
  }

  const displayInternships = internships.length > 0 ? internships : MOCK_INTERNSHIPS;
  const remoteCount = displayInternships.filter((i) => i.isRemote).length;
  const paidCount = displayInternships.filter((i) => i.stipend && i.stipend > 0).length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <Aurora className="opacity-60" />
        <AnimatedGrid />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-semibold tracking-wide mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> 300+ hiring partners
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 leading-[1.05]">
              Find your dream <span className="gradient-text-hero">internship</span>
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              No middlemen, no scams. Direct from recruiters — paid roles at India&apos;s fastest-growing companies.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4">
                <p className="text-2xl font-bold font-display gradient-text">{displayInternships.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Open roles</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4">
                <p className="text-2xl font-bold font-display gradient-text">{remoteCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Remote</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4">
                <p className="text-2xl font-bold font-display gradient-text">{paidCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {displayInternships.map((internship) => (
              <Link key={internship.id} href={`/internships/${internship.id}`} className="block group">
                <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/8 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" />
                  <div className="relative flex flex-col md:flex-row md:items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-primary/15 flex items-center justify-center shrink-0">
                      {internship.companyLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={internship.companyLogo} alt={internship.company} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building className="w-6 h-6 text-primary/80" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl font-bold font-display mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {internship.title}
                          </h2>
                          <div className="text-sm text-muted-foreground font-medium flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground/80">{internship.company}</span>
                            {internship.isRemote && (
                              <Badge variant="success" className="text-[10px] uppercase tracking-wider">Remote</Badge>
                            )}
                          </div>
                        </div>
                        <Button className="gradient-bg text-white shadow-brand rounded-xl shrink-0 sm:self-start group-hover:opacity-90">
                          Apply
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {internship.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {internship.duration}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-foreground/85">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {internship.stipend ? `${internship.stipend.toLocaleString()}/mo` : "Unpaid"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(internship.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {internship.skills.slice(0, 5).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-foreground/70"
                          >
                            {skill}
                          </span>
                        ))}
                        {internship.skills.length > 5 && (
                          <span className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                            +{internship.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {displayInternships.length === 0 && (
            <div className="py-16 text-center rounded-3xl border-2 border-dashed border-border bg-card/30">
              <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-1">No internships available right now</p>
              <p className="text-sm text-muted-foreground mb-5">Check back soon — new roles drop every week.</p>
              <Button asChild className="gradient-bg text-white rounded-xl">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
