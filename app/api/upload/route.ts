import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

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
    // Only allowed for small compressed images/thumbnails under 500KB. NEVER return base64 for videos!
    if (safeFolder !== "videos" && buffer.length <= 500 * 1024) {
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

      return NextResponse.json(
        {
          success: true,
          url: dataUrl,
          fileName,
          size: file.size,
          provider: "data-url",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }

    // 4. Database Cloud Fallback (Neon PostgreSQL):
    // Save to MediaStorage table and serve via /api/media/[id] with native range streaming!
    try {
      const fileId = `${Date.now()}-${cleanBase}${ext}`;
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || (safeFolder === "videos" ? "video/mp4" : "image/jpeg");

      await prisma.mediaStorage.upsert({
        where: { id: fileId },
        create: {
          id: fileId,
          fileName,
          mimeType,
          data: base64Data,
          size: buffer.length,
        },
        update: {
          data: base64Data,
          size: buffer.length,
        },
      });

      const publicUrl = `/api/media/${encodeURIComponent(fileId)}`;
      return NextResponse.json(
        {
          success: true,
          url: publicUrl,
          fileName,
          size: file.size,
          provider: "database",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    } catch (dbErr: any) {
      console.error("Database media storage fallback failed:", dbErr);
    }

    // 5. If everything failed
    return NextResponse.json(
      {
        error:
          safeFolder === "videos"
            ? "Video upload failed. Please verify storage configuration or paste a public video / Instagram Reel URL."
            : "Image upload failed. Please verify storage configuration or paste an image URL.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
