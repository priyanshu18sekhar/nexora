export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  thumbnail?: string | null;
  previewVideo?: string | null;
  price: number;
  isFree: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags: string[];
  language: string;
  duration?: number | null;
  totalLessons: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  instructorId: string;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  order: number;
  isFree: boolean;
  sectionId: string;
  resources?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
}

export interface Internship {
  id: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string | null;
  description: string;
  requirements?: string | null;
  location: string;
  isRemote: boolean;
  stipend?: number | null;
  duration: string;
  skills: string[];
  status: "OPEN" | "CLOSED" | "FILLED";
  deadline?: Date | null;
  openings: number;
  categoryId?: string | null;
  recruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  bio?: string | null;
  headline?: string | null;
  location?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  skills: string[];
  isVerified: boolean;
  createdAt: Date;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface DashboardStats {
  totalCourses?: number;
  totalStudents?: number;
  totalRevenue?: number;
  totalInternships?: number;
  totalApplications?: number;
  completionRate?: number;
  activeEnrollments?: number;
  certificatesEarned?: number;
}
