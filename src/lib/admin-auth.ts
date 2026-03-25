import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Verify the request is from an authenticated admin user.
 * Returns the session if valid, or a 401/403 NextResponse if not.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session };
}

/**
 * Verify the request is from an authenticated user (any role).
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { session };
}
