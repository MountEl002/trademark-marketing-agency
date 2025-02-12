import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
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
  customUserAgent: "hq-essay/1.0.0",
});

// Types
interface PublicFileData {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileKey: string;
  uploadedAt: Date;
  uploadedBy: string;
  orderNumber: string | null;
}

interface DeleteFileParams {
  fileKey: string;
  userId: string;
  orderNumber?: string;
  isSuperAdmin?: boolean;
}

interface DeleteFileResponse {
  success: boolean;
  message: string;
  deletedFile?: {
    fileKey: string;
    fileName: string;
    fileUrl: string;
  };
}

interface OrderFile {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Deletes a file from S3 and updates Firebase metadata
 */
export async function deleteFileFromS3({
  fileKey,
  userId,
  orderNumber,
  isSuperAdmin = false,
}: DeleteFileParams): Promise<DeleteFileResponse> {
  try {
    // Validate user permission
    if (!isSuperAdmin) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
    }

    // Get file metadata before deletion
    const documentId = fileKey.replace(/\//g, "_");
    const fileDoc = await getDoc(doc(db, "publicFiles", documentId));
    if (!fileDoc.exists()) {
      throw new Error("File metadata not found");
    }

    const fileData = fileDoc.data() as PublicFileData;
    if (!isSuperAdmin && fileData.uploadedBy !== userId) {
      throw new Error("Unauthorized to delete this file");
    }

    // Delete from S3
    await deleteFileFromS3Bucket(fileKey);

    // Update Firebase metadata
    const deletedFile = await removeFileMetadataFromFirebase(
      fileKey,
      fileData,
      orderNumber
    );

    return {
      success: true,
      message: "File deleted successfully",
      deletedFile,
    };
  } catch (error) {
    console.error("Error in deleteFileFromS3:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete file"
    );
  }
}

/**
 * Deletes a single file from S3 bucket
 */
async function deleteFileFromS3Bucket(fileKey: string): Promise<void> {
  try {
    const deleteParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
      Key: fileKey,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
}

/**
 * Removes file metadata from Firebase documents
 */
async function removeFileMetadataFromFirebase(
  fileKey: string,
  fileData: PublicFileData,
  orderNumber?: string
): Promise<{ fileKey: string; fileName: string; fileUrl: string }> {
  try {
    // Delete the file document from publicFiles collection
    const documentId = fileKey.replace(/\//g, "_");
    await deleteDoc(doc(db, "publicFiles", documentId));

    // Update order document if orderNumber is provided
    if (orderNumber) {
      const orderRef = doc(db, "orders", orderNumber);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data() as { orderFiles: OrderFile[] };
      const updatedOrderFiles = orderData.orderFiles.filter(
        (file) => file.fileKey !== fileKey
      );

      await updateDoc(orderRef, {
        orderFiles: updatedOrderFiles,
        updatedAt: new Date(),
      });
    }

    return {
      fileKey: fileData.fileKey,
      fileName: fileData.fileName,
      fileUrl: fileData.fileUrl,
    };
  } catch (error) {
    console.error("Error updating Firebase:", error);
    throw new Error("Failed to update file metadata in Firebase");
  }
}
