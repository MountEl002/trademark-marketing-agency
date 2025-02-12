import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteFileFromS3 } from "./delete-file";

interface BatchDeleteResponse {
  success: boolean;
  message: string;
  deletedFiles: {
    fileKey: string;
    fileName: string;
    fileUrl: string;
  }[];
}

export async function deleteAllOrderFiles(
  orderNumber: string,
  userId: string,
  isSuperAdmin = false
): Promise<BatchDeleteResponse> {
  try {
    // Get all files for this order
    const publicFilesQuery = query(
      collection(db, "publicFiles"),
      where("orderNumber", "==", orderNumber)
    );
    const querySnapshot = await getDocs(publicFilesQuery);

    const deletePromises = querySnapshot.docs.map(async (doc) => {
      const fileData = doc.data();
      // Delete from S3
      await deleteFileFromS3({
        fileKey: fileData.fileKey,
        userId,
        isSuperAdmin,
      });
      // Delete from Firestore
      await deleteDoc(doc.ref);
      return {
        fileKey: fileData.fileKey,
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
      };
    });

    const deletedFiles = await Promise.all(deletePromises);

    return {
      success: true,
      message: `Successfully deleted ${deletedFiles.length} files`,
      deletedFiles,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete files",
      deletedFiles: [],
    };
  }
}
