import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Award, Download, Eye, BookOpen } from "lucide-react";
import { formatDate } from "@/src/lib/utils";

export default async function StudentCertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id, status: "ISSUED" },
    include: {
      course: {
        select: {
          title: true,
          thumbnail: true,
          instructor: { select: { name: true } },
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground mt-1">
            View and download your earned credentials.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
          <Award className="w-5 h-5" />
          {certificates.length} Earned
        </div>
      </div>

      {certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-all group">
              <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                {cert.course.thumbnail ? (
                  <img
                    src={cert.course.thumbnail}
                    alt={cert.course.title}
                    className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 absolute inset-0 opacity-10" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-5">
                  <Award className="w-10 h-10 text-emerald-400 mb-2" />
                  <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
                    {cert.course.title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issued:</span>
                    <span className="font-medium">{cert.issuedAt ? formatDate(cert.issuedAt) : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Score:</span>
                    <span className="font-medium">{cert.score ? `${Math.round(cert.score)}%` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">{cert.certificateNo.substring(0, 8)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/certificates/${cert.id}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Link>
                  </Button>
                  <Button asChild className="w-full gradient-bg text-white">
                    <Link href={`/certificates/verify/${cert.verificationCode}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Award className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Certificates Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Complete courses and pass all quizzes to earn verified certificates that you can share with employers.
          </p>
          <Button asChild className="gradient-bg text-white">
            <Link href="/dashboard/student/courses">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
