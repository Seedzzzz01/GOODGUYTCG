import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js config WITHOUT the Prisma adapter.
 * Used by middleware (Edge runtime) which can't import Prisma.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is defined in the full auth.ts, not here
      authorize: () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "ADMIN";
      const { pathname } = nextUrl;

      // Admin routes
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        return isLoggedIn && isAdmin;
      }

      // Protected routes
      if (
        pathname.startsWith("/profile") ||
        pathname.startsWith("/checkout")
      ) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role as string;
        token.totalSpent = (user as Record<string, unknown>).totalSpent as number;
        token.orderCount = (user as Record<string, unknown>).orderCount as number;
        token.displayName = (user as Record<string, unknown>).displayName as string;
        token.referredById = (user as Record<string, unknown>).referredById as string | null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.totalSpent = token.totalSpent as number;
        session.user.orderCount = token.orderCount as number;
        session.user.displayName = token.displayName as string;
        session.user.referredById = token.referredById as string | null;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
