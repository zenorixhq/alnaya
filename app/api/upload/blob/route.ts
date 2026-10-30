import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname /* clientPayload */
      ) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          maximumSizeInBytes: 250 * 1024 * 1024, // 250MB limit
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Vercel Blob client upload completed successfully:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("Error in /api/upload/blob:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process blob upload token" },
      { status: 400 }
    );
  }
}
