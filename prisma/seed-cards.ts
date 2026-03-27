/**
 * Seed card data from JSON files into the database.
 * Run: npx tsx prisma/seed-cards.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface RawCard {
  card_set_id: string;
  card_name: string;
  set_id: string;
  set_name: string;
  card_text: string;
  rarity: string;
  card_color: string;
  card_type: string;
  life: string | null;
  card_cost: string | null;
  card_power: string | null;
  sub_types: string;
  counter_amount: number | null;
  attribute: string;
  card_image_id: string;
  card_image: string;
  market_price: number | null;
  inventory_price: number | null;
}

async function main() {
  console.log("🗑️  Clearing existing card data...");
  await prisma.card.deleteMany();
  await prisma.cardSet.deleteMany();

  // Find all card JSON files
  const dataDir = path.join(process.cwd(), "src", "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.startsWith("cards_") && f.endsWith(".json"));
  console.log(`📁 Found ${files.length} card files`);

  // Pass 1: collect all sets
  const setsMap = new Map<string, string>();
  const allCards: RawCard[] = [];

  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
    const cards: RawCard[] = JSON.parse(raw);
    for (const c of cards) {
      if (c.set_id && !setsMap.has(c.set_id)) {
        setsMap.set(c.set_id, c.set_name);
      }
      allCards.push(c);
    }
  }

  // Deduplicate within each set, but allow same card_set_id across different sets
  // Use composite key: set_id + card_set_id + card_image_id
  const seen = new Set<string>();
  const uniqueCards = allCards.filter((c) => {
    const key = `${c.set_id}::${c.card_set_id}::${c.card_image_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`🃏 ${allCards.length} total → ${uniqueCards.length} unique cards`);
  console.log(`📦 ${setsMap.size} sets`);

  // Create sets
  for (const [id, name] of setsMap) {
    await prisma.cardSet.create({ data: { id, name } });
  }
  console.log(`✅ Created ${setsMap.size} sets`);

  // Batch insert cards (chunks of 500)
  const BATCH = 500;
  for (let i = 0; i < uniqueCards.length; i += BATCH) {
    const batch = uniqueCards.slice(i, i + BATCH);
    await prisma.card.createMany({
      data: batch.map((c) => {
        // Use composite ID (set_id + card_image_id) to preserve all versions across sets
        const imgId = c.card_image_id || c.card_set_id;
        const id = `${c.set_id}::${imgId}`;
        return {
        id,
        cardSetId: c.set_id,
        cardImageId: c.card_image_id || c.card_set_id,
        name: c.card_name,
        setName: c.set_name,
        cardText: c.card_text || "",
        rarity: c.rarity,
        color: c.card_color || "",
        cardType: c.card_type || "",
        life: c.life,
        cost: c.card_cost,
        power: c.card_power,
        subTypes: c.sub_types || "",
        counterAmount: c.counter_amount,
        attribute: c.attribute || "",
        marketPrice: c.market_price,
        inventoryPrice: c.inventory_price,
        cardImage: c.card_image || "",
      };
      }),
      skipDuplicates: true,
    });
    console.log(`  📝 Inserted ${Math.min(i + BATCH, uniqueCards.length)}/${uniqueCards.length}`);
  }

  console.log(`\n✅ Done! ${uniqueCards.length} cards in ${setsMap.size} sets`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
