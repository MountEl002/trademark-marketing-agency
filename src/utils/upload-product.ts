// utils/s3UploadUtils.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  collection,
  addDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
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

export interface UploadResult {
  success: boolean;
  message: string;
  fileUrl?: string;
  fileKey?: string;
  docId?: string;
}

export interface ProductFileData {
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: FieldValue;
  uploadedBy: string;
  description?: string;
  isActive: boolean;
}

/**
 * Uploads a file to S3 and saves metadata to productFiles collection
 */
export async function uploadProductFile(
  file: File,
  description?: string,
  adminEmail?: string
): Promise<UploadResult> {
  try {
    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileKey = `product-files/${timestamp}-${randomString}.${fileExtension}`;

    // Upload to S3
    const uploadResult = await uploadFileToS3(file, fileKey);

    if (!uploadResult.success) {
      return uploadResult;
    }

    // Save metadata to Firestore
    const metadata: ProductFileData = {
      fileName: file.name,
      fileKey: fileKey,
      fileUrl: uploadResult.fileUrl!,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: serverTimestamp(),
      uploadedBy: adminEmail || "admin",
      description: description || "",
      isActive: true,
    };

    const docRef = await addDoc(collection(db, "productFiles"), metadata);

    return {
      success: true,
      message: "File uploaded successfully",
      fileUrl: uploadResult.fileUrl,
      fileKey: fileKey,
      docId: docRef.id,
    };
  } catch (error) {
    console.error("Error uploading product file:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

/**
 * Uploads a file directly to S3 bucket
 */
async function uploadFileToS3(
  file: File,
  fileKey: string
): Promise<UploadResult> {
  try {
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string;

    if (!bucketName) {
      throw new Error("S3 bucket name not configured");
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Prepare upload parameters
    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: uint8Array,
      ContentType: file.type,
      ContentLength: file.size,
    };

    // Upload to S3
    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construct file URL
    const fileUrl = `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      success: true,
      message: "File uploaded to S3 successfully",
      fileUrl: fileUrl,
      fileKey: fileKey,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload to S3",
    };
  }
}

/**
 * Validates file before upload
 */
export function validateFile(file: File): {
  isValid: boolean;
  message: string;
} {
  // Check file size (max 10MB)
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      message: "File size must be less than 10MB",
    };
  }

  // Check file type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message:
        "File type not supported. Please upload images, PDFs, or document files.",
    };
  }

  return {
    isValid: true,
    message: "File is valid",
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
