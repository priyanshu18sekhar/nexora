import React from "react";
import Link from "next/link";
import {
  Sparkles, Star, BookOpen, Briefcase, ArrowRight, MapPin, Clock,
  IndianRupee, Code2, FileSpreadsheet, MessageSquare, TrendingUp,
  Database, Palette, FileText, Building,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { db } from "@/src/lib/db";
import { Aurora } from "@/src/components/effects/aurora";
import { AnimatedGrid } from "@/src/components/effects/animated-grid";
import { Spotlight } from "@/src/components/effects/spotlight";
import { formatRelativeTime } from "@/src/lib/utils";

const CERTIFICATE_FEE_INR = 299;

const CATEGORY_TILES = [
  { name: "Programming",   icon: Code2,           color: "from-violet-500 to-indigo-600", slug: "programming" },
  { name: "AI Tools",      icon: Sparkles,        color: "from-purple-500 to-pink-600",   slug: "ai-tools" },
  { name: "MS Office",     icon: FileSpreadsheet, color: "from-blue-500 to-cyan-600",     slug: "ms-office" },
  { name: "Business",      icon: TrendingUp,      color: "from-amber-500 to-orange-600",  slug: "business" },
  { name: "Communication", icon: MessageSquare,   color: "from-emerald-500 to-teal-600",  slug: "communication" },
  { name: "Resume Prep",   icon: FileText,        color: "from-red-500 to-rose-600",      slug: "resume" },
  { name: "Data Science",  icon: Database,        color: "from-teal-500 to-cyan-600",     slug: "data-science" },
  { name: "Design",        icon: Palette,         color: "from-pink-500 to-rose-600",     slug: "design" },
];

const COURSE_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-purple-600 to-pink-700",
  "from-blue-600 to-cyan-700",
  "from-emerald-600 to-teal-700",
  "from-amber-600 to-orange-700",
  "from-rose-600 to-pink-700",
];

const MOCK_FREE_COURSES = [
  { id: "mock-free-1", title: "Python for Absolute Beginners", price: 0, isFree: true, rating: 4.9, totalStudents: 12400, category: { name: "Programming" } as { name: string } | null, instructor: { name: "Nexora Team" } },
  { id: "mock-free-2", title: "AI Tools Crash Course",         price: 0, isFree: true, rating: 4.8, totalStudents: 8700,  category: { name: "AI Tools" }    as { name: string } | null, instructor: { name: "Nexora Team" } },
  { id: "mock-free-3", title: "Resume That Gets You Hired",    price: 0, isFree: true, rating: 4.9, totalStudents: 5400,  category: { name: "Resume Prep" } as { name: string } | null, instructor: { name: "Nexora Team" } },
  { id: "mock-free-4", title: "Excel Foundations",             price: 0, isFree: true, rating: 4.7, totalStudents: 15200, category: { name: "MS Office" }   as { name: string } | null, instructor: { name: "Nexora Team" } },
];

const MOCK_PAID_COURSES = [
  { id: "mock-paid-1", title: "Complete Python Developer 2024", price: 999,  isFree: false, rating: 4.8, totalStudents: 12400, category: { name: "Programming" } as { name: string } | null, instructor: { name: "Sarah Connor" } },
  { id: "mock-paid-2", title: "Data Science with Python",       price: 1999, isFree: false, rating: 4.8, totalStudents: 28000, category: { name: "Data Science" }as { name: string } | null, instructor: { name: "Nexora Team" } },
  { id: "mock-paid-3", title: "UI/UX Masterclass",              price: 1499, isFree: false, rating: 4.9, totalStudents: 22000, category: { name: "Design" }      as { name: string } | null, instructor: { name: "Alex Rivera" } },
  { id: "mock-paid-4", title: "Interview Prep Bootcamp",        price: 1299, isFree: false, rating: 4.9, totalStudents: 6800,  category: { name: "Resume Prep" } as { name: string } | null, instructor: { name: "Career Coach" } },
];

