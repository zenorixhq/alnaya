import { PrismaClient } from "@prisma/client";
import { categories } from "../data/mockData";
import clientReviews from "../data/clientReviews.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SiteContent" (
      "key" TEXT PRIMARY KEY,
      "value" TEXT NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(
    `INSERT INTO "SiteContent" ("key", "value", "updatedAt")
     VALUES ('site_categories', $1, CURRENT_TIMESTAMP)
     ON CONFLICT ("key")
     DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = CURRENT_TIMESTAMP;`,
    JSON.stringify(categories)
  );

  await prisma.$executeRawUnsafe(
    `INSERT INTO "SiteContent" ("key", "value", "updatedAt")
     VALUES ('client_reviews', $1, CURRENT_TIMESTAMP)
     ON CONFLICT ("key")
     DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = CURRENT_TIMESTAMP;`,
    JSON.stringify(clientReviews)
  );

  console.log("Successfully seeded site_categories (12 categories) & client_reviews to Neon!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
