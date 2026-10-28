import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const prod of products) {
    let desc = prod.description || "";
    let shortDesc = prod.shortDescription || "";
    let title = prod.title || "";
    let changed = false;

    if (desc.includes("316") || desc.includes("18K") || desc.includes("18k")) {
      desc = desc
        .replaceAll("surgical-grade 316L stainless steel with thick 18K gold PVD plating", "premium 304 & 306 grade stainless steel with high-grade PVD gold plating")
        .replaceAll("surgical-grade 316L stainless steel", "premium 304 & 306 grade stainless steel")
        .replaceAll("316L", "304 & 306 grade")
        .replaceAll("18K gold", "gold finish")
        .replaceAll("18k gold", "gold finish")
        .replaceAll("18K Gold", "Gold Finish")
        .replaceAll("18K", "gold");
      changed = true;
    }

    if (shortDesc.includes("316") || shortDesc.includes("18K") || shortDesc.includes("18k")) {
      shortDesc = shortDesc
        .replaceAll("surgical-grade 316L stainless steel with thick 18K gold PVD plating", "premium 304 & 306 grade stainless steel with high-grade PVD gold plating")
        .replaceAll("surgical-grade 316L stainless steel", "premium 304 & 306 grade stainless steel")
        .replaceAll("316L", "304 & 306 grade")
        .replaceAll("18K gold", "gold finish")
        .replaceAll("18k gold", "gold finish")
        .replaceAll("18K Gold", "Gold Finish")
        .replaceAll("18K", "gold");
      changed = true;
    }

    if (title.includes("18K") || title.includes("18k")) {
      title = title.replaceAll("18K Gold ", "").replaceAll("18k gold ", "").replaceAll("18K ", "").replaceAll("18k ", "");
      changed = true;
    }

    if (changed) {
      await prisma.product.update({
        where: { id: prod.id },
        data: { description: desc, shortDescription: shortDesc, title },
      });
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} products in the database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
