import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dataFilePath = path.join(process.cwd(), "data", "clientReviews.json");

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function getInitialData() {
  return {
    reviews: [],
    videoReels: [],
    feedbackScreenshots: [],
    instagramVideos: [],
  };
}

function sanitizeData(parsed: any) {
  if (!parsed || typeof parsed !== "object") return getInitialData();
  if (!Array.isArray(parsed.reviews)) parsed.reviews = [];
  if (!Array.isArray(parsed.videoReels)) parsed.videoReels = [];
  if (!Array.isArray(parsed.feedbackScreenshots)) parsed.feedbackScreenshots = [];
  if (!Array.isArray(parsed.instagramVideos)) parsed.instagramVideos = [];
  return parsed;
}

async function readData() {
  let fileData = getInitialData();
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, "utf8");
      fileData = sanitizeData(JSON.parse(content));
    }
  } catch (e) {
    console.error("Error reading fallback clientReviews.json:", e);
  }

  // 1. Try reading from Neon PostgreSQL database
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: "client_reviews" },
    });
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      const sanitized = sanitizeData(parsed);
      if (!Array.isArray(sanitized.instagramVideos)) {
        sanitized.instagramVideos = fileData.instagramVideos || [];
      }
      return sanitized;
    }
  } catch (e) {
    console.warn("Database read for client_reviews unavailable, checking fallback file:", e);
  }

  return fileData;
}

async function writeData(data: any) {
  const jsonStr = JSON.stringify(data);
  let dbSuccess = false;

  // 1. Save to Neon PostgreSQL
  try {
    await prisma.siteContent.upsert({
      where: { key: "client_reviews" },
      update: { value: jsonStr },
      create: { key: "client_reviews", value: jsonStr },
    });
    dbSuccess = true;
  } catch (e) {
    console.error("Database write error for client_reviews:", e);
  }

  // 2. Also try writing to local disk (for local development persistence)
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    if (!dbSuccess) {
      console.warn("File write skipped on read-only filesystem and DB write was unsuccessful.");
    }
  }
}

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
};

