import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { calculateProfileCompletion } from "@/src/lib/profile-completion";

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

export function ProfileCompletionCard({ user }: { user: UserLike }) {
  const { percent, missing } = calculateProfileCompletion(user);

  if (percent === 100) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Profile 100% complete</p>
            <p className="text-xs text-muted-foreground">You&apos;re unlocking the best recommendations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/profile"
      className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-5 block hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
    >
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Complete your profile</p>
              <p className="text-xs text-muted-foreground">Boost recommendations & internship offers</p>
            </div>
          </div>
          <span className="text-2xl font-bold font-display gradient-text tabular-nums">{percent}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-3">
          <div
            className="h-full rounded-full gradient-bg transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {missing.slice(0, 4).map((f) => (
            <span
              key={f.key}
              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-primary/8 text-primary/80 border border-primary/15"
            >
              {f.label}
            </span>
          ))}
          {missing.length > 4 && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              +{missing.length - 4} more
            </span>
          )}
        </div>

        <p className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
          Complete now <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </div>
    </Link>
  );
}
