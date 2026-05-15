import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Award, Download, Eye, BookOpen, Sparkles, Share2, Hourglass } from "lucide-react";
import { formatDate } from "@/src/lib/utils";
import { ClaimCertificateButton } from "@/src/components/certificates/claim-button";

export default async function StudentCertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id, status: { in: ["ISSUED", "PENDING"] } },
    include: {
      course: {
        select: {
          title: true,
          thumbnail: true,
          isFree: true,
          instructor: { select: { name: true } },
        },
      },
    },
    orderBy: [{ status: "asc" }, { issuedAt: "desc" }, { createdAt: "desc" }],
  });

  const issued = certificates.filter((c) => c.status === "ISSUED");
  const pending = certificates.filter((c) => c.status === "PENDING");

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-15" />
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white/75 text-xs uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Your verified credentials
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">My Certificates</h1>
            <p className="text-white/80 text-sm max-w-md">
              Share these with employers — every certificate is verifiable and recognised by 300+ partners.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-2xl">
            <Award className="w-5 h-5" />
            <div>
              <p className="text-2xl font-bold font-display tabular-nums leading-none">{issued.length}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-white/80 mt-0.5">earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending claim banner */}
      {pending.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 dark:from-amber-500/8 dark:via-orange-500/8 dark:to-rose-500/8 p-5">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Hourglass className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold font-display">
                {pending.length === 1
                  ? "1 certificate ready to claim"
                  : `${pending.length} certificates ready to claim`}
              </p>
              <p className="text-sm text-foreground/70">
                You completed the course content. Pay <span className="font-semibold text-foreground">₹299</span> per certificate to get them verified & shareable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Certificates grid */}
      {certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => {
            const isIssued = cert.status === "ISSUED";
            return (
              <article
                key={cert.id}
                className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 ${
                  isIssued
                    ? "border-border hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
                    : "border-amber-500/30 hover:border-amber-500/60 hover:shadow-2xl hover:shadow-amber-500/15"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className={`absolute inset-0 ${
                      isIssued
                        ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
                        : "bg-gradient-to-br from-slate-800 via-amber-900 to-orange-900"
                    }`}
                  />
                  <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                  {cert.course.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cert.course.thumbnail}
                      alt={cert.course.title}
                      className="object-cover w-full h-full opacity-30 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div
                    className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-2xl ${
                      isIssued ? "bg-emerald-400/20" : "bg-amber-400/20"
                    }`}
                  />

                  <div className="absolute inset-0 p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-auto">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                        {isIssued ? (
                          <Award className="w-5.5 h-5.5 text-emerald-300" />
                        ) : (
                          <Hourglass className="w-5 h-5 text-amber-300" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
                          isIssued
                            ? "bg-emerald-400/20 text-emerald-200 border-emerald-300/30"
                            : "bg-amber-400/20 text-amber-200 border-amber-300/30"
                        }`}
                      >
                        {isIssued ? "Verified" : "Awaiting payment"}
                      </span>
                    </div>
                    <h3 className="text-white font-bold font-display text-lg leading-tight line-clamp-2 mt-3">
                      {cert.course.title}
                    </h3>
                    <p className="text-white/70 text-xs mt-1">by {cert.course.instructor.name}</p>
                  </div>
                </div>

                <div className="p-5">
                  <dl className="space-y-2 mb-4 text-xs">
                    <div className="flex justify-between items-baseline">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd className={`font-bold ${isIssued ? "text-emerald-600" : "text-amber-600"}`}>
                        {isIssued ? "Issued" : "Ready to claim"}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <dt className="text-muted-foreground">Score</dt>
                      <dd className="font-bold tabular-nums">
                        {cert.score ? `${Math.round(cert.score)}%` : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <dt className="text-muted-foreground">{isIssued ? "Issued" : "Completed"}</dt>
                      <dd className="font-medium tabular-nums">
                        {isIssued ? (cert.issuedAt ? formatDate(cert.issuedAt) : "—") : formatDate(cert.createdAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <dt className="text-muted-foreground">Certificate №</dt>
                      <dd className="font-mono text-[11px]">{cert.certificateNo.substring(0, 10).toUpperCase()}</dd>
                    </div>
                  </dl>

                  {isIssued ? (
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
                        <Link href={`/certificates/${cert.id}`}>
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
                        <Link href={`/certificates/verify/${cert.verificationCode}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" className="gradient-bg text-white rounded-xl text-xs" asChild>
                        <Link
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/certificates/verify/${cert.verificationCode}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <ClaimCertificateButton
                      certificateId={cert.id}
                      courseTitle={cert.course.title}
                      className="w-full gradient-bg text-white shadow-brand rounded-xl text-sm font-semibold"
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card/40 p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <Award className="w-9 h-9 text-emerald-500/70" />
          </div>
          <h2 className="text-xl font-bold font-display mb-2">No certificates yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
            Complete a course and pass the milestone quizzes to earn a certificate.
            <br />
            <span className="text-xs">Free courses: pay ₹299 to claim. Paid courses: certificate is auto-issued.</span>
          </p>
          <Button asChild className="gradient-bg text-white rounded-xl shadow-brand">
            <Link href="/dashboard/student/courses">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
