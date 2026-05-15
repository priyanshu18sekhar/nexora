interface UserLike {
  name?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  website?: string | null;
  skills?: string[] | null;
  image?: string | null;
}

interface CompletionField {
  key: string;
  label: string;
  weight: number;
  filled: boolean;
}

export function calculateProfileCompletion(user: UserLike) {
  const fields: CompletionField[] = [
    { key: "name",        label: "Full name",          weight: 10, filled: !!user.name?.trim() },
    { key: "headline",    label: "Professional headline", weight: 15, filled: !!user.headline?.trim() },
    { key: "bio",         label: "About you",          weight: 15, filled: !!user.bio?.trim() },
    { key: "image",       label: "Profile photo",      weight: 10, filled: !!user.image },
    { key: "location",    label: "Location",           weight: 10, filled: !!user.location?.trim() },
    { key: "linkedinUrl", label: "LinkedIn URL",       weight: 10, filled: !!user.linkedinUrl?.trim() },
    { key: "githubUrl",   label: "GitHub URL",         weight: 10, filled: !!user.githubUrl?.trim() },
    { key: "skills",      label: "At least 3 skills",  weight: 20, filled: (user.skills?.length ?? 0) >= 3 },
  ];

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
  const earned = fields.filter((f) => f.filled).reduce((sum, f) => sum + f.weight, 0);
  const percent = Math.round((earned / totalWeight) * 100);
  const missing = fields.filter((f) => !f.filled);

  return { percent, missing, fields };
}

interface PointsInputs {
  completedCourses: number;
  activeCourses: number;
  passedQuizzes: number;
  certificates: number;
  averageScore: number;
  profileCompletionPct: number;
}

export function calculatePoints(p: PointsInputs) {
  const fromCourses   = p.completedCourses * 200 + p.activeCourses * 25;
  const fromQuizzes   = p.passedQuizzes * 50;
  const fromCerts     = p.certificates * 300;
  const fromProfile   = Math.round((p.profileCompletionPct / 100) * 150);
  const fromScore     = Math.round((p.averageScore / 100) * 100);

  const total = fromCourses + fromQuizzes + fromCerts + fromProfile + fromScore;

  const tiers = [
    { name: "Newcomer",    min: 0,    color: "from-slate-400 to-slate-600",   reward: "Welcome!" },
    { name: "Bronze",      min: 250,  color: "from-amber-700 to-amber-500",   reward: "10% off next course" },
    { name: "Silver",      min: 750,  color: "from-slate-400 to-slate-300",   reward: "Free Nexora sticker pack" },
    { name: "Gold",        min: 1500, color: "from-amber-500 to-yellow-400",  reward: "Premium e-book bundle" },
    { name: "Platinum",    min: 3000, color: "from-indigo-400 to-violet-400", reward: "1-on-1 mentor session" },
    { name: "Diamond",     min: 5000, color: "from-cyan-400 to-blue-500",     reward: "Free internship guarantee" },
  ];

  const current = [...tiers].reverse().find((t) => total >= t.min) ?? tiers[0];
  const next = tiers.find((t) => t.min > total);
  const toNext = next ? next.min - total : 0;
  const progressToNext = next ? Math.round(((total - current.min) / (next.min - current.min)) * 100) : 100;

  return {
    total,
    breakdown: { fromCourses, fromQuizzes, fromCerts, fromProfile, fromScore },
    tier: current,
    nextTier: next,
    toNext,
    progressToNext,
  };
}
