import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { customAlphabet } from 'nanoid';

// Generate URL-safe IDs
const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16);

// Types
export interface FileUploadResponse {
  fileUrl: string;
  fileKey: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
  userId: string;
  orderNumber: string;
}

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  }, endpoint: `https://s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`,
  forcePathStyle: true,
  customUserAgent: 'hq-essay/1.0.0'
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
        reject(new Error('Failed to convert file to buffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Uploads multiple files to S3 and updates Firebase with file metadata
 */
export async function uploadFilesToS3(
  files: File[],
  userId: string,
  orderNumber: string,
  isSuperAdmin: boolean = false
): Promise<FileUploadResponse[]> {
  try {
    // Validate user permission
    if (!isSuperAdmin) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
    }

    // Upload all files to S3 and get their metadata
    const uploadPromises = files.map(file => uploadSingleFileToS3(file, userId, orderNumber));
    const uploadedFiles = await Promise.all(uploadPromises);

    // Update Firebase with file metadata
    await updateFirebaseFileMetadata(uploadedFiles, userId, orderNumber);

    return uploadedFiles;
  } catch (error) {
    console.error("Error in uploadFilesToS3:", error);
    throw new Error("Failed to upload files");
  }
}

/**
 * Uploads a single file to S3
 */
async function uploadSingleFileToS3(
  file: File,
  userId: string, orderNumber: string,
): Promise<FileUploadResponse> {
  const fileExtension = file.name.split('.').pop() || '';
  const uniqueFileName = `${userId}/${generateId()}.${fileExtension}`;
  
  try {
    // Convert File to Buffer
    const buffer = await fileToBuffer(file);

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        userId: userId,
        originalName: file.name, 
        orderNumber: orderNumber,
      },
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
      orderNumber,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

/**
 * Updates Firebase with file metadata
 */
async function updateFirebaseFileMetadata(
  uploadedFiles: FileUploadResponse[],
  userId: string, 
  orderNumber: string,
): Promise<void> {
if (!orderNumber) {
    throw new Error("Order number is required");
  }

  const userFileRef = doc(db, "files", userId);
  const orderFileRef = orderNumber ? doc(db, "orders", orderNumber, "files", userId) : null;

  try {
    const docSnap = await getDoc(userFileRef);

    if (!docSnap.exists()) {
      await setDoc(userFileRef, {
        userId,
        files: uploadedFiles,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      await updateDoc(userFileRef, {
        userId,
        files: arrayUnion(...uploadedFiles),
        updatedAt: new Date(),
      });
    }

    // If order number exists, also update order's files collection
    if (orderFileRef) {
      const orderFilesSnap = await getDoc(orderFileRef);
      if (!orderFilesSnap.exists()) {
        await setDoc(orderFileRef, {
          userId,
          orderNumber,
          files: uploadedFiles,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        await updateDoc(orderFileRef, {
          files: arrayUnion(...uploadedFiles),
          updatedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error updating Firebase:", error);
    throw new Error("Failed to update file metadata in Firebase");
  }
}

/**
 * Type for file validation options
 */
export interface FileValidationOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

/**
 * Validates files before upload
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {}
): { valid: boolean; errors: string[] } {
  const {
    maxSizeInMB = 200,
    allowedTypes = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  
  // Documents
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.oasis.opendocument.text', // .odt
  'text/plain', // .txt
  'text/rtf', // .rtf
  
  // Spreadsheets
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.oasis.opendocument.spreadsheet', // .ods
  
  // Presentations
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.oasis.opendocument.presentation', // .odp
  
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  
  // Videos
  'video/mp4',
  'video/mpeg',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/x-ms-wmv', // .wmv
  'video/webm',
  'video/3gpp', // .3gp
  'video/3gpp2', // .3g2
  'video/x-matroska', // .mkv
  
  // Other
  'application/xml',
  'text/csv',
  'text/markdown',
  'application/json'
],
    maxFiles = 100
  } = options;

  const errors: string[] = [];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (files.length > maxFiles) {
    errors.push(`Maximum number of files allowed is ${maxFiles}`);
    return { valid: false, errors };
  }

  files.forEach(file => {
    if (file.size > maxSizeInBytes) {
      errors.push(`${file.name} exceeds the maximum size of ${maxSizeInMB}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name} has an unsupported file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}