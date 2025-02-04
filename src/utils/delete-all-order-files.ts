import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteFileFromS3 } from "./delete-file";
import type { UploadedFileInfo } from "@/types/order";

// First, let's extend the UploadedFileInfo interface to include orderNumber
interface FileWithOrder extends UploadedFileInfo {
  orderNumber?: string;
}

interface BatchDeleteResponse {
  success: boolean;
  message: string;
  deletedFiles: {
    fileKey: string;
    fileName: string;
    fileUrl: string;
  }[];
  errors?: string[];
}

export async function deleteAllOrderFiles(
  orderNumber: string,
  userId: string,
  isSuperAdmin = false
): Promise<BatchDeleteResponse> {
  const deletedFiles = [];
  const errors = [];

  try {
    // Get the user's files document
    const userFileRef = doc(db, "files", userId);
    const userFileDoc = await getDoc(userFileRef);

    if (!userFileDoc.exists()) {
      throw new Error(`No files found for user ${userId}`);
    }

    const userData = userFileDoc.data();
    const userFiles = userData.files as FileWithOrder[];

    // Filter files that belong to the specified order
    const orderFiles = userFiles.filter(
      (file) => file.orderNumber === orderNumber
    );

    if (orderFiles.length === 0) {
      return {
        success: true,
        message: `No files found for order ${orderNumber}`,
        deletedFiles: [],
      };
    }

    // Delete each file from S3 and track results
    for (const file of orderFiles) {
      try {
        const result = await deleteFileFromS3({
          fileKey: file.fileKey,
          userId,
          isSuperAdmin,
        });

        if (result.success && result.deletedFile) {
          deletedFiles.push(result.deletedFile);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to delete file ${file.fileName}`;
        errors.push(errorMessage);
        console.error(`Error deleting file ${file.fileName}:`, error);
      }
    }

    // Update the files array in Firebase to remove the deleted files
    const remainingFiles = userFiles.filter(
      (file) => file.orderNumber !== orderNumber
    );
    await updateDoc(userFileRef, {
      files: remainingFiles,
      updatedAt: new Date(),
    });

    // Determine overall success
    const allFilesDeleted = deletedFiles.length === orderFiles.length;

    return {
      success: allFilesDeleted,
      message: allFilesDeleted
        ? `Successfully deleted all ${deletedFiles.length} files for order ${orderNumber}`
        : `Partially deleted files for order ${orderNumber}. ${deletedFiles.length} of ${orderFiles.length} files deleted`,
      deletedFiles,
      ...(errors.length > 0 && { errors }),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Failed to process file deletion for order ${orderNumber}`;

    return {
      success: false,
      message: errorMessage,
      deletedFiles,
      errors: [...errors, errorMessage],
    };
  }
}
