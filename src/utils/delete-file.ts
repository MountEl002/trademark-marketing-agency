import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
  endpoint: `https://s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`,
  forcePathStyle: true,
});

interface DeleteFileParams {
  fileKey: string;
  orderNumber: number;
  orderStatus: string;
  userId: string;
  isAdmin?: boolean;
}

interface DeleteFileResponse {
  success: boolean;
  message: string;
}

interface FileMetadata {
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
  userId: string;
  orderNumber: number;
  orderStatus: string;
}

interface OrderFileData {
  files: FileMetadata[];
  userId: string;
  orderNumber: number;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Deletes a single file from S3 and updates Firebase metadata
 */
export async function deleteFile({
  fileKey,
  orderNumber,
  orderStatus,
  userId,
  isAdmin = false,
}: DeleteFileParams): Promise<DeleteFileResponse> {
  try {
    // Permission check
    if (!isAdmin && orderStatus !== 'draft') {
      return {
        success: false,
        message: "Only files in draft orders can be deleted by users",
      };
    }

    // Verify file exists and belongs to the correct order and user
    const orderFileRef = doc(db, "orders", orderNumber.toString(), "files", userId);
    const orderFileDoc = await getDoc(orderFileRef);

    if (!orderFileDoc.exists()) {
      return {
        success: false,
        message: "File metadata not found",
      };
    }

    const fileData = orderFileDoc.data() as OrderFileData;
    const fileExists = fileData.files.some((file: FileMetadata) => file.fileKey === fileKey);

    if (!fileExists) {
      return {
        success: false,
        message: "File not found in the specified order",
      };
    }

    // Delete from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
        Key: fileKey,
      })
    );

    // Get file metadata to remove
    const fileToRemove = fileData.files.find(
      (file: FileMetadata) => file.fileKey === fileKey
    );

    if (!fileToRemove) {
      return {
        success: false,
        message: "File metadata not found for deletion",
      };
    }

    // Update order's files collection
    await updateDoc(orderFileRef, {
      files: arrayRemove(fileToRemove),
      updatedAt: new Date(),
    });

    // Update user's files collection
    const userFileRef = doc(db, "files", userId);
    const userFileDoc = await getDoc(userFileRef);

    if (userFileDoc.exists()) {
      await updateDoc(userFileRef, {
        files: arrayRemove(fileToRemove),
        updatedAt: new Date(),
      });
    }

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

/**
 * Verifies if a user has permission to delete a file
 */
export async function canDeleteFile({
  orderNumber,
  orderStatus,
  userId,
  isAdmin = false,
}: Omit<DeleteFileParams, 'fileKey'>): Promise<boolean> {
  if (isAdmin) return true;
  if (orderStatus !== 'draft') return false;

  try {
    const orderFileRef = doc(db, "orders", orderNumber.toString(), "files", userId);
    const orderFileDoc = await getDoc(orderFileRef);

    return orderFileDoc.exists();
  } catch {
    return false;
  }
}