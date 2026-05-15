import NextAuth from "next-auth";
import { authConfig } from "@/src/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes that are accessible without authentication
const publicRoutes = [
  "/",
  "/explore",
  "/courses",
  "/internships",
  "/about",
  "/contact",
  "/pricing",
  "/mentors",
  "/live-classes",
  "/certificates",
  "/for-students",
  "/for-professionals",
  "/for-beginners",
];
const authRoutes = ["/login", "/register"];
const apiAuthPrefix = "/api/auth";

// Role-based protected routes
const roleRoutes: Record<string, string[]> = {
  ADMIN: ["/dashboard/admin"],
  MENTOR: ["/dashboard/mentor"],
  RECRUITER: ["/dashboard/recruiter"],
};

export default async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/student", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname;
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isLoggedIn && session.user.role) {
    for (const [role, routes] of Object.entries(roleRoutes)) {
      if (session.user.role !== role) {
        const isRestricted = routes.some((route) =>
          nextUrl.pathname.startsWith(route)
        );
        if (isRestricted) {
          return NextResponse.redirect(new URL("/dashboard/student", nextUrl));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
