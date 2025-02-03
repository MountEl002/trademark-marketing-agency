import React, { useState } from "react";
import { HiDownload } from "react-icons/hi";
import { downloadFileFromS3 } from "@/utils/dowload-file";
import { useAuth } from "@/contexts/AuthContext";

interface FileDownloadButtonProps {
  fileName: string;
  fileKey?: string;
  localFile?: File;
  orderNumber?: string;
  className?: string;
}

const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  fileName,
  fileKey,
  localFile,
  orderNumber,
  className = "",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  const handleDownload = async () => {
    if (!user) {
      setError("User is not authenticated");
      return;
    }

    setIsDownloading(true);
    setError("");

    try {
      if (localFile) {
        // Handle local file download
        const url = window.URL.createObjectURL(localFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else if (fileKey) {
        // Handle S3 file download
        await downloadFileFromS3({
          fileKey,
          userId: user.uid,
          orderNumber,
        });
      } else {
        throw new Error("No file available for download");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setError(
        error instanceof Error ? error.message : "Failed to download file"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`horizontal-start gap-2 w-full p-2 text-gray-600 bg-transparent rounded-md text-base transition-all duration-500 hover:bg-gray-50 
          ${isDownloading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
          ${className}`}
        title="Download file"
      >
        <HiDownload className="w-4 h-4" />
        {isDownloading ? "Downloading..." : "Download"}
      </button>
      {error && (
        <div className="absolute bottom-full left-0 mb-1 w-48 p-2 bg-red-100 text-red-700 text-xs rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileDownloadButton;
