import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed.reviews)) parsed.reviews = [];
      if (!Array.isArray(parsed.videoReels)) parsed.videoReels = [];
      if (!Array.isArray(parsed.feedbackScreenshots)) parsed.feedbackScreenshots = [];
      if (!Array.isArray(parsed.instagramVideos)) parsed.instagramVideos = [];
      return parsed;
    }
  } catch (e) {
    console.error("Error reading clientReviews.json:", e);
  }
  return getInitialData();
}

function writeData(data: any) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing clientReviews.json:", e);
    throw e;
  }
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = readData();

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
      writeData(data);

      return NextResponse.json({ success: true, item: newScreenshot }, { headers: NO_CACHE_HEADERS });
    } else if (body.type === "instagramVideo") {
      let videoUrl = (body.videoUrl || "").trim();
      let instagramLink = (body.instagramLink || "").trim();

      if (!videoUrl) {
        return NextResponse.json({ error: "Video URL or Instagram link is required" }, { status: 400 });
      }

      // Add https protocol if missing and not a relative upload path
      if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://") && !videoUrl.startsWith("/")) {
        videoUrl = `https://${videoUrl}`;
      }
      if (instagramLink && !instagramLink.startsWith("http://") && !instagramLink.startsWith("https://") && !instagramLink.startsWith("/")) {
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
      writeData(data);

      return NextResponse.json({ success: true, item: newInstaVideo }, { headers: NO_CACHE_HEADERS });
    } else if (body.type === "video") {
      let videoUrl = (body.videoUrl || "").trim();
      if (!videoUrl) {
        return NextResponse.json({ error: "Video URL or uploaded video is required" }, { status: 400 });
      }

      if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://") && !videoUrl.startsWith("/")) {
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
      writeData(data);

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
      writeData(data);

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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "review", "video", "screenshot", "instagramVideo"

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const data = readData();
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

    writeData(data);
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in DELETE /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
