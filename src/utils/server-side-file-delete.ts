import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { FileDeleteStatus, FileDeleteStrategy } from "@/lib/constants";
import admin from "@/lib/firebase-admin";

// Initialize S3 Client (server-side only)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export interface DeleteProgress {
  fileKey: string;
  fileName: string;
  progress: number;
  status: FileDeleteStatus;
  error?: string;
}

export interface DeleteFileParams {
  fileKey: string;
  fileName: string;
  firebasePath: string;
  deleteStrategy: FileDeleteStrategy;
  arrayFieldName?: string;
}

/**
 * Server-side utility function to delete file from S3, Firebase, and IndexedDB
 */
export async function deleteFileWithProgress(
  params: DeleteFileParams,
  onProgress: (progress: DeleteProgress) => void
): Promise<void> {
  const { fileKey, fileName, firebasePath, deleteStrategy, arrayFieldName } =
    params;

  try {
    // Initial progress
    onProgress({
      fileKey,
      fileName,
      progress: 0,
      status: "pending",
    });

    // Step 1: Delete from S3
    onProgress({
      fileKey,
      fileName,
      progress: 10,
      status: "deleting",
    });

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);

    // Step 2: Delete from Firebase
    onProgress({
      fileKey,
      fileName,
      progress: 40,
      status: "deleting",
    });

    await deleteFromFirebase({
      fileKey,
      firebasePath,
      deleteStrategy,
      arrayFieldName,
    });

    // Step 3: Client will handle IndexedDB deletion
    onProgress({
      fileKey,
      fileName,
      progress: 80,
      status: "deleting",
    });

    // Final progress - complete
    onProgress({
      fileKey,
      fileName,
      progress: 100,
      status: "completed",
    });
  } catch (error) {
    const errorProgress: DeleteProgress = {
      fileKey,
      fileName,
      progress: 0,
      status: "error",
      error: error instanceof Error ? error.message : "Delete failed",
    };

    onProgress(errorProgress);
    throw error;
  }
}

export async function deleteFilesFromS3(
  orderFilesKeys: string[]
): Promise<{ success: boolean; message: string; failedKeys?: string[] }> {
  try {
    // S3 batch delete can handle up to 1000 objects at once
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Delete: {
        Objects: orderFilesKeys.map((key) => ({ Key: key })),
        Quiet: false, // Set to true if you don't need detailed response
      },
    });

    const response = await s3Client.send(deleteCommand);

    const deletedCount = response.Deleted?.length || 0;
    const failedKeys = response.Errors?.map((error) => error.Key || "") || [];

    if (failedKeys.length === 0) {
      return {
        success: true,
        message: `Successfully deleted ${deletedCount} file(s)`,
      };
    } else {
      return {
        success: deletedCount > 0,
        message: `Deleted ${deletedCount} of ${orderFilesKeys.length} file(s). ${failedKeys.length} failed.`,
        failedKeys: failedKeys.filter((key) => key !== ""),
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Batch delete failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
/**
 * Delete file metadata from Firebase using dynamic path and strategy
 */
async function deleteFromFirebase(params: {
  fileKey: string;
  firebasePath: string;
  deleteStrategy: FileDeleteStrategy;
  arrayFieldName?: string;
}): Promise<void> {
  const { fileKey, firebasePath, deleteStrategy, arrayFieldName } = params;

  if (deleteStrategy === "deleteDocument") {
    // Direct document deletion - use admin SDK
    const docRef = admin.firestore().doc(firebasePath);
    await docRef.delete();
  } else if (deleteStrategy === "removeFromArray") {
    // Remove from array field - path should be to the document containing the array
    if (!arrayFieldName) {
      throw new Error(
        "arrayFieldName is required for removeFromArray strategy"
      );
    }

    const docRef = admin.firestore().doc(firebasePath);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const docData = docSnapshot.data();
      const arrayField = docData?.[arrayFieldName] || [];

      // Find the file to remove by fileKey
      const fileToRemove = arrayField.find(
        (file: { fileKey: string }) => file.fileKey === fileKey
      );

      if (fileToRemove) {
        await docRef.update({
          [arrayFieldName]:
            admin.firestore.FieldValue.arrayRemove(fileToRemove),
          updatedAt: new Date(),
        });
      }
    }
  }
}
