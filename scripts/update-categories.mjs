import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let count = 0;

  for (const prod of products) {
    const title = (prod.title || "").toLowerCase();
    let newCategory = prod.category;

    if (title.includes("bangle") || title.includes("kada") || title.includes("cuff")) {
      newCategory = "bangles-kada";
    } else if (title.includes("kid") || title.includes("child")) {
      newCategory = "kids-collection";
    } else if (title.includes("watch")) {
      newCategory = "watches";
    } else if (title.includes("hip chain") || title.includes("waist chain")) {
      newCategory = "hip-chains";
    } else if (title.includes("anklet")) {
      newCategory = "anklets";
    } else if (title.includes("necklace") || title.includes("chain") || title.includes("pendant")) {
      newCategory = "necklaces-and-chains";
    } else if (title.includes("earring") || title.includes("stud") || title.includes("hoop")) {
      newCategory = "earrings";
    } else if (title.includes("ring") || title.includes("band")) {
      newCategory = "rings";
    } else if (title.includes("bracelet")) {
      newCategory = "bracelets";
    }

    if (newCategory !== prod.category) {
      await prisma.product.update({
        where: { id: prod.id },
        data: { category: newCategory },
      });
      count++;
    }
  }

  console.log(`Updated ${count} products to modern category taxonomy!`);
  const catSummary = await prisma.product.groupBy({
    by: ["category"],
    _count: { id: true },
  });
  console.log("Updated category breakdown in DB:", catSummary);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
