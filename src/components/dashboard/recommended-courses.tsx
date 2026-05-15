import Link from "next/link";
import { Star, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/src/lib/db";

interface RecommendedCoursesProps {
  userId: string;
  userSkills: string[];
  enrolledCourseIds: string[];
}

const FALLBACK_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-purple-600 to-pink-700",
  "from-blue-600 to-cyan-700",
  "from-emerald-600 to-teal-700",
];

export async function RecommendedCourses({ userId: _userId, userSkills, enrolledCourseIds }: RecommendedCoursesProps) {
  let candidates: Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    price: number;
    isFree: boolean;
    rating: number;
    totalStudents: number;
    tags: string[];
    category: { name: string } | null;
  }> = [];

  try {
    candidates = await db.course.findMany({
      where: {
        status: "PUBLISHED",
        id: { notIn: enrolledCourseIds.length ? enrolledCourseIds : ["__none__"] },
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        price: true,
        isFree: true,
        rating: true,
        totalStudents: true,
        tags: true,
        category: { select: { name: true } },
      },
      take: 12,
    });
  } catch (err) {
    console.error("Failed to fetch recommendations:", err);
  }

  // Score by skill overlap
  const lowerSkills = userSkills.map((s) => s.toLowerCase());
  const scored = candidates
    .map((c) => {
      const tagHits = c.tags.filter((t) =>
        lowerSkills.some((s) => t.toLowerCase().includes(s) || s.includes(t.toLowerCase()))
      ).length;
      return { ...c, score: tagHits * 10 + c.rating * 2 + Math.min(c.totalStudents / 1000, 10) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scored.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-wider font-semibold text-primary">For you</span>
          </div>
          <h2 className="text-lg font-bold font-display">Recommended next</h2>
        </div>
        <Link href="/courses" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1">
          See all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scored.map((c, i) => {
          const grad = FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length];
          return (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className={`aspect-[16/10] relative bg-gradient-to-br ${grad} overflow-hidden`}>
                {c.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.thumbnail} alt={c.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-9 h-9 text-white/40 group-hover:scale-110 transition-transform" />
                  </div>
                )}
                {c.category && (
                  <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md">
                    {c.category.name}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-xs line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors min-h-[2.2rem]">
                  {c.title}
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-foreground">{c.rating.toFixed(1)}</span>
                  </span>
                  <span className="font-bold text-primary">
                    {c.isFree || c.price === 0 ? "Free" : `₹${c.price}`}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
