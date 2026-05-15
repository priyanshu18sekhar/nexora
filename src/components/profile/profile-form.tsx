"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail, MapPin, Briefcase, Code, Plus, X, Save, Globe, Sparkles,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Avatar } from "@/src/components/ui/avatar";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  skills: string[];
}

export function ProfileForm({ initial }: { initial: ProfileData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [form, setForm] = useState({
    name: initial.name ?? "",
    headline: initial.headline ?? "",
    bio: initial.bio ?? "",
    location: initial.location ?? "",
    website: initial.website ?? "",
    linkedinUrl: initial.linkedinUrl ?? "",
    githubUrl: initial.githubUrl ?? "",
    skills: initial.skills ?? [],
  });

  const update = (key: keyof typeof form, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || form.skills.includes(trimmed) || form.skills.length >= 30) return;
    update("skills", [...form.skills, trimmed]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) =>
    update("skills", form.skills.filter((s) => s !== skill));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error?.message || "Failed to save profile");
      } else {
        toast.success("Profile saved successfully!");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover + Avatar */}
      <Card variant="elevated" className="overflow-hidden relative">
        <div className="h-40 sm:h-52 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg-hero" />
          <div className="absolute inset-0 bg-dot-pattern opacity-15" />
          <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-12 right-1/3 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        </div>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-14 mb-4 gap-4">
            <Avatar
              src={initial.image}
              name={initial.name}
              size="xl"
              className="ring-4 ring-card shadow-xl"
            />
            <div className="flex-1 min-w-0 sm:pb-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display truncate">
                {form.name || "Your name"}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {form.headline || `Nexora ${initial.role.toLowerCase()}`}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full gradient-bg text-white font-medium">
                  <Sparkles className="w-3 h-3" /> {initial.role}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {initial.email}
                </span>
                {form.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {form.location}
                  </span>
                )}
              </div>
            </div>
            <Button onClick={handleSave} loading={saving} className="gradient-bg text-white shadow-brand sm:self-end rounded-xl">
              {!saving && <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
            </div>
            Personal Information
          </CardTitle>
          <CardDescription>This appears on your public profile and certificates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline">Professional Headline</Label>
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => update("headline", e.target.value)}
                placeholder="e.g. Software Engineering Student"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">About Me</Label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              placeholder="A short intro about your background, interests, and what you're learning..."
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.bio.length}/2000
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                placeholder="Bengaluru, India"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Socials */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-primary" />
            </div>
            Social Profiles
          </CardTitle>
          <CardDescription>Add your professional links — they boost certificate credibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={form.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={form.githubUrl}
                onChange={(e) => update("githubUrl", e.target.value)}
                leftIcon={<Code className="w-4 h-4" />}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-3.5 h-3.5 text-primary" />
            </div>
            Skills
          </CardTitle>
          <CardDescription>Up to 30 skills. Press Enter to add — they show on internship applications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-primary/8 to-primary/4 border border-primary/15 text-sm font-medium text-foreground/85 flex items-center gap-1.5 group hover:border-primary/30 transition-colors"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="opacity-50 group-hover:opacity-100 hover:text-destructive transition-all"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No skills added yet. Start typing below.</p>
          )}

          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              placeholder="e.g. React, Python, SQL..."
              className="flex-1"
              maxLength={50}
              disabled={form.skills.length >= 30}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
              disabled={!newSkill.trim() || form.skills.length >= 30}
              className="shrink-0 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          {form.skills.length >= 30 && (
            <p className="text-xs text-amber-600">Maximum 30 skills reached.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} loading={saving} className="gradient-bg text-white shadow-brand min-w-[180px] rounded-xl">
          {!saving && <Save className="w-4 h-4 mr-2" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
