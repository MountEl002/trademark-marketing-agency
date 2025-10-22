//server-side-s3-download.ts

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client (server-side only)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export interface DownloadProgress {
  fileKey: string;
  fileName: string;
  progress: number;
  status: "pending" | "downloading" | "completed" | "error";
  error?: string;
}

export interface DownloadFileParams {
  fileKey: string;
  fileName: string;
}

/**
 * Server-side utility function to download file from S3 with streaming progress
 */
export async function downloadFileWithProgress(
  params: DownloadFileParams,
  onProgress: (progress: DownloadProgress) => void
): Promise<ArrayBuffer> {
  const { fileKey, fileName } = params;

  try {
    // Initial progress
    onProgress({
      fileKey,
      fileName,
      progress: 0,
      status: "pending",
    });

    // Update progress - starting download
    onProgress({
      fileKey,
      fileName,
      progress: 10,
      status: "downloading",
    });

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: fileKey,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("No file content received from S3");
    }

    // Update progress - file retrieved from S3
    onProgress({
      fileKey,
      fileName,
      progress: 30,
      status: "downloading",
    });

    // Convert stream to ArrayBuffer
    const chunks: Uint8Array[] = [];
    const reader = response.Body.transformToWebStream().getReader();

    const contentLength = response.ContentLength || 0;
    let downloadedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      downloadedBytes += value.length;

      // Calculate progress (30% base + 60% for download progress)
      const downloadProgress =
        contentLength > 0
          ? Math.min(60, (downloadedBytes / contentLength) * 60)
          : 60;

      onProgress({
        fileKey,
        fileName,
        progress: 30 + downloadProgress,
        status: "downloading",
      });
    }

    // Combine all chunks into a single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    // Update progress - processing complete
    onProgress({
      fileKey,
      fileName,
      progress: 95,
      status: "downloading",
    });

    // Final progress - complete
    onProgress({
      fileKey,
      fileName,
      progress: 100,
      status: "completed",
    });

    return result.buffer;
  } catch (error) {
    const errorProgress: DownloadProgress = {
      fileKey,
      fileName,
      progress: 0,
      status: "error",
      error: error instanceof Error ? error.message : "Download failed",
    };

    onProgress(errorProgress);
    throw error;
  }
}
