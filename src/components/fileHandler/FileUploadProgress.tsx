import { FileUploadStatus } from "@/lib/constants";
import { MdClose, MdCheckCircle, MdError } from "react-icons/md";
import { VscFileSymlinkFile } from "react-icons/vsc";

export interface FileProgressInfo {
  fileId: string;
  fileName: string;
  progress: number;
  status: FileUploadStatus;
  error?: string;
}

interface FileUploadProgressProps {
  files: FileProgressInfo[];
  onRemoveFile?: (fileId: string) => void;
  showRemoveButton?: boolean;
  className?: string;
}

export default function FileUploadProgress({
  files,
  onRemoveFile,
  showRemoveButton = true,
  className = "",
}: FileUploadProgressProps) {
  if (files.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <MdCheckCircle className="text-green-500" size={16} />;
      case "error":
        return <MdError className="text-red-500" size={16} />;
      default:
        return <VscFileSymlinkFile className="text-blue-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "uploading":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
      <div className="space-y-2 max-h-32 overflow-y-auto chat-scrollbars">
        {files.map((file) => (
          <div
            key={file.fileId}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
          >
            {getStatusIcon(file.status)}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {file.fileName}
                </span>
                <span className="text-xs text-gray-500">{file.progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${getStatusColor(
                    file.status
                  )}`}
                  style={{ width: `${file.progress}%` }}
                />
              </div>

              {/* Error message */}
              {file.status === "error" && file.error && (
                <p className="text-xs text-red-500 mt-1 truncate">
                  {file.error}
                </p>
              )}
            </div>

            {/* Remove button */}
            {showRemoveButton &&
              onRemoveFile &&
              file.status !== "uploading" && (
                <button
                  onClick={() => onRemoveFile(file.fileId)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove file"
                >
                  <MdClose size={16} />
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
