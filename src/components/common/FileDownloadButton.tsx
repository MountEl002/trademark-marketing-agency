import React, { useEffect, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { downloadFileFromS3 } from "@/utils/dowload-file";
import { useAuth } from "@/contexts/AuthContext";
import { isUserSuperAdmin } from "@/utils/admin-setup";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface FileDownloadButtonProps {
  fileName: string;
  fileKey: string;
  localFile?: File;
  className?: string;
}

const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  fileName,
  fileKey,
  localFile,
  className = "",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const [adminAuthStatus, setAdminAuthStatus] = useState({
    isAdmin: false,
    adminUid: null as string | null,
  });

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminStatus = await isUserSuperAdmin(firebaseUser.uid);
        setAdminAuthStatus({
          isAdmin: adminStatus,
          adminUid: adminStatus ? firebaseUser.uid : null,
        });
      } else {
        setAdminAuthStatus({
          isAdmin: false,
          adminUid: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = async () => {
    if (!user && !adminAuthStatus.isAdmin) {
      setError("User is not authenticated");
      return;
    }

    const downLoaderId = adminAuthStatus.isAdmin
      ? `admin_${adminAuthStatus.adminUid}`
      : user!.uid;

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
        if (!fileKey.trim()) {
          throw new Error("Invalid file key provided");
        }
        // Handle S3 file download
        await downloadFileFromS3({
          fileKey,
        });
        if (adminAuthStatus.isAdmin) {
          await downloadFileFromS3({
            fileKey,
            userId: downLoaderId,
            orderNumber,
            isSuperAdmin: true,
          });
        } else {
          await downloadFileFromS3({
            fileKey,
            userId: downLoaderId,
            orderNumber,
          });
        }
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
        className={`horizontal-start gap-2 w-full p-2 text-gray-600 bg-gray-200 rounded-sm text-sm transition-all duration-500 hover:bg-gray-50 
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
