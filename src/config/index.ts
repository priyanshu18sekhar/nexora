export const siteConfig = {
  name: "Nexora",
  description:
    "India's skill-first learning platform — master in-demand skills, earn certificates, and build your career.",
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
  { label: "Explore", href: "/explore" },
  { label: "Courses", href: "/courses" },
  { label: "Internships", href: "/internships" },
];

export const dashboardNavLinks = {
  STUDENT: [
    { label: "Overview",      href: "/dashboard/student",              icon: "LayoutDashboard" },
    { label: "My Courses",    href: "/dashboard/student/courses",      icon: "BookOpen" },
    { label: "Progress",      href: "/dashboard/student/progress",     icon: "TrendingUp" },
    { label: "Certificates",  href: "/dashboard/student/certificates", icon: "Award" },
    { label: "Profile",       href: "/profile",                        icon: "User" },
  ],
  RECRUITER: [
    { label: "Overview",      href: "/dashboard/recruiter",                  icon: "LayoutDashboard" },
    { label: "Internships",   href: "/dashboard/recruiter/internships",      icon: "Briefcase" },
    { label: "Applications",  href: "/dashboard/recruiter/applications",     icon: "FileText" },
    { label: "Profile",       href: "/profile",                              icon: "User" },
  ],
  ADMIN: [
    { label: "Overview",      href: "/dashboard/admin",                      icon: "LayoutDashboard" },
    { label: "Courses",       href: "/dashboard/admin/courses",              icon: "BookOpen" },
    { label: "Users",         href: "/dashboard/admin/users",                icon: "Users" },
    { label: "Internships",   href: "/dashboard/admin/internships",          icon: "Briefcase" },
    { label: "Certificates",  href: "/dashboard/admin/certificates",         icon: "Award" },
    { label: "Payments",      href: "/dashboard/admin/payments",             icon: "CreditCard" },
    { label: "Analytics",     href: "/dashboard/admin/analytics",            icon: "BarChart2" },
    { label: "Settings",      href: "/dashboard/admin/settings",             icon: "Settings" },
  ],
};

export const courseCategories = [
  { id: "programming",    name: "Programming",       icon: "Code2",          color: "#6366F1" },
  { id: "ai-tools",       name: "AI Tools",          icon: "Sparkles",       color: "#8B5CF6" },
  { id: "ms-office",      name: "MS Office",         icon: "FileSpreadsheet", color: "#0EA5E9" },
  { id: "business",       name: "Business",          icon: "TrendingUp",     color: "#F59E0B" },
  { id: "communication",  name: "Communication",     icon: "MessageSquare",  color: "#10B981" },
  { id: "resume",         name: "Resume & Interview", icon: "FileUser",      color: "#F43F5E" },
  { id: "design",         name: "Design",            icon: "Palette",        color: "#EC4899" },
  { id: "data-science",   name: "Data Science",      icon: "Database",       color: "#14B8A6" },
];

export const razorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  currency: "INR",
};
