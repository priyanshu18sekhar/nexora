import { DashboardSidebar } from "@/src/components/dashboard/sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar />
      <div className="lg:pl-64 pt-14 lg:pt-0 transition-all duration-300">
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
