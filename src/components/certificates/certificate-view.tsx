"use client";

import React, { useRef, useState } from "react";
import { Download, Share2, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatDate } from "@/src/lib/utils";

interface CertificateViewProps {
  certificate: {
    id: string;
    certificateNo: string;
    verificationCode: string;
    score: number | null;
    issuedAt: Date | null;
    user: { name: string | null };
    course: { title: string; instructor: { name: string | null } };
  };
  isPublic?: boolean;
}

export function CertificateView({ certificate, isPublic = false }: CertificateViewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);

    try {
      // Temporarily adjust scale for better quality
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff", // Ensure white background
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Nexora_Certificate_${certificate.user.name?.replace(/\s+/g, "_")}.pdf`);
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download certificate");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/certificates/verify/${certificate.verificationCode}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Verification link copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div>
          <h2 className="font-semibold text-lg">Certificate of Completion</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Verified Credential
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading} className="gradient-bg text-white">
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Certificate Print Area */}
      <div className="overflow-x-auto pb-4">
        <div 
          ref={printRef}
          className="min-w-[800px] w-full aspect-[1.414/1] relative bg-white text-slate-900 border-[12px] border-slate-900 p-12 flex flex-col justify-between items-center text-center shadow-2xl mx-auto overflow-hidden"
          style={{ backgroundImage: "radial-gradient(#f1f5f9 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-b-[8px] border-r-[8px] border-primary/20 rounded-br-[100px]" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-t-[8px] border-l-[8px] border-primary/20 rounded-tl-[100px]" />

          {/* Header */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Nexora Platform</h1>
            </div>
            <h2 className="text-5xl font-serif text-slate-800 tracking-wider">CERTIFICATE</h2>
            <h3 className="text-xl tracking-widest text-slate-500 font-medium">OF COMPLETION</h3>
          </div>

          {/* Body */}
          <div className="space-y-6 w-full max-w-2xl z-10">
            <p className="text-lg text-slate-500 uppercase tracking-widest">This certifies that</p>
            <h2 className="text-5xl font-bold text-primary font-display capitalize border-b-2 border-slate-200 pb-4">
              {certificate.user.name}
            </h2>
            <p className="text-lg text-slate-500 uppercase tracking-widest">Has successfully completed</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {certificate.course.title}
            </h3>
            {certificate.score !== null && (
              <p className="text-md font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full inline-block mt-2">
                Passed with {Math.round(certificate.score)}% Score
              </p>
            )}
          </div>

          {/* Footer Signatures */}
          <div className="w-full flex justify-between items-end px-12 pb-8 z-10">
            <div className="text-center w-48">
              <div className="border-b-2 border-slate-300 pb-2 mb-2">
                <span className="font-signature text-2xl text-slate-700">Priyanshu Danda</span>
              </div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Priyanshu Danda</p>
              <p className="text-xs text-slate-400">CEO, Nexora</p>
            </div>

            <div className="w-32 h-32 rounded-full border-[8px] border-slate-100 flex items-center justify-center bg-white shadow-lg relative">
              <div className="absolute inset-2 border border-slate-300 rounded-full border-dashed" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issued</p>
                <p className="text-sm font-bold text-slate-800">
                  {certificate.issuedAt ? new Date(certificate.issuedAt).getFullYear() : new Date().getFullYear()}
                </p>
              </div>
            </div>

            <div className="text-center w-48">
              <div className="border-b-2 border-slate-300 pb-2 mb-2 text-slate-800 font-semibold h-[42px] flex items-end justify-center">
                {certificate.course.instructor.name}
              </div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Instructor</p>
              <p className="text-xs text-slate-400">Course Lead</p>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="absolute bottom-0 left-0 w-full bg-slate-50 border-t border-slate-200 py-3 px-8 flex justify-between items-center text-xs text-slate-500 font-mono">
            <div>
              Date: {certificate.issuedAt ? formatDate(certificate.issuedAt) : "N/A"}
            </div>
            <div>
              Verify at: nexora.io/certificates/verify/{certificate.verificationCode}
            </div>
            <div>
              ID: {certificate.certificateNo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
