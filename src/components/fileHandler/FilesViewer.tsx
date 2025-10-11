import { UploadedFileInfo } from "@/types/globalTypes";
import ImageDisplay from "@/components/common/chat/ImageDisplay";
import {
  DB_NAMES,
  FILE_DELETE_STRATEGIES,
  FIREBASE_COLLECTIONS,
} from "@/lib/constants";
import Download from "./Download";
import FileDeleteButton from "./FileDeleteButton";

type BgColor = "glight" | "gmedium" | "gldark" | "gdark" | "gvdark";

interface FilesViewerProps {
  fetchedFiles: UploadedFileInfo[];
  userId?: string;
  orderNumber?: string;
  description?: string;
  onFileDelete?: (fileKey: string) => void;
  showDeleteButton: boolean;
  className?: string;
  color?: BgColor;
}

const colorClasses: Record<BgColor, string> = {
  glight: "bg-gray-50 hover:bg-gray-100",
  gmedium: "bg-gray-200 hover:bg-gray-300",
  gldark: "bg-gray-300 hover:bg-gray-400",
  gdark: "bg-gray-500 hover:bg-gray-600",
  gvdark: "bg-gray-700 hover:bg-gray-800",
};

export default function FilesViewer({
  fetchedFiles,
  userId,
  orderNumber,
  description = "Attached files",
  onFileDelete,
  showDeleteButton,
  className = "",
  color = "gmedium",
}: FilesViewerProps) {
  return (
    <div className={`my-4 w-full ${className}`}>
      {fetchedFiles.length > 0 && (
        <div className="flex flex-col my-3 gap-2">
          <p className="text-sm">
            {description} ({fetchedFiles.length})
          </p>
          <div className="w-full space-y-3 max-h-60 overflow-y-auto chat-scrollbars pr-1 rounded-md">
            {fetchedFiles.map((file, index) => {
              // Check if file is an image
              const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(
                file.fileName
              );
              return (
                <div
                  key={file.id || file.fileKey || index}
                  className={`rounded-md transition-all duration-500 ${colorClasses[color]}`}
                >
                  {isImage && (
                    <ImageDisplay
                      fileKey={file.fileKey}
                      fileName={file.fileName}
                      dbName={DB_NAMES.ORDER_FILES}
                      className="mb-1"
                    />
                  )}
                  <div className="flex items-center justify-between bg-white/10 gap-2 rounded p-2">
                    <p className="text-xs truncate">{file.fileName}</p>
                    <div className="flex justify-center items-center gap-1">
                      <Download
                        fileName={file.fileName}
                        fileKey={file.fileKey}
                        className="!p-1"
                        dbName={DB_NAMES.ORDER_FILES}
                      />
                      {showDeleteButton && (
                        <FileDeleteButton
                          fileKey={file.fileKey}
                          fileName={file.fileName}
                          dbName={DB_NAMES.ORDER_FILES}
                          deleteStrategy={
                            FILE_DELETE_STRATEGIES.REVOVE_FROM_ARRAY
                          }
                          arrayFieldName="orderFiles"
                          firebasePath={`${FIREBASE_COLLECTIONS.USERS}/${userId}/${FIREBASE_COLLECTIONS.ORDERS}/${orderNumber}`}
                          onDeleteComplete={() => {
                            if (onFileDelete) {
                              onFileDelete(file.fileKey);
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
