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

const DEFAULT_FOLLOW_HOUSE_PANELS = [
  "/images/follow-house/panel-1.jpg",
  "/images/follow-house/panel-2.jpg",
  "/images/follow-house/panel-3.jpg",
  "/images/follow-house/panel-4.jpg",
  "/images/follow-house/panel-5.jpg",
];

function cleanTextValue(val: any): any {
  if (typeof val !== "string") return val;
  // If it's a base64 data URL or blob, NEVER run text replacements on it!
  if (val.startsWith("data:") || val.startsWith("blob:")) return val;

  // If it's a URL or image path, only replace gleamnest in domain/handle if needed
  if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/")) {
    return val
      .replace(/@?gleamnest\.in/gi, "@alnaya.in")
      .replace(/gleamnest/gi, "alnaya");
  }

  // Text content cleaning
  return val
    .replace(/@?gleamnest\.in/gi, "@alnaya.in")
    .replace(/gleamnest/gi, "alnaya")
    .replace(/304\s*(&|and)\s*306(\s*grade)?\s*steel/gi, "radiant finish")
    .replace(/304\s*steel/gi, "hallmark stainless")
    .replace(/304\s*(&|and)\s*306/gi, "hallmark")
    .replace(/anti-?tarnish/gi, "waterproof")
    .replace(/pvd\s*coating/gi, "radiant finish")
    .replace(/\bpvd\b/gi, "radiant finish");
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "poster" || key === "imageUrl" || key === "image") {
      if (typeof value === "string") {
        if (value.includes("radiant finish")) {
          result[key] = "/images/follow-house/panel-1.jpg";
        } else if (!value.startsWith("data:") && value.includes("gleamnest")) {
          result[key] = value.replace(/gleamnest/gi, "alnaya");
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else if (typeof value === "string") {
      result[key] = cleanTextValue(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function sanitizeData(parsed: any) {
  if (!parsed || typeof parsed !== "object") return getInitialData();
  const cleaned = sanitizeObject(parsed);
  if (!Array.isArray(cleaned.reviews)) cleaned.reviews = [];
  if (!Array.isArray(cleaned.videoReels)) cleaned.videoReels = [];
  if (!Array.isArray(cleaned.feedbackScreenshots)) cleaned.feedbackScreenshots = [];
  if (!Array.isArray(cleaned.instagramVideos)) cleaned.instagramVideos = [];

  // Auto-heal any corrupted or oversized posters in instagramVideos
  cleaned.instagramVideos = cleaned.instagramVideos.map((item: any, idx: number) => {
    let poster = item.poster;
    if (!poster || typeof poster !== "string" || poster.includes("radiant finish") || (poster.startsWith("data:") && poster.length > 50000)) {
      poster = DEFAULT_FOLLOW_HOUSE_PANELS[idx % DEFAULT_FOLLOW_HOUSE_PANELS.length];
    }
    return { ...item, poster };
  });

  return cleaned;
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

export async function GET() {
  const data = await readData();
  return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
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
        piece: body.piece || "Everyday Fine Jewelry",
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
        handle: body.handle || "@alnaya.in",
        caption: body.caption || "Everyday luxury waterproof jewelry in radiant finish",
        videoUrl: videoUrl,
        embedUrl: embedUrl,
        poster: body.poster || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700",
        views: body.views || "15.2K",
        instagramLink: instagramLink || "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
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
        influencer: body.influencer || "Alnaya Client",
        handle: body.handle || "@alnaya.in",
        title: body.title || "Jewelry Styling Reel",
        poster: body.poster || "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=700",
        videoUrl: videoUrl,
        views: body.views || "1.2K views",
        productTitle: body.productTitle || "Alnaya Jewelry",
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
        piece: body.piece || "Everyday Fine Jewelry",
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
          handle: body.handle || "@alnaya.in",
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
    const targetId = decodeURIComponent(String(id)).trim().toLowerCase();

    if (type === "screenshot") {
      data.feedbackScreenshots = (data.feedbackScreenshots || []).filter(
        (s: any) => decodeURIComponent(String(s.id)).trim().toLowerCase() !== targetId
      );
    } else if (type === "instagramVideo" || type === "reel" || type === "followHouse") {
      data.instagramVideos = (data.instagramVideos || []).filter(
        (v: any) => decodeURIComponent(String(v.id)).trim().toLowerCase() !== targetId
      );
    } else if (type === "video") {
      data.videoReels = (data.videoReels || []).filter(
        (v: any) => decodeURIComponent(String(v.id)).trim().toLowerCase() !== targetId
      );
    } else {
      data.reviews = (data.reviews || []).filter(
        (r: any) => decodeURIComponent(String(r.id)).trim().toLowerCase() !== targetId
      );
    }

    await writeData(data);
    return NextResponse.json(
      {
        success: true,
        instagramVideos: data.instagramVideos,
        videoReels: data.videoReels,
        reviews: data.reviews,
        feedbackScreenshots: data.feedbackScreenshots,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("Error in DELETE /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
