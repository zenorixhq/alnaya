import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(formatProduct(product));
  } catch (err: any) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const imageUrls =
      Array.isArray(body.images) && body.images.length > 0 && body.images[0]
        ? body.images
        : typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? [body.imageUrl.trim()]
        : undefined;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        priceQatar: body.priceQatar !== undefined && body.priceQatar !== "" && body.priceQatar !== null
          ? parseFloat(body.priceQatar)
          : body.price ? Math.max(10, Math.round(parseFloat(body.price) / 20)) : null,
        salePriceQatar: body.salePriceQatar !== undefined && body.salePriceQatar !== "" && body.salePriceQatar !== null
          ? parseFloat(body.salePriceQatar)
          : null,
        category: body.category,
        stockCount: parseInt(body.stockCount) || 0,
        inStock: (parseInt(body.stockCount) || 0) > 0,
        featured: !!body.featured,
        isBestSeller: !!body.isBestSeller,
        isNewArrival: !!body.isNewArrival,
        images: imageUrls ? JSON.stringify(imageUrls) : undefined,
      },
    });

    return NextResponse.json(formatProduct(updated));
  } catch (err: any) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: any) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
