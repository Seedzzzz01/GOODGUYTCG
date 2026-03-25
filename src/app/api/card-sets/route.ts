import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const sets = await prisma.cardSet.findMany({
    orderBy: { id: "asc" },
  });

  // Map to OPTCGSet format
  const result = sets.map((s) => ({
    set_id: s.id,
    set_name: s.name,
  }));

  return NextResponse.json(result);
}
