import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products as fallbackProducts } from "@/data/mockData";

export const dynamic = "force-dynamic";

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function formatProduct(p: any) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice || undefined,
    priceQatar: p.priceQatar !== null && p.priceQatar !== undefined ? p.priceQatar : undefined,
    salePriceQatar: p.salePriceQatar !== null && p.salePriceQatar !== undefined ? p.salePriceQatar : undefined,
    category: p.category,
    tags: safeJsonParse<string[]>(p.tags, [p.category]),
    images: safeJsonParse<string[]>(p.images, [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    ]),
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    stockCount: p.stockCount,
    featured: p.featured,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    variantAttributes: safeJsonParse(p.variantJson, undefined),
    specifications: safeJsonParse(p.specsJson, undefined),
  };
}

export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length === 0) {
      // Return fallback products if DB empty
      return NextResponse.json(fallbackProducts);
    }

    // Format DB products into application Product interface
    const formatted = dbProducts.map(formatProduct);
    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(fallbackProducts);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const imageUrls =
      Array.isArray(body.images) && body.images.length > 0 && body.images[0]
        ? body.images
        : typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? [body.imageUrl.trim()]
        : ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"];

    const newProduct = await prisma.product.create({
      data: {
        slug,
        title: body.title,
        shortDescription: body.shortDescription || body.description?.slice(0, 100) || "",
        description: body.description || "",
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        priceQatar: body.priceQatar !== undefined && body.priceQatar !== "" && body.priceQatar !== null
          ? parseFloat(body.priceQatar)
          : body.price ? Math.max(10, Math.round(parseFloat(body.price) / 20)) : null,
        salePriceQatar: body.salePriceQatar !== undefined && body.salePriceQatar !== "" && body.salePriceQatar !== null
          ? parseFloat(body.salePriceQatar)
          : null,
        category: body.category || "necklaces",
        tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : [body.category || "jewelry", "New"]),
        images: JSON.stringify(imageUrls),
        rating: 5.0,
        reviewCount: 0,
        inStock: body.inStock !== false,
        stockCount: parseInt(body.stockCount) || 10,
        featured: !!body.featured,
        isNewArrival: true,
        isBestSeller: !!body.isBestSeller,
        variantJson: body.variantAttributes ? JSON.stringify(body.variantAttributes) : null,
        specsJson: body.specifications ? JSON.stringify(body.specifications) : null,
      },
    });

    return NextResponse.json(formatProduct(newProduct), { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
