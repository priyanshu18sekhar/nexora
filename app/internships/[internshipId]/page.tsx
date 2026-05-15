import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building, MapPin, Briefcase, Clock, Calendar, CheckCircle2, ChevronRight,
  Users, IndianRupee, Sparkles, Award,
} from "lucide-react";
import { db } from "@/src/lib/db";
import { formatRelativeTime } from "@/src/lib/utils";
import { InternshipApplyButton } from "@/src/components/internships/apply-button";
import { Aurora } from "@/src/components/effects/aurora";

const MOCK_INTERNSHIP = {
  id: "mock-1",
  title: "Software Engineering Intern — Frontend",
  company: "TechNova Solutions",
  companyLogo: null,
  location: "Bangalore, India",
  isRemote: true,
  stipend: 25000,
  duration: "6 Months",
  status: "OPEN" as const,
  deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
  openings: 3,
  createdAt: new Date(),
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
  description:
    "We are looking for a passionate Frontend Engineering Intern to join our core product team. You will be working directly with senior engineers to build user-facing features for our flagship platform used by millions of users.\n\nAs an intern, you won't just be fixing bugs. You will take ownership of entire feature sets from design to deployment.",
  requirements:
    "• Currently pursuing a B.Tech/B.E in Computer Science or related field\n• Strong fundamentals in JavaScript/TypeScript, HTML, and CSS\n• Experience with React (Next.js is a plus)\n• Familiarity with state management libraries\n• Good understanding of responsive design principles\n• Available for a 6-month full-time internship",
  recruiter: { name: "Rohit Kumar", image: null, headline: "Engineering Manager at TechNova" },
};

const INTERNSHIP_PROGRAM_FEE_INR = 499;

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ internshipId: string }>;
}) {
  const { internshipId } = await params;
  let internship: typeof MOCK_INTERNSHIP | null = null;
  try {
    const row = await db.internship.findUnique({
      where: { id: internshipId },
      include: { recruiter: { select: { name: true, image: true, headline: true } } },
    });
    if (row) internship = row as unknown as typeof MOCK_INTERNSHIP;
  } catch (err) {
    console.error("Failed to fetch internship:", err);
  }

  const data = internship || MOCK_INTERNSHIP;
  if (!data) notFound();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative pt-24 pb-14 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <Aurora className="opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/55 mb-5">
            <Link href="/internships" className="hover:text-white transition-colors">Internships</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/85 font-medium truncate">{data.company}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 shadow-xl border border-white/15 overflow-hidden">
              {data.companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.companyLogo} alt={data.company} className="w-full h-full object-cover" />
              ) : (
                <Building className="w-9 h-9 text-white/80" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight mb-2 leading-tight">
                {data.title}
              </h1>
              <p className="text-lg text-white/80 font-medium mb-4">{data.company}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 text-white/85">
                  <MapPin className="w-4 h-4" /> {data.location}
                </span>
                <span className="flex items-center gap-1.5 text-white/85">
                  <Briefcase className="w-4 h-4" /> {data.duration}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <IndianRupee className="w-4 h-4" />
                  {data.stipend ? `${data.stipend.toLocaleString()}/mo stipend` : "Unpaid"}
                </span>
                {data.isRemote && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 backdrop-blur-md">
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick stats card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Users,     label: "Openings",  value: `${data.openings ?? 1}` },
                  { icon: Calendar,  label: "Apply by",  value: data.deadline ? new Date(data.deadline).toLocaleDateString() : "Rolling" },
                  { icon: Clock,     label: "Posted",    value: formatRelativeTime(data.createdAt) },
                  { icon: CheckCircle2, label: "Status", value: "Hiring" },
                ].map((s) => (
                  <div key={s.label} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold truncate">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                About the internship
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/75 whitespace-pre-wrap leading-relaxed">
                {data.description}
              </div>
            </div>

            {/* Requirements */}
            {data.requirements && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-xl font-bold font-display mb-4">Requirements & qualifications</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/75 whitespace-pre-wrap leading-relaxed">
                  {data.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/40 via-blue-500/30 to-emerald-500/40 blur-xl opacity-60" />
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary/10 blur-3xl" />
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Program fee</p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold font-display">
                        <IndianRupee className="inline-block w-6 h-6 -translate-y-1" />
                        {INTERNSHIP_PROGRAM_FEE_INR}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">₹1,499</span>
                    </div>
                    <p className="text-xs text-rose-500 font-semibold mb-5">
                      ⏰ Early-bird offer — saves you ₹1,000
                    </p>

                    <InternshipApplyButton
                      internshipId={data.id}
                      internshipTitle={data.title}
                      className="w-full gradient-bg text-white shadow-brand rounded-xl h-11 text-sm font-semibold hover:opacity-90"
                    />

                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Refundable if not shortlisted within 14 days
                    </p>

                    <ul className="space-y-3 mt-6 pt-5 border-t border-border text-sm text-foreground/75">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        Direct recruiter feedback
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        Application tracked in dashboard
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        Priority over free applicants
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        Earn 300 points on apply
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-bold text-sm mb-3">Required skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-primary/8 border border-primary/15 text-xs font-medium text-foreground/85"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
