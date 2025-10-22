import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { customAlphabet } from "nanoid";
import {
  CommonConstant,
  FileUploadStatus,
  FIREBASE_COLLECTIONS,
} from "@/lib/constants";
import admin, { adminDb } from "@/lib/firebase-admin";

// Generate URL-safe IDs
const generateId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  16
);

// Initialize S3 Client (server-side only)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: FileUploadStatus;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
}

export interface UploadFileParams {
  userId: string;
  file: File;
  firebaseCollection: string;
  orderNumber?: string;
  filesField?: CommonConstant;
}

/**
 * Server-side utility function to upload file to S3 with streaming progress
 */
export async function uploadFileWithProgress(
  params: UploadFileParams,
  onProgress: (progress: UploadProgress) => void
): Promise<UploadProgress> {
  const { userId, file, firebaseCollection, orderNumber, filesField } = params;
  const fileId = generateId();
  const fileExtension = file.name.split(".").pop() || "";
  const uniqueFileName = `${userId}/${generateId()}.${fileExtension}`;

  try {
    // Initial progress
    onProgress({
      fileId,
      fileName: file.name,
      progress: 0,
      status: "pending",
    });

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Update progress - preparing upload
    onProgress({
      fileId,
      fileName: file.name,
      progress: 2,
      status: "uploading",
    });

    // Construct metadata
    const metadata: Record<string, string> = {
      userId: userId,
      originalName: file.name,
    };
    if (orderNumber) {
      metadata.orderNumber = orderNumber;
    }

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: metadata,
    };

    // Upload to S3
    onProgress({
      fileId,
      fileName: file.name,
      progress: 5,
      status: "uploading",
    });

    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    // Update progress - S3 upload complete
    onProgress({
      fileId,
      fileName: file.name,
      progress: 95,
      status: "uploading",
      fileUrl,
      fileKey: uniqueFileName,
    });

    // Save to Firebase
    await saveToFirebase({
      fileId,
      fileName: file.name,
      fileKey: uniqueFileName,
      fileUrl,
      fileType: file.type,
      userId,
      firebaseCollection,
      orderNumber,
      filesField: filesField as CommonConstant,
    });

    // Update progress - Firebase save complete
    onProgress({
      fileId,
      fileName: file.name,
      progress: 99,
      status: "uploading",
      fileUrl,
      fileKey: uniqueFileName,
    });

    // Final progress - complete
    const finalProgress: UploadProgress = {
      fileId,
      fileName: file.name,
      progress: 100,
      status: "completed",
      fileUrl,
      fileKey: uniqueFileName,
    };

    onProgress(finalProgress);
    return finalProgress;
  } catch (error) {
    const errorProgress: UploadProgress = {
      fileId,
      fileName: file.name,
      progress: 0,
      status: "error",
      error: error instanceof Error ? error.message : "Upload failed",
    };

    onProgress(errorProgress);
    throw error;
  }
}

/**
 * Save file metadata to Firebase
 */
async function saveToFirebase(params: {
  fileId: string;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileType: string;
  userId: string;
  firebaseCollection: string;
  orderNumber?: string;
  filesField: CommonConstant;
}): Promise<void> {
  const {
    fileName,
    fileKey,
    fileUrl,
    fileType,
    userId,
    firebaseCollection,
    orderNumber,
    filesField,
  } = params;

  const fileData = {
    fileName,
    fileType,
    fileUrl,
    fileKey,
    uploadedAt: new Date(),
    uploadedBy: userId,
    ...(orderNumber && { orderNumber }),
  };

  // Save to specified collection
  if (
    firebaseCollection === FIREBASE_COLLECTIONS.ORDERS &&
    orderNumber &&
    filesField
  ) {
    await adminDb
      .collection(FIREBASE_COLLECTIONS.USERS)
      .doc(userId)
      .collection(FIREBASE_COLLECTIONS.ORDERS)
      .doc(orderNumber)
      .update({
        [filesField]: admin.firestore.FieldValue.arrayUnion(fileData),
        updatedAt: new Date(),
      });
  }

  // Save chat files to registeredUsersChats/{userId}/chatFiles subcollection
  if (firebaseCollection === FIREBASE_COLLECTIONS.CHAT_FILES) {
    const documentId = fileKey.replace(/\//g, "_");
    const chatFileRef = adminDb
      .collection(FIREBASE_COLLECTIONS.REGISTERED_USERS_CHATS)
      .doc(userId)
      .collection(FIREBASE_COLLECTIONS.CHAT_FILES)
      .doc(documentId);
    await chatFileRef.set({ ...fileData });
  } else {
    // Save to publicFiles collection for non-chat files
    const documentId = fileKey.replace(/\//g, "_");
    const publicFileRef = adminDb
      .collection(FIREBASE_COLLECTIONS.PUBLIC_FILES)
      .doc(documentId);
    await publicFileRef.set({ ...fileData });
  }
}
