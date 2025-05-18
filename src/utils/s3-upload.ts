//s3-uploads.ts

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { customAlphabet } from "nanoid";

// Generate URL-safe IDs
const generateId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  16
);

// Types
export interface FileUploadResponse {
  fileUrl: string;
  fileKey: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
  userId: string;
  workId?: number; // Optional for chat files
  views?: number; // Optional for chat files
  status?: string; // Optional for chat files
  amount?: number; // Optional for chat files
  fileId?: string; // Optional for WhatsApp status files
}

export interface UploadedFileInfo {
  fileKey: string;
  fileName: string;
  fileUrl?: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  id: string;
  file?: File;
  uploadedAt?: string;
  uploadedBy?: string;
  workId?: string; // For WhatsApp status files
  fileId?: string; // For chat files
}

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
 * Convert File to Buffer for S3 upload
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(Buffer.from(reader.result));
      } else {
        reject(new Error("Failed to convert file to buffer"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Uploads a WhatsApp status image file to S3 and updates Firebase with file metadata
 */
export async function uploadImageToS3(
  file: File,
  userId: string,
  views: number,
  status: string = "pending",
  amount: number
): Promise<FileUploadResponse> {
  try {
    // Validate user exists
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    // Validate file is an image
    const validationResult = validateFile(file);
    if (!validationResult.valid) {
      throw new Error(validationResult.errors[0]);
    }

    // Get current file count to generate workId
    const workId = await generateWorkId(userId);

    // Upload file to S3
    const uploadedFile = await uploadSingleImageToS3(
      file,
      userId,
      workId,
      views,
      status,
      amount
    );

    // Update Firebase with file metadata in user's files subcollection
    await updateFirebaseFileMetadata(uploadedFile, userId);

    return uploadedFile;
  } catch (error) {
    console.error("Error in uploadImageToS3:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Uploads a chat file to S3 and saves to publicFiles collection
 */
export async function uploadChatImageToS3(
  file: File,
  userId: string
): Promise<FileUploadResponse> {
  try {
    // Validate file is an image
    const validationResult = validateFile(file);
    if (!validationResult.valid) {
      throw new Error(validationResult.errors[0]);
    }

    // Generate unique fileId for chat files
    const fileId = generateId();

    // Upload file to S3 (without workId, views, status, amount)
    const uploadedFile = await uploadSingleChatImageToS3(file, userId, fileId);

    // Save metadata to publicFiles collection
    await saveToPublicFilesCollection(uploadedFile);

    return uploadedFile;
  } catch (error) {
    console.error("Error in uploadChatImageToS3:", error);
    throw new Error("Failed to upload chat image");
  }
}

/**
 * Generate a unique workId based on file position in collection
 */
async function generateWorkId(userId: string): Promise<number> {
  try {
    // Get the count of existing files in the user's files subcollection
    const filesCollectionRef = collection(db, "users", userId, "files");
    const filesQuery = query(filesCollectionRef);
    const filesSnapshot = await getDocs(filesQuery);

    // Position starts at 1 for the first file
    const position = filesSnapshot.size + 1;

    // Calculate workId as position * 113
    return position * 113;
  } catch (error) {
    console.error("Error generating workId:", error);
    throw new Error("Failed to generate workId");
  }
}

/**
 * Uploads a single WhatsApp status image file to S3
 */
async function uploadSingleImageToS3(
  file: File,
  userId: string,
  workId: number,
  views: number,
  status: string,
  amount: number
): Promise<FileUploadResponse> {
  const fileExtension = file.name.split(".").pop() || "";
  const uniqueFileName = `${userId}/${generateId()}.${fileExtension}`;

  try {
    // Convert File to Buffer
    const buffer = await fileToBuffer(file);

    // Construct metadata object
    const metadata: Record<string, string> = {
      userId: userId,
      originalName: file.name,
      workId: workId.toString(),
      type: "whatsapp-status",
    };

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: metadata,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return {
      fileUrl,
      fileKey: uniqueFileName,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date(),
      userId,
      workId,
      views,
      status,
      amount,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

/**
 * Uploads a single chat image file to S3
 */
async function uploadSingleChatImageToS3(
  file: File,
  userId: string,
  fileId: string
): Promise<FileUploadResponse> {
  const fileExtension = file.name.split(".").pop() || "";
  const uniqueFileName = `chat/${userId}/${generateId()}.${fileExtension}`;

  try {
    // Convert File to Buffer
    const buffer = await fileToBuffer(file);

    // Construct metadata object
    const metadata: Record<string, string> = {
      userId: userId,
      originalName: file.name,
      fileId: fileId,
      type: "chat-file",
    };

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: metadata,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return {
      fileUrl,
      fileKey: uniqueFileName,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date(),
      userId,
      fileId,
    };
  } catch (error) {
    console.error("Error uploading chat file to S3:", error);
    throw error;
  }
}

/**
 * Updates Firebase with file metadata in user's files subcollection (for WhatsApp status)
 */
async function updateFirebaseFileMetadata(
  uploadedFile: FileUploadResponse,
  userId: string
): Promise<void> {
  try {
    // Generate a document ID for the file in the subcollection
    const documentId = uploadedFile.fileKey.replace(/\//g, "_");

    // Reference to the file document in the user's files subcollection
    const fileRef = doc(db, "users", userId, "files", documentId);

    // Create the file document with metadata including WhatsApp status properties
    await setDoc(fileRef, {
      fileName: uploadedFile.fileName,
      fileType: uploadedFile.fileType,
      fileUrl: uploadedFile.fileUrl,
      uploadedAt: uploadedFile.uploadedAt,
      workId: uploadedFile.workId,
      fileKey: uploadedFile.fileKey,
      views: uploadedFile.views,
      status: uploadedFile.status,
      amount: uploadedFile.amount,
    });
  } catch (error) {
    console.error("Error updating Firebase:", error);
    throw new Error("Failed to update file metadata in Firebase");
  }
}

/**
 * Saves chat file metadata to the publicFiles collection (with fileId)
 */
async function saveToPublicFilesCollection(
  uploadedFile: FileUploadResponse
): Promise<void> {
  try {
    // Generate a document ID for the file in publicFiles collection
    const documentId = uploadedFile.fileKey.replace(/\//g, "_");

    // Reference to the file document in the publicFiles collection
    const publicFileRef = doc(db, "publicFiles", documentId);

    // Create the file document with metadata (with fileId, without workId, views, status, amount)
    await setDoc(publicFileRef, {
      fileName: uploadedFile.fileName,
      fileType: uploadedFile.fileType,
      fileUrl: uploadedFile.fileUrl,
      uploadedAt: uploadedFile.uploadedAt,
      userId: uploadedFile.userId,
      fileKey: uploadedFile.fileKey,
      fileId: uploadedFile.fileId,
    });
  } catch (error) {
    console.error("Error saving to publicFiles collection:", error);
    throw new Error("Failed to save file metadata to publicFiles collection");
  }
}

/**
 * Validates file before upload
 */
export function validateFile(file: File): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxSizeInMB = 200;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  // Check if file is an image
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (file.size > maxSizeInBytes) {
    errors.push(`File exceeds the maximum size of ${maxSizeInMB}MB`);
  }

  if (!allowedImageTypes.includes(file.type)) {
    errors.push(`Only image files are allowed.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
