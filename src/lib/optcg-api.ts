import { OPTCGCard, OPTCGSet } from "@/types";

const BASE_URL = "https://optcgapi.com/api";
const LIMITLESS_CDN = "https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/one-piece";

/**
 * Get card image URL for a specific language.
 * Uses Limitless TCG CDN which has both EN and JP images.
 * Falls back to optcgapi.com EN image if needed.
 */
export function getCardImageUrl(card: OPTCGCard, lang: "JP" | "EN" = "JP"): string {
  // card_set_id = "OP01-006", set_id = "OP-01"
  // CDN pattern: /one-piece/OP01/OP01-006_JP.webp
  const setFolder = card.set_id.replace("-", ""); // "OP-01" -> "OP01"
  const cardId = card.card_image_id || card.card_set_id;
  return `${LIMITLESS_CDN}/${setFolder}/${cardId}_${lang}.webp`;
}

export async function getAllSets(): Promise<OPTCGSet[]> {
  const res = await fetch(`${BASE_URL}/allSets/`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch sets");
  return res.json();
}

export async function getSetCards(setId: string): Promise<OPTCGCard[]> {
  const res = await fetch(`${BASE_URL}/sets/${setId}/`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch cards for ${setId}`);
  return res.json();
}

export async function getCard(cardId: string): Promise<OPTCGCard[]> {
  const res = await fetch(`${BASE_URL}/sets/card/${cardId}/`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch card ${cardId}`);
  return res.json();
}

export const RARITY_LABELS: Record<string, string> = {
  L: "Leader",
  C: "Common",
  UC: "Uncommon",
  R: "Rare",
  SR: "Super Rare",
  SEC: "Secret Rare",
  SP: "Special",
  P: "Promo",
  TR: "Treasure Rare",
};

export const COLOR_MAP: Record<string, string> = {
  Red: "#e74c3c",
  Blue: "#3498db",
  Green: "#27ae60",
  Purple: "#8e44ad",
  Black: "#2c3e50",
  Yellow: "#f1c40f",
};

export function getRarityColor(rarity: string): string {
  const map: Record<string, string> = {
    L: "#ffd700",
    C: "#95a5a6",
    UC: "#7f8c8d",
    R: "#3498db",
    SR: "#e74c3c",
    SEC: "#9b59b6",
    SP: "#e91e63",
    P: "#ff9800",
    TR: "#ffd700",
  };
  return map[rarity] || "#95a5a6";
}
