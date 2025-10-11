import { useState, useCallback } from "react";
import { deleteFromIndexedDB } from "@/utils/client-indexeddb";
import {
  DatabaseName,
  FileDeleteStrategy,
  FileDeleteStatus,
} from "@/lib/constants";

interface DeleteProgress {
  fileKey: string;
  fileName: string;
  progress: number;
  status: FileDeleteStatus;
  error?: string;
}

interface DeleteFileParams {
  fileKey: string;
  fileName: string;
  firebasePath: string;
  deleteStrategy: FileDeleteStrategy;
  arrayFieldName?: string;
  dbName: DatabaseName;
}

interface UseFileDeleteOptions {
  onDeleteComplete?: (fileKey: string) => void;
  onDeleteError?: (fileKey: string, error: string) => void;
  showConfirmation?: boolean;
}

interface UseFileDeleteReturn {
  deleteFile: (params: DeleteFileParams) => Promise<void>;
  deleteMultipleFiles: (files: DeleteFileParams[]) => Promise<void>;
  isDeleting: boolean;
  deleteProgress: Map<string, DeleteProgress>;
  clearProgress: (fileKey?: string) => void;
}

export const useFileDelete = (
  options: UseFileDeleteOptions = {}
): UseFileDeleteReturn => {
  const { onDeleteComplete, onDeleteError, showConfirmation = true } = options;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState<
    Map<string, DeleteProgress>
  >(new Map());

  const updateProgress = useCallback((progress: DeleteProgress) => {
    setDeleteProgress((prev) => new Map(prev.set(progress.fileKey, progress)));
  }, []);

  const clearProgress = useCallback((fileKey?: string) => {
    if (fileKey) {
      setDeleteProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileKey);
        return newMap;
      });
    } else {
      setDeleteProgress(new Map());
    }
  }, []);

  const deleteFile = useCallback(
    async (params: DeleteFileParams): Promise<void> => {
      const {
        fileKey,
        fileName,
        firebasePath,
        deleteStrategy,
        arrayFieldName,
        dbName,
      } = params;

      // Show confirmation dialog if enabled
      if (showConfirmation) {
        const confirmed = window.confirm(
          `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
        );
        if (!confirmed) return;
      }

      try {
        setIsDeleting(true);
        updateProgress({
          fileKey,
          fileName,
          progress: 0,
          status: "pending",
        });

        // Call delete API
        const response = await fetch("/api/files-delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileKey,
            fileName,
            firebasePath,
            deleteStrategy,
            arrayFieldName,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Delete failed: ${response.status} ${response.statusText}`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream available");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                updateProgress(data);

                if (data.status === "error") {
                  throw new Error(data.error || "Delete failed");
                }
              } catch (parseError) {
                console.error("Error parsing delete progress:", parseError);
              }
            }
          }
        }

        // Delete from IndexedDB
        try {
          await deleteFromIndexedDB(dbName, fileKey);
        } catch (indexedDBError) {
          console.error("Failed to delete from IndexedDB:", indexedDBError);
          // Continue even if IndexedDB deletion fails
        }

        // Call success callback
        onDeleteComplete?.(fileKey);

        // Clear progress after short delay
        setTimeout(() => {
          clearProgress(fileKey);
        }, 1000);
      } catch (error) {
        console.error("Delete error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Delete failed";

        updateProgress({
          fileKey,
          fileName,
          progress: 0,
          status: "error",
          error: errorMessage,
        });

        // Call error callback
        onDeleteError?.(fileKey, errorMessage);

        // Clear error after delay
        setTimeout(() => {
          clearProgress(fileKey);
        }, 3000);
      } finally {
        setIsDeleting(false);
      }
    },
    [
      showConfirmation,
      updateProgress,
      clearProgress,
      onDeleteComplete,
      onDeleteError,
    ]
  );

  const deleteMultipleFiles = useCallback(
    async (files: DeleteFileParams[]): Promise<void> => {
      if (files.length === 0) return;

      // Show confirmation for multiple files
      if (showConfirmation) {
        const confirmed = window.confirm(
          `Are you sure you want to delete ${files.length} file(s)? This action cannot be undone.`
        );
        if (!confirmed) return;
      }

      setIsDeleting(true);

      try {
        // Delete files concurrently
        const deletePromises = files.map((file) =>
          deleteFile({ ...file }).catch((error) => {
            console.error(`Failed to delete ${file.fileName}:`, error);
            return Promise.resolve(); // Continue with other deletions
          })
        );

        await Promise.all(deletePromises);
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteFile, showConfirmation]
  );

  return {
    deleteFile,
    deleteMultipleFiles,
    isDeleting,
    deleteProgress,
    clearProgress,
  };
};
