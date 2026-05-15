import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import { ProfileForm } from "@/src/components/profile/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      headline: true,
      bio: true,
      location: true,
      website: true,
      linkedinUrl: true,
      githubUrl: true,
      skills: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>
        <ProfileForm initial={user} />
      </div>
    </div>
  );
}
