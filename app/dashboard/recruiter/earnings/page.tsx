import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { DollarSign, ArrowUpRight, Clock, FileText, Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { formatDate } from "@/src/lib/utils";

export default async function RecruiterEarningsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") redirect("/login");

  // Fetch payments to the recruiter
  const payments = await db.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  const totalEarnings = payments
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingEarnings = payments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your commissions and payouts.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Statement
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-100" />
            </div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold font-display tracking-tight">₹{totalEarnings}</h2>
            
            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
              <span className="text-sm text-emerald-100">Next payout: 1st of month</span>
              <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-sm border-0 font-semibold rounded-lg">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
            </div>
            <h3 className="text-3xl font-bold font-display ml-13">₹{pendingEarnings}</h3>
            <p className="text-xs text-muted-foreground mt-2 ml-13">From 0 recent placements</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
            </div>
            <h3 className="text-3xl font-bold font-display ml-13">{payments.length}</h3>
            <p className="text-xs text-muted-foreground mt-2 ml-13">Lifetime transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {/* For now mock description, normally would come from payment metadata */}
                      Commission - Internship Placement
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        payment.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {payment.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold font-display">
                      {payment.currency === 'INR' ? '₹' : '$'}{payment.amount}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No transactions found.
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
