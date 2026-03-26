-- AlterTable: Allow guest orders (userId optional)
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- AddColumn: Guest contact info
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "guestEmail" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "guestPhone" TEXT NOT NULL DEFAULT '';
