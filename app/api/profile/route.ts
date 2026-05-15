import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string().max(50)).max(30).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true, role: true,
      headline: true, bio: true, location: true, website: true,
      linkedinUrl: true, githubUrl: true, skills: true, createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.headline !== undefined) updateData.headline = data.headline || null;
  if (data.bio !== undefined) updateData.bio = data.bio || null;
  if (data.location !== undefined) updateData.location = data.location || null;
  if (data.website !== undefined) updateData.website = data.website || null;
  if (data.linkedinUrl !== undefined) updateData.linkedinUrl = data.linkedinUrl || null;
  if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl || null;
  if (data.skills !== undefined) updateData.skills = data.skills;

  const user = await db.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: {
      id: true, name: true, email: true, image: true, role: true,
      headline: true, bio: true, location: true, website: true,
      linkedinUrl: true, githubUrl: true, skills: true,
    },
  });

  return NextResponse.json(user);
}
