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

    const safeFolder = folderType === "videos" ? "videos" : folderType === "images" ? "images" : "screenshots";
    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase() || (safeFolder === "videos" ? ".mp4" : ".jpg");
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const fileName = `${cleanBase}-${Date.now()}${ext}`;

    // 1. If Vercel Blob is configured (via BLOB_READ_WRITE_TOKEN env variable)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`uploads/${safeFolder}/${fileName}`, file, {
          access: "public",
          addRandomSuffix: true,
        });

        return NextResponse.json(
          {
            success: true,
            url: blob.url,
            fileName,
            size: file.size,
            provider: "vercel-blob",
          },
          {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          }
        );
      } catch (blobErr: any) {
        console.error("Vercel Blob upload failed, falling back:", blobErr);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. In local development or writable environments, attempt to save to /public/uploads
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${fileName}`;
      return NextResponse.json(
        {
          success: true,
          url: publicUrl,
          fileName,
          size: file.size,
          provider: "local-fs",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    } catch (fsErr: any) {
      // Expected on Vercel serverless where /var/task is read-only
      console.warn("Local filesystem write skipped (read-only environment):", fsErr.message);
    }

    // 3. Fallback for serverless (Vercel) when BLOB_READ_WRITE_TOKEN is not yet connected:
    // Notice: We strictly DO NOT store media files in PostgreSQL (Neon) to prevent database quota exhaustion.
    return NextResponse.json(
      {
        error:
          "Vercel Blob storage is required for uploads in production. Please attach a Vercel Blob store in your Vercel Dashboard (Storage -> Create -> Blob) to get a free high-speed CDN, or paste a direct image URL.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
