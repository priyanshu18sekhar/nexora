import { Trophy, Gift, ArrowRight, Sparkles } from "lucide-react";
import { calculatePoints } from "@/src/lib/profile-completion";
import Link from "next/link";

interface PointsCardProps {
  completedCourses: number;
  activeCourses: number;
  passedQuizzes: number;
  certificates: number;
  averageScore: number;
  profileCompletionPct: number;
}

export function PointsCard(props: PointsCardProps) {
  const { total, tier, nextTier, toNext, progressToNext, breakdown } = calculatePoints(props);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${tier.color}`}>
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute inset-0 bg-dot-pattern opacity-15" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-white/80">{tier.name} tier</p>
              <p className="text-3xl font-bold font-display tabular-nums leading-none mt-1">{total.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-white/70 mt-0.5">points earned</p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-white/40" />
        </div>

        {nextTier ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/80 font-medium">{toNext.toLocaleString()} pts to {nextTier.name}</span>
              <span className="text-white/80 tabular-nums font-semibold">{progressToNext}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="text-[11px] text-white/75 mt-2 flex items-center gap-1.5">
              <Gift className="w-3 h-3" />
              Next reward: <span className="font-semibold">{nextTier.reward}</span>
            </p>
          </div>
        ) : (
          <p className="mt-4 text-xs text-white/85 flex items-center gap-1.5">
            <Gift className="w-3 h-3" />
            Top tier unlocked — claim your <span className="font-semibold">{tier.reward}</span>
          </p>
        )}

        <Link
          href="/dashboard/student/certificates"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/95 hover:text-white"
        >
          View rewards <ArrowRight className="w-3 h-3" />
        </Link>

        <details className="mt-4 group/d">
          <summary className="cursor-pointer list-none text-[11px] text-white/70 hover:text-white/90 flex items-center gap-1 select-none">
            <span className="group-open/d:rotate-90 transition-transform inline-block">▶</span>
            Points breakdown
          </summary>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-white/80">
            <li className="flex justify-between"><span>Courses</span><span className="tabular-nums font-semibold">{breakdown.fromCourses}</span></li>
            <li className="flex justify-between"><span>Quizzes</span><span className="tabular-nums font-semibold">{breakdown.fromQuizzes}</span></li>
            <li className="flex justify-between"><span>Certs</span><span className="tabular-nums font-semibold">{breakdown.fromCerts}</span></li>
            <li className="flex justify-between"><span>Profile</span><span className="tabular-nums font-semibold">{breakdown.fromProfile}</span></li>
            <li className="flex justify-between"><span>Avg score</span><span className="tabular-nums font-semibold">{breakdown.fromScore}</span></li>
          </ul>
        </details>
      </div>
    </div>
  );
}
