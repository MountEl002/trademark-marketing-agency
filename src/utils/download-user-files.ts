// utils/localStorageUtils.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
  endpoint: `https://s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`,
  forcePathStyle: true,
  customUserAgent: "hq-essay/1.0.0",
});

/**
 * Downloads a file from S3 and stores it in localStorage with metadata
 */
export async function downloadAndStoreFile(
  fileUrl: string,
  fileName: string,
  fileType?: string
): Promise<string | null> {
  try {
    // Extract S3 key from the file URL
    const fileKey = extractS3KeyFromUrl(fileUrl);
    if (!fileKey) {
      throw new Error("Could not extract S3 key from URL");
    }

    // Check if file already exists in localStorage
    const localStorageKey = `file_${fileKey.replace(/[\/\\]/g, "_")}`;
    const existingFile = localStorage.getItem(localStorageKey);

    if (existingFile) {
      const parsedFile = JSON.parse(existingFile);
      return parsedFile.dataUrl;
    }

    // Download file from S3
    const fileBuffer = await downloadFileFromS3Bucket(fileKey);

    // Convert to base64 data URL
    const blob = new Blob([fileBuffer.body], { type: fileType });
    const dataUrl = await blobToDataUrl(blob);

    // Store in localStorage with metadata
    const fileData = {
      fileName,
      fileType,
      fileKey,
      dataUrl,
      timestamp: Date.now(),
    };

    localStorage.setItem(localStorageKey, JSON.stringify(fileData));

    return dataUrl;
  } catch (error) {
    console.error("Error downloading and storing file:", error);
    return null;
  }
}

/**
 * Retrieves a file from localStorage
 */
export function getFileFromLocalStorage(fileUrl: string): string | null {
  try {
    const fileKey = extractS3KeyFromUrl(fileUrl);
    if (!fileKey) return null;

    const localStorageKey = `file_${fileKey.replace(/[\/\\]/g, "_")}`;
    const storedFile = localStorage.getItem(localStorageKey);

    if (storedFile) {
      const parsedFile = JSON.parse(storedFile);
      return parsedFile.dataUrl;
    }

    return null;
  } catch (error) {
    console.error("Error retrieving file from localStorage:", error);
    return null;
  }
}

/**
 * Downloads a single file from S3 bucket
 */
async function downloadFileFromS3Bucket(fileKey: string): Promise<{
  body: ArrayBuffer;
}> {
  try {
    const getParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
      Key: fileKey,
    };

    const response = await s3Client.send(new GetObjectCommand(getParams));

    if (!response.Body) {
      throw new Error("No file content received from S3");
    }

    // Convert readable stream to array buffer
    const body = response.Body as ReadableStream;
    const reader = body.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (doneReading) {
        done = true;
        break;
      }
      chunks.push(value);
    }

    const concatenated = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    let position = 0;

    for (const chunk of chunks) {
      concatenated.set(chunk, position);
      position += chunk.length;
    }

    return {
      body: concatenated.buffer,
    };
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    throw new Error("Failed to download file from S3");
  }
}

/**
 * Extracts S3 key from a full S3 URL
 */
function extractS3KeyFromUrl(url: string): string | null {
  try {
    // Handle different S3 URL formats
    if (url.includes(".amazonaws.com/")) {
      // Format: https://bucket.s3.region.amazonaws.com/key
      const parts = url.split(".amazonaws.com/");
      return parts[1] || null;
    } else if (url.includes("amazonaws.com/")) {
      // Format: https://s3.region.amazonaws.com/bucket/key
      const parts = url.split("/");
      const bucketIndex = parts.findIndex((part) =>
        part.includes("amazonaws.com")
      );
      if (bucketIndex !== -1 && parts.length > bucketIndex + 2) {
        return parts.slice(bucketIndex + 2).join("/");
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting S3 key from URL:", error);
    return null;
  }
}

/**
 * Converts a Blob to a data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Cleans up old files from localStorage (optional utility)
 */
export function cleanupOldFiles(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("file_")) {
        const storedFile = localStorage.getItem(key);
        if (storedFile) {
          const parsedFile = JSON.parse(storedFile);
          if (now - parsedFile.timestamp > maxAgeMs) {
            keysToRemove.push(key);
          }
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error cleaning up old files:", error);
  }
}
