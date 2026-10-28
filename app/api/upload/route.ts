import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderType = (formData.get("folder") as string) || "screenshots"; // "screenshots" | "videos" | "images"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize folder
    const safeFolder = folderType === "videos" ? "videos" : folderType === "images" ? "images" : "screenshots";
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean file extension & filename
    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase() || (safeFolder === "videos" ? ".mp4" : ".jpg");
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const fileName = `${cleanBase}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFolder}/${fileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    }, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
