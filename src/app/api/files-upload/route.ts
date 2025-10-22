//api/files-upload/route.ts

import { NextRequest } from "next/server";
import {
  uploadFileWithProgress,
  UploadProgress,
} from "@/utils/server-side-s3-upload";
import { COMMON_CONSTANTS, CommonConstant } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get(COMMON_CONSTANTS.FILE) as File;
    const userId = formData.get(COMMON_CONSTANTS.USER_ID) as string;
    const firebaseCollection = formData.get(
      COMMON_CONSTANTS.FIREBASE_COLLECTION
    ) as string;
    const orderNumber = formData.get(COMMON_CONSTANTS.ORDER_NUMBER) as
      | string
      | null;
    const filesField = formData.get(COMMON_CONSTANTS.FILES_FIELD) as string;

    if (!file || !userId || !firebaseCollection) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a readable stream for progress updates
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await uploadFileWithProgress(
            {
              userId,
              file,
              firebaseCollection,
              ...(orderNumber && { orderNumber }),
              filesField: filesField as CommonConstant,
            },
            (progress: UploadProgress) => {
              // Send progress update as SSE
              const data = `data: ${JSON.stringify(progress)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          );
          // Close the stream
          controller.close();
        } catch (error) {
          const errorProgress: UploadProgress = {
            fileId: "error",
            fileName: file.name,
            progress: 0,
            status: "error",
            error: error instanceof Error ? error.message : "Upload failed",
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
    console.error("Upload API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Upload failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
