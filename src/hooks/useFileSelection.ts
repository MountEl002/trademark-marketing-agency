import { useCallback, useState } from "react";

// Custom hook for file selection
export const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  return {
    selectedFiles,
    selectedFilesCount: selectedFiles.length,
    addFiles,
    removeFile,
    clearFiles,
  };
};
