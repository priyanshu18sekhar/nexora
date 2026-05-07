import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/src/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      {/* Main Content */}
      <div className="lg:pl-64 transition-all duration-300">
        <div className="pt-14 lg:pt-0">
          <main className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
