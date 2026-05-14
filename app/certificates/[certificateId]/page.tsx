import { db } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { CertificateView } from "@/src/components/certificates/certificate-view";
import { auth } from "@/src/lib/auth";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const session = await auth();
  
  const certificate = await db.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true, instructor: { select: { name: true } } } },
    },
  });

  if (!certificate) notFound();

  // If user is not the owner and not an admin, they shouldn't see the private view
  if (session?.user?.id !== certificate.userId && session?.user?.role !== "ADMIN") {
    // Redirect to public verify page instead
    return <div className="p-8 text-center">Please use the public verification link to view this certificate.</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4">
        <CertificateView certificate={certificate} />
      </div>
    </div>
  );
}