const MOCK_INTERNSHIPS = [
  { id: "mock-int-1", title: "Software Engineering Intern", company: "TechNova Solutions", location: "Bangalore", isRemote: true,  stipend: 25000, duration: "3 Months", skills: ["React", "Node.js"],     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: "mock-int-2", title: "Product Design Intern",       company: "CreativeFlow",      location: "Remote",    isRemote: true,  stipend: 20000, duration: "6 Months", skills: ["Figma", "UI/UX"],       createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "mock-int-3", title: "Data Analyst Intern",         company: "Insight Labs",      location: "Mumbai",    isRemote: false, stipend: 18000, duration: "4 Months", skills: ["Python", "SQL"],        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
];

export default async function ExplorePage() {
  let freeCourses: typeof MOCK_FREE_COURSES = [];
  let paidCourses: typeof MOCK_PAID_COURSES = [];
  let internships: typeof MOCK_INTERNSHIPS = [];

  try {
    const [free, paid, intern] = await Promise.all([
      db.course.findMany({
        where: { status: "PUBLISHED", isFree: true },
        include: { category: { select: { name: true } }, instructor: { select: { name: true } } },
        orderBy: { totalStudents: "desc" },
        take: 4,
      }),
      db.course.findMany({
        where: { status: "PUBLISHED", isFree: false },
        include: { category: { select: { name: true } }, instructor: { select: { name: true } } },
        orderBy: { totalStudents: "desc" },
        take: 4,
      }),
      db.internship.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);
    freeCourses = free as unknown as typeof MOCK_FREE_COURSES;
    paidCourses = paid as unknown as typeof MOCK_PAID_COURSES;
    internships = intern as unknown as typeof MOCK_INTERNSHIPS;
  } catch (err) {
    console.error("Failed to fetch explore data:", err);
  }

  const displayFree = freeCourses.length > 0 ? freeCourses : MOCK_FREE_COURSES;
  const displayPaid = paidCourses.length > 0 ? paidCourses : MOCK_PAID_COURSES;
  const displayInt = internships.length > 0 ? internships : MOCK_INTERNSHIPS;

  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <Aurora className="opacity-60" />
        <AnimatedGrid />
        <Spotlight />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-semibold tracking-wide mb-5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Discover your next step
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 leading-[1.05]">
            Explore <span className="gradient-text-hero">courses & internships</span>
          </h1>
          <p className="text-foreground/60 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Free courses to learn the basics. Paid certificates for proof. Real internships from India&apos;s top companies.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Free courses",         href: "#free-courses",   icon: BookOpen },
              { label: "Premium courses",      href: "#paid-courses",   icon: Star },
              { label: "Internships",          href: "#internships",    icon: Briefcase },
              { label: "Categories",           href: "#categories",     icon: Sparkles },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
              >
                <c.icon className="w-3.5 h-3.5" />
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Free Courses */}
      <section id="free-courses" className="py-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                100% free — start learning today
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Free courses</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Learn the basics at zero cost. Pay <span className="font-semibold text-foreground">₹{CERTIFICATE_FEE_INR}</span> only if you want the verified certificate.
              </p>
            </div>
            <Link href="/courses?free=1" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              See all free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayFree.map((c, i) => {
              const grad = COURSE_GRADIENTS[i % COURSE_GRADIENTS.length];
              return (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="group rounded-2xl border border-emerald-500/20 bg-card overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all"
                >
                  <div className={`aspect-[16/10] relative bg-gradient-to-br ${grad} overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-20" />
                    <BookOpen className="absolute inset-0 m-auto w-12 h-12 text-white/30 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-emerald-500/90 text-white shadow">
                      Free
                    </span>
                    {c.category?.name && (
                      <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md">
                        {c.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                      {c.title}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 truncate">{c.instructor.name}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-foreground">{c.rating?.toFixed(1) ?? "—"}</span>
                      </span>
                      <span className="font-bold text-emerald-600">Free + ₹{CERTIFICATE_FEE_INR} cert</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Paid Courses */}
      <section id="paid-courses" className="py-12 section-tinted scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3 h-3 fill-current" />
                Premium · certificate included
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Top paid courses</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Hand-picked deep-dives. Certificate auto-issued the moment you finish.
              </p>
            </div>
            <Link href="/courses?paid=1" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayPaid.map((c, i) => {
              const grad = COURSE_GRADIENTS[(i + 2) % COURSE_GRADIENTS.length];
              return (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all"
                >
                  <div className={`aspect-[16/10] relative bg-gradient-to-br ${grad} overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-20" />
                    <BookOpen className="absolute inset-0 m-auto w-12 h-12 text-white/30 group-hover:scale-110 transition-transform" />
                    {c.category?.name && (
                      <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md">
                        {c.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                      {c.title}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 truncate">{c.instructor.name}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-foreground">{c.rating?.toFixed(1) ?? "—"}</span>
                      </span>
                      <span className="font-bold text-primary">₹{c.price}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internships */}
      <section id="internships" className="py-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase className="w-3 h-3" />
                Hiring now
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Featured internships</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Apply directly to recruiters. ₹499 program fee — refundable if not shortlisted in 14 days.
              </p>
            </div>
            <Link href="/internships" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              All internships <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {displayInt.map((i) => (
              <Link
                key={i.id}
                href={`/internships/${i.id}`}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-blue-500/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-primary/70" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-0.5">{i.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{i.company}</p>
                  </div>
                  {i.isRemote && (
                    <Badge variant="success" className="text-[10px] flex-shrink-0">Remote</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{i.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{i.duration}</span>
                  <span className="flex items-center gap-1 font-bold text-foreground/85">
                    <IndianRupee className="w-3 h-3" />
                    {i.stipend ? `${i.stipend.toLocaleString()}/mo` : "Unpaid"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {i.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground/70 font-medium">{s}</span>
                  ))}
                  {i.skills.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">+{i.skills.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Posted {formatRelativeTime(i.createdAt)}
                  </span>
                  <span className="text-xs text-primary font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Apply <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-12 section-tinted scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              Browse by topic
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Pick your category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORY_TILES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="group relative overflow-hidden p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all"
              >
                <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-25 blur-2xl transition-opacity`} />
                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="relative font-bold text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-bg-hero p-8 sm:p-10 text-white text-center">
            <div className="absolute inset-0 bg-dot-pattern opacity-15" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-44 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold font-display mb-3">
                Free to learn. Certified when you&apos;re ready.
              </h3>
              <p className="text-white/80 text-sm max-w-md mx-auto mb-6">
                Start any free course at zero cost. Pay only ₹{CERTIFICATE_FEE_INR} when you complete it and want the verified certificate to share with employers.
              </p>
              <Link
                href="#free-courses"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-2xl bg-white text-primary font-bold text-sm shadow-xl hover:bg-white/90 transition-colors"
              >
                Browse free courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
