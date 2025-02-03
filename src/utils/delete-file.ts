import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FileUploadResponse } from "@/utils/s3-upload"; // Adjust the import path as needed

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

    // Delete from S3
    await deleteFileFromS3Bucket(fileKey);

    // Update Firebase metadata
    const deletedFile = await removeFileMetadataFromFirebase(
      fileKey,
      userId,
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

interface OrderFile {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Removes file metadata from Firebase documents
 */
async function removeFileMetadataFromFirebase(
  fileKey: string,
  userId: string,
  orderNumber?: string
): Promise<{ fileKey: string; fileName: string; fileUrl: string }> {
  const userFileRef = doc(db, "files", userId);

  try {
    // Get current files data
    const docSnap = await getDoc(userFileRef);
    if (!docSnap.exists()) {
      throw new Error("User files document not found");
    }

    const userData = docSnap.data();
    const files = userData.files as FileUploadResponse[];

    // Find the file to be deleted
    const fileIndex = files.findIndex((file) => file.fileKey === fileKey);
    if (fileIndex === -1) {
      throw new Error("File not found in user's files");
    }

    const deletedFile = files[fileIndex];
    const updatedFiles = files.filter((_, index) => index !== fileIndex);

    // Update user's files collection
    await updateDoc(userFileRef, {
      files: updatedFiles,
      updatedAt: new Date(),
    });

    // Update order document if orderNumber is provided
    if (orderNumber) {
      const orderRef = doc(db, "orders", orderNumber);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data();
      const orderFiles = orderData.orderFiles as OrderFile[];
      const updatedOrderFiles = orderFiles.filter(
        (file) => file.fileKey !== fileKey
      );

      await updateDoc(orderRef, {
        orderFiles: updatedOrderFiles,
        updatedAt: new Date(),
      });
    }

    return {
      fileKey: deletedFile.fileKey,
      fileName: deletedFile.fileName,
      fileUrl: deletedFile.fileUrl,
    };
  } catch (error) {
    console.error("Error updating Firebase:", error);
    throw new Error("Failed to update file metadata in Firebase");
  }
}
