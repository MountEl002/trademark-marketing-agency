import { MdDelete } from "react-icons/md";
import { useFileDelete } from "@/hooks/useFileDelete";
import { DatabaseName, FileDeleteStrategy } from "@/lib/constants";

interface FileDeleteButtonProps {
  fileKey: string;
  fileName: string;
  firebasePath: string;
  deleteStrategy: FileDeleteStrategy;
  arrayFieldName?: string;
  className?: string;
  onDeleteComplete: () => void;
  onDeleteError?: (error: string) => void;
  dbName: DatabaseName;
}

export default function FileDeleteButton({
  fileKey,
  fileName,
  firebasePath,
  deleteStrategy,
  arrayFieldName,
  className = "",
  onDeleteComplete,
  onDeleteError,
  dbName,
}: FileDeleteButtonProps) {
  const { deleteFile, isDeleting } = useFileDelete({
    onDeleteComplete: onDeleteComplete,
    onDeleteError: (_, error) => onDeleteError?.(error),
    showConfirmation: true,
  });

  const handleDelete = async () => {
    await deleteFile({
      fileKey,
      fileName,
      firebasePath,
      deleteStrategy,
      arrayFieldName,
      dbName,
    });
  };

  return (
    <div className="relative text-xs">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`group bg-red-50 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 hover:text-white p-1 rounded transition-all duration-300 ${className}`}
        title={`Delete ${fileName}`}
      >
        <MdDelete
          className={`transition-transform duration-300 ${
            isDeleting ? "animate-pulse" : "group-hover:scale-110"
          }`}
          size={16}
        />
      </button>
    </div>
  );
}
