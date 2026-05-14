import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import { Search, Mail, Filter, MoreVertical, Award, BookOpen, Briefcase } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Avatar } from "@/src/components/ui/avatar";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, certificates: true, internshipsPosted: true } }
    }
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Manage Users</h1>
        <p className="text-muted-foreground mt-1">View and manage all registered accounts on the platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Input 
            placeholder="Search users..." 
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Role
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Activity</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.image} name={user.name} size="sm" />
                        <div>
                          <p className="font-semibold text-foreground">{user.name || "Unknown User"}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        user.role === "ADMIN" ? "destructive" : 
                        user.role === "RECRUITER" ? "warning" : 
                        "default"
                      } className={user.role === "STUDENT" ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" : ""}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-xs">
                        {user.role === "STUDENT" && (
                          <>
                            <span className="flex items-center text-muted-foreground" title="Enrolled Courses">
                              <BookOpen className="w-3.5 h-3.5 mr-1 text-primary" /> {user._count.enrollments}
                            </span>
                            <span className="flex items-center text-muted-foreground" title="Certificates">
                              <Award className="w-3.5 h-3.5 mr-1 text-emerald-500" /> {user._count.certificates}
                            </span>
                          </>
                        )}
                        {user.role === "RECRUITER" && (
                          <span className="flex items-center text-muted-foreground" title="Internships Posted">
                            <Briefcase className="w-3.5 h-3.5 mr-1 text-amber-500" /> {user._count.internshipsPosted}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
