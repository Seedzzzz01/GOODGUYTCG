import { OPTCGCard } from "@/types";

// Local data — downloaded from OPTCG API
import cards_op_01 from "@/data/cards_op_01.json";
import cards_op_02 from "@/data/cards_op_02.json";
import cards_op_03 from "@/data/cards_op_03.json";
import cards_op_04 from "@/data/cards_op_04.json";
import cards_op_05 from "@/data/cards_op_05.json";
import cards_op_06 from "@/data/cards_op_06.json";
import cards_op_07 from "@/data/cards_op_07.json";
import cards_op_08 from "@/data/cards_op_08.json";
import cards_op_09 from "@/data/cards_op_09.json";
import cards_op_10 from "@/data/cards_op_10.json";
import cards_op_11 from "@/data/cards_op_11.json";
import cards_op_12 from "@/data/cards_op_12.json";
import cards_op_13 from "@/data/cards_op_13.json";
import cards_op14_eb04 from "@/data/cards_op14_eb04.json";
import cards_eb_01 from "@/data/cards_eb_01.json";
import cards_eb_02 from "@/data/cards_eb_02.json";
import cards_eb_03 from "@/data/cards_eb_03.json";
import cards_prb_01 from "@/data/cards_prb_01.json";
import cards_prb_02 from "@/data/cards_prb_02.json";

const CARDS_MAP: Record<string, OPTCGCard[]> = {
  "OP-01": cards_op_01 as OPTCGCard[],
  "OP-02": cards_op_02 as OPTCGCard[],
  "OP-03": cards_op_03 as OPTCGCard[],
  "OP-04": cards_op_04 as OPTCGCard[],
  "OP-05": cards_op_05 as OPTCGCard[],
  "OP-06": cards_op_06 as OPTCGCard[],
  "OP-07": cards_op_07 as OPTCGCard[],
  "OP-08": cards_op_08 as OPTCGCard[],
  "OP-09": cards_op_09 as OPTCGCard[],
  "OP-10": cards_op_10 as OPTCGCard[],
  "OP-11": cards_op_11 as OPTCGCard[],
  "OP-12": cards_op_12 as OPTCGCard[],
  "OP-13": cards_op_13 as OPTCGCard[],
  "OP14-EB04": cards_op14_eb04 as OPTCGCard[],
  "EB-01": cards_eb_01 as OPTCGCard[],
  "EB-02": cards_eb_02 as OPTCGCard[],
  "EB-03": cards_eb_03 as OPTCGCard[],
  "PRB-01": cards_prb_01 as OPTCGCard[],
  "PRB-02": cards_prb_02 as OPTCGCard[],
};

// All cards flattened
const ALL_CARDS: OPTCGCard[] = Object.values(CARDS_MAP).flat();

export function getLocalSetCards(setId: string): OPTCGCard[] {
  // Try exact match first
  if (CARDS_MAP[setId]) return CARDS_MAP[setId];
  // Try OP-14 -> OP14-EB04 mapping
  if (setId === "OP-14" || setId === "OP-15") return CARDS_MAP["OP14-EB04"] || [];
  return [];
}

export function getLocalCard(cardId: string): OPTCGCard[] {
  return ALL_CARDS.filter((c) => c.card_set_id === cardId);
}

export function searchCards(query: string): OPTCGCard[] {
  const q = query.toLowerCase();
  return ALL_CARDS.filter(
    (c) =>
      c.card_name.toLowerCase().includes(q) ||
      c.card_set_id.toLowerCase().includes(q) ||
      c.sub_types.toLowerCase().includes(q)
  ).slice(0, 50);
}

export { ALL_CARDS };