export async function GET() {
  const data = await readData();
  return NextResponse.json(data, { headers: CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await readData();

    if (body.type === "screenshot") {
      const imageUrl = (body.imageUrl || "").trim();
      if (!imageUrl) {
        return NextResponse.json({ error: "Screenshot image is required" }, { status: 400 });
      }

      const newScreenshot = {
        id: `fb-${Date.now()}`,
        title: body.title || "WhatsApp / DM Customer Review",
        customerName: body.customerName || "Verified Buyer",
        location: body.location || "Kerala, India",
        piece: body.piece || "Anti-Tarnish Fine Jewelry",
        imageUrl: imageUrl,
        caption: body.caption || "",
        date: body.date || "Verified Recent Buyer",
      };

      if (!data.feedbackScreenshots) data.feedbackScreenshots = [];
      data.feedbackScreenshots.unshift(newScreenshot);
      await writeData(data);

      return NextResponse.json({ success: true, item: newScreenshot }, { headers: NO_CACHE_HEADERS });
    } else if (body.type === "instagramVideo") {
      let videoUrl = (body.videoUrl || "").trim();
      let instagramLink = (body.instagramLink || "").trim();

      if (!videoUrl) {
        return NextResponse.json({ error: "Video URL or Instagram link is required" }, { status: 400 });
      }

      // Add https protocol if missing and not a relative upload path or data url
      if (
        !videoUrl.startsWith("http://") &&
        !videoUrl.startsWith("https://") &&
        !videoUrl.startsWith("/") &&
        !videoUrl.startsWith("data:")
      ) {
        videoUrl = `https://${videoUrl}`;
      }
      if (
        instagramLink &&
        !instagramLink.startsWith("http://") &&
        !instagramLink.startsWith("https://") &&
        !instagramLink.startsWith("/")
      ) {
        instagramLink = `https://${instagramLink}`;
      }

      let embedUrl = "";
      const instaMatch = videoUrl.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
      if (instaMatch && instaMatch[1]) {
        embedUrl = `https://www.instagram.com/reel/${instaMatch[1]}/embed`;
        if (!instagramLink) {
          instagramLink = `https://www.instagram.com/reel/${instaMatch[1]}/`;
        }
      } else if (!instagramLink && videoUrl.includes("instagram.com")) {
        instagramLink = videoUrl;
      }

      const newInstaVideo = {
        id: `insta-${Date.now()}`,
        title: body.title || "Jewelry Styling Reel",
        handle: body.handle || "@gleamnest.in",
        caption: body.caption || "Everyday luxury waterproof jewelry in 304 & 306 steel",
        videoUrl: videoUrl,
        embedUrl: embedUrl,
        poster: body.poster || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700",
        views: body.views || "15.2K",
        instagramLink: instagramLink || "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5",
      };

      if (!data.instagramVideos) data.instagramVideos = [];
      data.instagramVideos.unshift(newInstaVideo);
      await writeData(data);

      return NextResponse.json({ success: true, item: newInstaVideo }, { headers: NO_CACHE_HEADERS });
    } else if (body.type === "video") {
      let videoUrl = (body.videoUrl || "").trim();
      if (!videoUrl) {
        return NextResponse.json({ error: "Video URL or uploaded video is required" }, { status: 400 });
      }

      if (
        !videoUrl.startsWith("http://") &&
        !videoUrl.startsWith("https://") &&
        !videoUrl.startsWith("/") &&
        !videoUrl.startsWith("data:")
      ) {
        videoUrl = `https://${videoUrl}`;
      }

      const newVideo = {
        id: `vid-${Date.now()}`,
        influencer: body.influencer || "GleamNest Client",
        handle: body.handle || "@gleamnest.in",
        title: body.title || "Jewelry Styling Reel",
        poster: body.poster || "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=700",
        videoUrl: videoUrl,
        views: body.views || "1.2K views",
        productTitle: body.productTitle || "GleamNest Jewelry",
        productSlug: body.productSlug || "all",
        productPrice: Number(body.productPrice) || 150,
      };

      if (!data.videoReels) data.videoReels = [];
      data.videoReels.unshift(newVideo);
      await writeData(data);

      return NextResponse.json({ success: true, item: newVideo }, { headers: NO_CACHE_HEADERS });
    } else {
      const newReview = {
        id: `rev-${Date.now()}`,
        author: body.author || "Verified Customer",
        location: body.location || "Kerala, India",
        piece: body.piece || "Anti-Tarnish Fine Jewelry",
        rating: Number(body.rating) || 5,
        quote: body.quote || "",
      };

      if (!data.reviews) data.reviews = [];
      data.reviews.unshift(newReview);
      await writeData(data);

      return NextResponse.json({ success: true, item: newReview }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err: any) {
    console.error("Error in POST /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to add item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const data = await readData();
    const targetId = String(id).trim();

    if (type === "instagramVideo" || !type) {
      let found = false;
      data.instagramVideos = (data.instagramVideos || []).map((v: any) => {
        if (String(v.id).trim() === targetId) {
          found = true;
          return {
            ...v,
            ...(body.videoUrl !== undefined ? { videoUrl: body.videoUrl } : {}),
            ...(body.poster !== undefined ? { poster: body.poster } : {}),
            ...(body.title !== undefined ? { title: body.title } : {}),
            ...(body.caption !== undefined ? { caption: body.caption } : {}),
            ...(body.handle !== undefined ? { handle: body.handle } : {}),
            ...(body.views !== undefined ? { views: body.views } : {}),
            ...(body.instagramLink !== undefined ? { instagramLink: body.instagramLink } : {}),
          };
        }
        return v;
      });

      if (!found && body.videoUrl) {
        data.instagramVideos.push({
          id: targetId,
          title: body.title || "Jewelry Styling Reel",
          handle: body.handle || "@gleamnest.in",
          caption: body.caption || "",
          videoUrl: body.videoUrl,
          poster: body.poster || "",
          views: body.views || "25K",
          instagramLink: body.instagramLink || "",
        });
      }
    } else if (type === "video") {
      data.videoReels = (data.videoReels || []).map((v: any) => {
        if (String(v.id).trim() === targetId) {
          return { ...v, ...body };
        }
        return v;
      });
    } else if (type === "screenshot") {
      data.feedbackScreenshots = (data.feedbackScreenshots || []).map((s: any) => {
        if (String(s.id).trim() === targetId) {
          return { ...s, ...body };
        }
        return s;
      });
    } else {
      data.reviews = (data.reviews || []).map((r: any) => {
        if (String(r.id).trim() === targetId) {
          return { ...r, ...body };
        }
        return r;
      });
    }

    await writeData(data);
    return NextResponse.json({ success: true, data }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in PUT /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "review", "video", "screenshot", "instagramVideo"

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const data = await readData();
    const targetId = String(id).trim();

    if (type === "screenshot") {
      data.feedbackScreenshots = (data.feedbackScreenshots || []).filter((s: any) => String(s.id).trim() !== targetId);
    } else if (type === "instagramVideo") {
      data.instagramVideos = (data.instagramVideos || []).filter((v: any) => String(v.id).trim() !== targetId);
    } else if (type === "video") {
      data.videoReels = (data.videoReels || []).filter((v: any) => String(v.id).trim() !== targetId);
    } else {
      data.reviews = (data.reviews || []).filter((r: any) => String(r.id).trim() !== targetId);
    }

    await writeData(data);
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in DELETE /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
