import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "STUDENT" | "PROFESSIONAL" | "MENTOR" | "RECRUITER" | "ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      // user is only available the first time a user signs in
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
