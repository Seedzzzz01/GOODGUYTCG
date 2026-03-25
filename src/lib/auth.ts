import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcryptjs";
import prisma from "./db";
import { authConfig } from "./auth.config";
import { rateLimit } from "./rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate limit: 10 login attempts per email per 15 minutes
        const rl = rateLimit(`login:${credentials.email}`, 10, 15 * 60 * 1000);
        if (rl.limited) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = compareSync(
          credentials.password as string,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName || user.name,
          image: user.avatarUrl || user.image,
          role: user.role,
          totalSpent: user.totalSpent,
          orderCount: user.orderCount,
          displayName: user.displayName,
          referredById: user.referredById,
        };
      },
    }),
  ],
});
