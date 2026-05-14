import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { Award, Search, CheckCircle, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Avatar } from "@/src/components/ui/avatar";
import { formatDate } from "@/src/lib/utils";

export default async function AdminCertificatesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const certificates = await db.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      course: { select: { title: true } }
    }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Issued Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage platform credentials and verified completions.</p>
        </div>
        <Button className="gradient-bg text-white shadow-brand">
          <Award className="w-4 h-4 mr-2" />
          Issue Manually
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Input 
            placeholder="Search by student or course..." 
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Issued Date</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={cert.user.image} name={cert.user.name} size="xs" />
                        <div>
                          <p className="font-semibold text-foreground">{cert.user.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium line-clamp-1 max-w-[250px]">{cert.course.title}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">ID: {cert.certificateNo.substring(0,8)}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {cert.issuedAt ? formatDate(cert.issuedAt) : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {cert.score ? `${Math.round(cert.score)}%` : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={cert.status === "ISSUED" ? "success" : "secondary"}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {cert.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" asChild title="View Public Link">
                          <Link href={`/certificates/verify/${cert.verificationCode}`} target="_blank">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon-sm" asChild title="View Details">
                          <Link href={`/certificates/${cert.id}`}>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {certificates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No certificates have been issued yet.
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
