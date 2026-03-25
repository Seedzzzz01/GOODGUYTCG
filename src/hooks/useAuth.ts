"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";
import { getRankBySpent } from "@/lib/constants";

export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user ?? null;

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        return { success: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
      }
      return { success: true };
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error };
      }
      // Auto sign-in after registration
      return login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const bountyRank = user ? getRankBySpent(user.totalSpent ?? 0) : null;
  const isAdmin = user?.role === "ADMIN";

  return {
    user: user
      ? {
          id: user.id,
          email: user.email ?? "",
          displayName: user.displayName ?? user.name ?? "",
          phone: "",
          lineId: "",
          avatarUrl: user.image ?? "",
          totalSpent: user.totalSpent ?? 0,
          orderCount: user.orderCount ?? 0,
          role: (user.role?.toLowerCase() ?? "customer") as "customer" | "admin",
          createdAt: "",
        }
      : null,
    loading,
    login,
    register,
    logout,
    updateProfile: () => {}, // TODO: implement via API
    bountyRank,
    isAdmin,
    isLoggedIn: !!user,
  };
}
