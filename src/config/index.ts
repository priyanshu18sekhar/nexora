export const siteConfig = {
  name: "Nexora",
  description:
    "Modern platform for internships, skill development, and learning — built for students, professionals, and lifelong learners.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.jpg",
  links: {
    twitter: "https://twitter.com/nexora",
    github: "https://github.com/nexora",
    linkedin: "https://linkedin.com/company/nexora",
  },
  contact: {
    email: "hello@nexora.io",
    support: "support@nexora.io",
  },
};

export const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Internships", href: "/internships" },
  { label: "Mentors", href: "/mentors" },
  { label: "Certificates", href: "/certificates" },
  { label: "Pricing", href: "/pricing" },
];

export const dashboardNavLinks = {
  STUDENT: [
    { label: "Overview", href: "/dashboard/student", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/dashboard/student/courses", icon: "BookOpen" },
    { label: "Internships", href: "/dashboard/student/internships", icon: "Briefcase" },
    { label: "Progress", href: "/dashboard/student/progress", icon: "TrendingUp" },
    { label: "Certificates", href: "/dashboard/student/certificates", icon: "Award" },
    { label: "Bookmarks", href: "/dashboard/student/bookmarks", icon: "Bookmark" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  MENTOR: [
    { label: "Overview", href: "/dashboard/mentor", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/dashboard/mentor/courses", icon: "BookOpen" },
    { label: "Students", href: "/dashboard/mentor/students", icon: "Users" },
    { label: "Sessions", href: "/dashboard/mentor/sessions", icon: "Calendar" },
    { label: "Revenue", href: "/dashboard/mentor/revenue", icon: "DollarSign" },
    { label: "Analytics", href: "/dashboard/mentor/analytics", icon: "BarChart2" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  RECRUITER: [
    { label: "Overview", href: "/dashboard/recruiter", icon: "LayoutDashboard" },
    { label: "Internships", href: "/dashboard/recruiter/internships", icon: "Briefcase" },
    { label: "Applications", href: "/dashboard/recruiter/applications", icon: "FileText" },
    { label: "Candidates", href: "/dashboard/recruiter/candidates", icon: "Users" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: "LayoutDashboard" },
    { label: "Users", href: "/dashboard/admin/users", icon: "Users" },
    { label: "Courses", href: "/dashboard/admin/courses", icon: "BookOpen" },
    { label: "Internships", href: "/dashboard/admin/internships", icon: "Briefcase" },
    { label: "Payments", href: "/dashboard/admin/payments", icon: "CreditCard" },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: "BarChart2" },
    { label: "Settings", href: "/dashboard/admin/settings", icon: "Settings" },
  ],
};

export const courseCategories = [
  { id: "programming", name: "Programming", icon: "Code2", color: "#6366F1" },
  { id: "ai-tools", name: "AI Tools", icon: "Sparkles", color: "#8B5CF6" },
  { id: "ms-office", name: "MS Office", icon: "FileSpreadsheet", color: "#0EA5E9" },
  { id: "business", name: "Business", icon: "TrendingUp", color: "#F59E0B" },
  { id: "communication", name: "Communication", icon: "MessageSquare", color: "#10B981" },
  { id: "resume", name: "Resume & Interview", icon: "FileUser", color: "#F43F5E" },
  { id: "design", name: "Design", icon: "Palette", color: "#EC4899" },
  { id: "data-science", name: "Data Science", icon: "Database", color: "#14B8A6" },
];

export const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  currency: "USD",
  intent: "capture" as const,
};
