import { NextRequest } from "next/server";
import {
  deleteFileWithProgress,
  DeleteProgress,
} from "@/utils/server-side-file-delete";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileKey, fileName, firebasePath, deleteStrategy, arrayFieldName } =
      body;

    if (!fileKey || !fileName || !firebasePath || !deleteStrategy) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: fileKey, fileName, firebasePath, or deleteStrategy",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate arrayFieldName for removeFromArray strategy
    if (deleteStrategy === "removeFromArray" && !arrayFieldName) {
      return new Response(
        JSON.stringify({
          error: "arrayFieldName is required for removeFromArray strategy",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a readable stream for progress updates
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await deleteFileWithProgress(
            { fileKey, fileName, firebasePath, deleteStrategy, arrayFieldName },
            (progress: DeleteProgress) => {
              // Send progress update as SSE
              const data = `data: ${JSON.stringify(progress)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          );

          // Close the stream
          controller.close();
        } catch (error) {
          const errorProgress: DeleteProgress = {
            fileKey,
            fileName,
            progress: 0,
            status: "error",
            error: error instanceof Error ? error.message : "Delete failed",
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
    console.error("Delete API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Delete failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
