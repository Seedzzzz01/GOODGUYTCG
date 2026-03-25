import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the lightweight config (no Prisma) for Edge middleware
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/api/admin/:path*",
  ],
};
