import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteImagesConfig, defaultSiteImages } from "@/types/siteImages";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function getStoredSiteImages(): Promise<SiteImagesConfig> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: "site_images" },
    });
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      if (parsed && typeof parsed === "object") {
        return {
          ...defaultSiteImages,
          ...parsed,
        };
      }
    }
  } catch (err) {
    console.warn("Error reading site_images from DB:", err);
  }
  return defaultSiteImages;
}

async function saveSiteImages(data: Partial<SiteImagesConfig>): Promise<SiteImagesConfig | null> {
  try {
    const current = await getStoredSiteImages();
    const merged: SiteImagesConfig = {
      ...current,
      ...data,
    };
    const jsonStr = JSON.stringify(merged);
    await prisma.siteContent.upsert({
      where: { key: "site_images" },
      update: { value: jsonStr },
      create: { key: "site_images", value: jsonStr },
    });
    return merged;
  } catch (err) {
    console.error("Error saving site_images to DB:", err);
    return null;
  }
}

export async function GET() {
  const images = await getStoredSiteImages();
  return NextResponse.json(images, { headers: CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await saveSiteImages(body);
    if (!updated) {
      return NextResponse.json({ error: "Failed to persist site images to database" }, { status: 500 });
    }
    return NextResponse.json({ success: true, images: updated }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in POST /api/site-images:", err);
    return NextResponse.json({ error: err.message || "Failed to update site images" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await saveSiteImages(body);
    if (!updated) {
      return NextResponse.json({ error: "Failed to persist site images to database" }, { status: 500 });
    }
    return NextResponse.json({ success: true, images: updated }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in PUT /api/site-images:", err);
    return NextResponse.json({ error: err.message || "Failed to update site images" }, { status: 500 });
  }
}
