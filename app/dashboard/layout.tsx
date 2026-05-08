import { DashboardSidebar } from "@/src/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar />
      {/* Desktop: offset by sidebar width, Mobile: full width with top bar padding */}
      <div className="lg:pl-64 pt-14 lg:pt-0 transition-all duration-300" id="dashboard-main">
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
