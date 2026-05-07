import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import { User, Mail, Link as LinkIcon, MapPin, Briefcase, Plus, Code } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/login");

  return (
    <div className="pt-20 pb-16 min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card variant="default">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar src={user.image} name={user.name} size="xl" className="mb-4 shadow-lg ring-4 ring-background" />
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.role}</p>
                
                <div className="w-full space-y-3">
                  <Button variant="outline" className="w-full">Change Photo</Button>
                  {user.role === "STUDENT" && (
                    <Button variant="default" className="w-full">Upload Resume</Button>
                  )}
                </div>

                <div className="w-full mt-6 space-y-3 pt-6 border-t border-border text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                  {user.linkedinUrl && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <a href={user.linkedinUrl} className="truncate hover:text-primary transition-colors">LinkedIn</a>
                    </div>
                  )}
                  {user.githubUrl && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Code className="w-4 h-4 shrink-0" />
                      <a href={user.githubUrl} className="truncate hover:text-primary transition-colors">GitHub</a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input id="headline" defaultValue={user.headline || ""} placeholder="e.g. Software Engineering Student" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <textarea 
                    id="bio" 
                    className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a little bit about yourself..."
                    defaultValue={user.bio || ""}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={user.location || ""} placeholder="City, Country" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input id="website" defaultValue={user.website || ""} placeholder="https://..." />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" defaultValue={user.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" defaultValue={user.githubUrl || ""} placeholder="https://github.com/..." />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add skills to help recruiters find you.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(user.skills.length > 0 ? user.skills : ["React", "JavaScript", "Python"]).map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-muted-foreground flex items-center gap-2">
                      {skill}
                      <button className="hover:text-destructive text-xs">×</button>
                    </span>
                  ))}
                  <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
