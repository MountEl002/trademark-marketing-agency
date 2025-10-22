//api/files-download/route.ts

import { NextRequest } from "next/server";
import {
  downloadFileWithProgress,
  DownloadProgress,
} from "@/utils/server-side-s3-download";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileKey, fileName } = body;

    if (!fileKey || !fileName) {
      return new Response(
        JSON.stringify({ error: "Missing fileKey or fileName" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a readable stream for progress updates
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const fileBuffer = await downloadFileWithProgress(
            { fileKey, fileName },
            (progress: DownloadProgress) => {
              // Send progress update as SSE
              const data = `data: ${JSON.stringify(progress)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          );

          // Send the final file data
          const finalData = {
            fileKey,
            fileName,
            fileBuffer: Array.from(new Uint8Array(fileBuffer)),
            status: "completed",
            progress: 100,
          };

          const data = `data: ${JSON.stringify(finalData)}\n\n`;
          controller.enqueue(encoder.encode(data));

          // Close the stream
          controller.close();
        } catch (error) {
          const errorProgress: DownloadProgress = {
            fileKey,
            fileName,
            progress: 0,
            status: "error",
            error: error instanceof Error ? error.message : "Download failed",
          };
          const data = `data: ${JSON.stringify(errorProgress)}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Download API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Download failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
