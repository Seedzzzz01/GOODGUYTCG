import prisma from "@/lib/db";
import { OPTCGCard } from "@/types";

/** Map DB Card to OPTCGCard type used by components */
function toOPTCGCard(card: {
  id: string;
  cardSetId: string;
  cardImageId: string;
  name: string;
  setName: string;
  cardText: string;
  rarity: string;
  color: string;
  cardType: string;
  life: string | null;
  cost: string | null;
  power: string | null;
  subTypes: string;
  counterAmount: number | null;
  attribute: string;
  marketPrice: number | null;
  inventoryPrice: number | null;
  cardImage: string;
}): OPTCGCard {
  return {
    card_set_id: card.id,
    card_name: card.name,
    set_id: card.cardSetId,
    set_name: card.setName,
    card_text: card.cardText,
    rarity: card.rarity,
    card_color: card.color,
    card_type: card.cardType,
    life: card.life,
    card_cost: card.cost,
    card_power: card.power,
    sub_types: card.subTypes,
    counter_amount: card.counterAmount,
    attribute: card.attribute,
    market_price: card.marketPrice,
    inventory_price: card.inventoryPrice,
    card_image_id: card.cardImageId,
    card_image: card.cardImage,
  };
}

export async function getSetCards(setId: string): Promise<OPTCGCard[]> {
  // Handle OP-14/OP-15 → OP14-EB04 mapping
  let queryId = setId;
  if (setId === "OP-14" || setId === "OP-15") queryId = "OP14-EB04";

  const cards = await prisma.card.findMany({
    where: { cardSetId: queryId },
    orderBy: { id: "asc" },
  });
  return cards.map(toOPTCGCard);
}

export async function getCard(cardId: string): Promise<OPTCGCard[]> {
  const cards = await prisma.card.findMany({
    where: { id: cardId },
  });
  return cards.map(toOPTCGCard);
}

export async function searchCards(query: string): Promise<OPTCGCard[]> {
  const cards = await prisma.card.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { id: { contains: query, mode: "insensitive" } },
        { subTypes: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 50,
    orderBy: { id: "asc" },
  });
  return cards.map(toOPTCGCard);
}

export async function getAllCards(): Promise<OPTCGCard[]> {
  const cards = await prisma.card.findMany({
    orderBy: { id: "asc" },
  });
  return cards.map(toOPTCGCard);
}

export async function getPremiumCards(cardIds: string[]): Promise<OPTCGCard[]> {
  const cards = await prisma.card.findMany({
    where: { id: { in: cardIds } },
    orderBy: { marketPrice: "desc" },
  });
  return cards.map(toOPTCGCard);
}
