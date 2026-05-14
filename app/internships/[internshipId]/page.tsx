import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building, MapPin, Briefcase, Clock, Calendar, CheckCircle2, ArrowRight, Share2, Bookmark } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { db } from "@/src/lib/db";
import { formatRelativeTime } from "@/src/lib/utils";
import { InternshipApplyButton } from "@/src/components/internships/apply-button";

const MOCK_INTERNSHIP = {
  id: "mock-1",
  title: "Software Engineering Intern - Frontend",
  company: "TechNova Solutions",
  companyLogo: null,
  location: "Bangalore, India",
  isRemote: true,
  stipend: 500,
  duration: "6 Months",
  status: "OPEN",
  deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
  openings: 3,
  createdAt: new Date(),
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
  description: "We are looking for a passionate Frontend Engineering Intern to join our core product team. You will be working directly with senior engineers to build user-facing features for our flagship platform used by millions of users.\n\nAs an intern, you won't just be fixing bugs. You will take ownership of entire feature sets from design to deployment. We believe in learning by doing, and you'll get plenty of opportunities to do both.",
  requirements: "• Currently pursuing a B.Tech/B.E in Computer Science or related field\n• Strong fundamentals in JavaScript/TypeScript, HTML, and CSS\n• Experience with React (Next.js is a plus)\n• Familiarity with state management libraries like Redux or Zustand\n• Good understanding of responsive design principles\n• Excellent problem-solving skills and willingness to learn\n• Available for a 6-month full-time internship",
};

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ internshipId: string }>;
}) {
  const { internshipId } = await params;
  let internship = null;
  try {
    internship = await db.internship.findUnique({
      where: { id: internshipId },
      include: {
        recruiter: { select: { name: true, image: true, headline: true } }
      }
    });
  } catch (error) {
    console.error("Failed to fetch internship:", error);
  }

  const displayInternship = internship || MOCK_INTERNSHIP;

  if (!displayInternship) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Card */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="h-32 gradient-bg"></div>
          <CardContent className="px-6 sm:px-10 pb-10 pt-0 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                {displayInternship.companyLogo ? (
                  <img src={displayInternship.companyLogo} alt={displayInternship.company} className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{displayInternship.title}</h1>
                  <p className="text-lg text-muted-foreground font-medium">{displayInternship.company}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <InternshipApplyButton internshipId={displayInternship.id} size="lg" className="px-8 shadow-lg" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 py-4 border-y border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Location</p>
                  <p className="text-sm font-semibold">{displayInternship.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Stipend</p>
                  <p className="text-sm font-semibold">{displayInternship.stipend ? `$${displayInternship.stipend} / month` : "Unpaid"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Duration</p>
                  <p className="text-sm font-semibold">{displayInternship.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Apply By</p>
                  <p className="text-sm font-semibold">{displayInternship.deadline ? new Date(displayInternship.deadline).toLocaleDateString() : "Rolling"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full font-medium text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Actively hiring
              </span>
              <span>{displayInternship.openings} openings</span>
              <span>Posted {formatRelativeTime(displayInternship.createdAt)}</span>
              {displayInternship.isRemote && (
                <Badge variant="success">Remote Available</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs/Sections */}
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="sm:col-span-2 space-y-8">
            <Card variant="default">
              <CardContent className="p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">About the Internship</h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {displayInternship.description}
                  </div>
                </div>

                {displayInternship.requirements && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Requirements & Qualifications</h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {displayInternship.requirements}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="sm:col-span-1 space-y-6">
            <Card variant="default">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {displayInternship.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="gradient-border bg-card">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold mb-2">Ready to apply?</h3>
                <InternshipApplyButton internshipId={displayInternship.id} className="w-full shadow-md" />
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
