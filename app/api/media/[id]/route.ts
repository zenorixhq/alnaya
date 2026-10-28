import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = decodeURIComponent(params.id);

    // Query MediaStorage
    const record = await prisma.mediaStorage.findUnique({
      where: { id: fileId },
    });

    if (!record) {
      return new NextResponse("File not found", { status: 404 });
    }

    const buffer = Buffer.from(record.data, "base64");
    const totalSize = buffer.length;
    const contentType = record.mimeType || "video/mp4";

    const range = req.headers.get("range");

    if (range) {
      // Parse Range header e.g. "bytes=0-"
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${totalSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const chunk = buffer.subarray(start, end + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Length": totalSize.toString(),
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Error serving media file:", err);
    return new NextResponse("Error serving media", { status: 500 });
  }
}
