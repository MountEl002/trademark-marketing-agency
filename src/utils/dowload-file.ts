import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FileUploadResponse } from "@/utils/s3-upload";

// Initialize S3 Client (reusing the same configuration)
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

interface DownloadFileParams {
  fileKey: string;
  orderNumber?: string;
}

interface DownloadFileResponse {
  success: boolean;
  message: string;
  fileName: string;
  fileType: string;
}

/**
 * Downloads a file from S3 and saves it to local storage
 */
export async function downloadFileFromS3({
  fileKey,
  orderNumber,
}: DownloadFileParams): Promise<DownloadFileResponse> {
  try {
    // Validate user permission
    if (!isSuperAdmin) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
    }

    // Get file metadata from Firebase
    const fileMetadata = await getFileMetadataFromFirebase(
      fileKey,
      userId,
      orderNumber
    );
    if (!fileMetadata) {
      throw new Error("File metadata not found");
    }

    // Download file from S3
    const downloadedFile = await downloadFileFromS3Bucket(fileKey);

    // Create blob from array buffer
    const blob = new Blob([downloadedFile.body], {
      type: fileMetadata.fileType,
    });

    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileMetadata.fileName; // Use original filename from metadata
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: "File downloaded successfully",
      fileName: fileMetadata.fileName,
      fileType: fileMetadata.fileType,
    };
  } catch (error) {
    console.error("Error in downloadFileFromS3:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to download file"
    );
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
 * Retrieves file metadata from Firebase
 */
async function getFileMetadataFromFirebase(
  fileKey: string,
  userId: string,
  orderNumber?: string
): Promise<{ fileName: string; fileType: string } | null> {
  try {
    // First check user's files collection
    const userFileRef = doc(db, "files", userId);
    const docSnap = await getDoc(userFileRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const files = userData.files as FileUploadResponse[];
      const fileMetadata = files.find((file) => file.fileKey === fileKey);

      if (fileMetadata) {
        return {
          fileName: fileMetadata.fileName,
          fileType: fileMetadata.fileType,
        };
      }
    }

    // If orderNumber is provided and file not found in user's files, check order document
    if (orderNumber) {
      const orderRef = doc(db, "orders", orderNumber);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        const orderFiles = orderData.orderFiles;
        const fileMetadata = orderFiles.find(
          (file: { fileKey: string }) => file.fileKey === fileKey
        );

        if (fileMetadata) {
          return {
            fileName: fileMetadata.fileName,
            fileType: fileMetadata.fileType,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error retrieving file metadata from Firebase:", error);
    throw new Error("Failed to retrieve file metadata");
  }
}
