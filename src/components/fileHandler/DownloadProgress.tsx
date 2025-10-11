//DownloadProgress.tsx
import { MdCheckCircle, MdError, MdDownload } from "react-icons/md";

export interface DownloadProgressInfo {
  fileKey: string;
  fileName: string;
  progress: number;
  status: "pending" | "downloading" | "completed" | "error";
  error?: string;
}

interface DownloadProgressProps {
  downloadInfo: DownloadProgressInfo;
  className?: string;
}

export default function DownloadProgress({
  downloadInfo,
  className = "",
}: DownloadProgressProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle className="text-green-500" size={16} />;
      case "error":
        return <MdError className="text-red-500" size={16} />;
      default:
        return <MdDownload className="text-blue-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "downloading":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
        {getStatusIcon(downloadInfo.status)}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 truncate">
              {downloadInfo.fileName}
            </span>
            <span className="text-xs text-gray-500">
              {downloadInfo.progress.toFixed(0)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getStatusColor(
                downloadInfo.status
              )}`}
              style={{ width: `${downloadInfo.progress}%` }}
            />
          </div>

          {/* Error message */}
          {downloadInfo.status === "error" && downloadInfo.error && (
            <p className="text-xs text-red-500 mt-1 truncate">
              {downloadInfo.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
