import { NextResponse } from "next/server";
import { getSetCards, getCard, searchCards, getPremiumCards } from "@/lib/card-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const setId = searchParams.get("setId");
  const cardId = searchParams.get("cardId");
  const query = searchParams.get("q");
  const ids = searchParams.get("ids");

  // Get cards by specific IDs (for PremiumCards)
  if (ids) {
    const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
    const cards = await getPremiumCards(idList);
    return NextResponse.json(cards);
  }

  // Get cards by set
  if (setId) {
    const cards = await getSetCards(setId);
    return NextResponse.json(cards);
  }

  // Get single card
  if (cardId) {
    const cards = await getCard(cardId);
    return NextResponse.json(cards);
  }

  // Search
  if (query) {
    const cards = await searchCards(query);
    return NextResponse.json(cards);
  }

  return NextResponse.json({ error: "Provide setId, cardId, ids, or q parameter" }, { status: 400 });
}
