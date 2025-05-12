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
}
