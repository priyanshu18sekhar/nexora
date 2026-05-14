import { db } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { CertificateView } from "@/src/components/certificates/certificate-view";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await db.certificate.findUnique({
    where: { verificationCode: code },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true, instructor: { select: { name: true } } } },
    },
  });

  if (!certificate) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Invalid Certificate</h1>
        <p className="text-muted-foreground mb-8">
          We could not find a certificate matching this verification code.
        </p>
        <Link href="/" className="text-primary hover:underline font-medium">
          Return to Nexora
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold">Verified Certificate</h1>
          <p className="text-muted-foreground mt-1">
            This is a valid certificate issued by Nexora to {certificate.user.name}.
          </p>
        </div>
        
        <CertificateView certificate={certificate} isPublic={true} />
      </div>
    </div>
  );
}
