import { OPTCGCard } from "@/types";

const LIMITLESS_CDN = "https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/one-piece";

/**
 * Get card image URL for a specific language.
 * Uses Limitless TCG CDN which has both EN and JP images.
 */
export function getCardImageUrl(card: OPTCGCard, lang: "JP" | "EN" = "JP"): string {
  const setFolder = card.set_id.replace("-", "");
  const cardId = card.card_image_id || card.card_set_id;
  return `${LIMITLESS_CDN}/${setFolder}/${cardId}_${lang}.webp`;
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
