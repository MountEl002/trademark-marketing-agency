import React, { useState, useCallback, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { uploadFilesToS3, validateFiles } from "@/utils/s3-upload";
import { useAuth } from "@/contexts/AuthContext";
import { UploadedFileInfo } from "@/types/order";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

interface InstructionsEditorProps {
  value: string;
  orderNumber: string;
  onUpdate: (instructions: string, files: UploadedFileInfo[]) => void;
  orderFiles?: UploadedFileInfo[];
}

const InstructionsEditor: React.FC<InstructionsEditorProps> = ({
  value,
  onUpdate,
  orderNumber,
  orderFiles = [],
}) => {
  const [localInstructions, setLocalInstructions] = useState(value);
  const [inputBoxActive, setInputBoxActive] = useState(false);
  const [dropBoxActive, setDropBoxActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize files state with existing orderFiles
  const [files, setFiles] = useState<UploadedFileInfo[]>(() =>
    orderFiles.map((file) => ({
      ...file,
      status: "completed" as const,
      progress: 100,
      id: file.fileKey || Math.random().toString(36).substr(2, 9),
    }))
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Textarea functions
  const handleFocus = () => {
    setInputBoxActive(true);
    setErrorMessage("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setLocalInstructions(textarea.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropBoxActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only deactivate if leaving the container
    if (
      containerRef.current &&
      e.relatedTarget &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setDropBoxActive(false);
    }
  };

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      // Validate files
      const validation = validateFiles(newFiles, {
        maxSizeInMB: 200,
        allowedTypes: [
          // Images
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",

          // Documents
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.oasis.opendocument.text",
          "text/plain",
          "text/rtf",

          // Spreadsheets
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.oasis.opendocument.spreadsheet",

          // Presentations
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.oasis.opendocument.presentation",

          // Archives
          "application/zip",
          "application/x-zip-compressed",
          "application/x-rar-compressed",
          "application/x-7z-compressed",

          // Videos
          "video/mp4",
          "video/mpeg",
          "video/quicktime",
          "video/x-msvideo",
          "video/x-ms-wmv",
          "video/webm",
          "video/3gpp",
          "video/3gpp2",
          "video/x-matroska",
        ],
        maxFiles: 100,
      });

      if (!validation.valid) {
        setErrorMessage(validation.errors[0]);
        return;
      }

      const fileInfos: UploadedFileInfo[] = newFiles.map((file) => ({
        fileName: file.name,
        fileKey: "",
        progress: 0,
        status: "pending",
        id: Math.random().toString(36).substr(2, 9),
        file: file, // Store the actual File object
      }));

      setFiles((prev) => [...prev, ...fileInfos]);
      if (errorMessage) setErrorMessage("");
    },
    [errorMessage]
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDropBoxActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const uploadFiles = async () => {
    if (!user) {
      setErrorMessage("User is not authenticated.");
      return;
    }
    // Validate that either instructions or files are present
    if (localInstructions.trim().length === 0 && files.length === 0) {
      setErrorMessage("Please provide instructions or upload files");
      setInputBoxActive(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const pendingFiles = files.filter((f) => f.status === "pending");

    if (pendingFiles.length === 0) {
      onUpdate(localInstructions, files);
      setIsUploading(false);
      return;
    }

    try {
      // Get the actual File objects from our stored data
      const filesToUpload = pendingFiles
        .map((fileInfo) => fileInfo.file)
        .filter((file): file is File => file !== undefined);

      if (filesToUpload.length === 0) {
        throw new Error("No valid files to upload");
      }

      // Upload to S3
      const uploadedFiles = await uploadFilesToS3(
        filesToUpload,
        user.uid,
        orderNumber
      );

      // Update local state with uploaded file information
      setFiles((prev) =>
        prev.map((file) => {
          const uploadedFile = uploadedFiles.find(
            (uf) => uf.fileName === file.fileName
          );
          if (uploadedFile) {
            return {
              ...file,
              fileKey: uploadedFile.fileKey,
              fileUrl: uploadedFile.fileUrl,
              status: "completed" as const,
              progress: 100,
            };
          }
          return file;
        })
      );

      // Call onUpdate with updated files
      onUpdate(localInstructions, files);
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleFileDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      className="relative vertical-start p-4"
    >
      {dropBoxActive && (
        <div className="absolute inset-0 vertical gap-6 -mx-2 -my-3 bg-black opacity-50 rounded-lg">
          <p className="text-white text-xl sm:text-2xl">Drop here</p>
          <VscFileSymlinkFile size={35} className="text-white" />
        </div>
      )}
      <p className="order-form-field-title">Instructions</p>

      {/* Typing/pasting instructions section */}
      <div
        className={`w-full h-fit p-3 mb-2 transition-all duration-500 border rounded-lg box-border text-sm ${
          errorMessage
            ? "border-red-500"
            : inputBoxActive
            ? "bg-gray-50 border-blue-500"
            : "bg-gray-100 border-transparent"
        }`}
      >
        <textarea
          value={localInstructions}
          onFocus={handleFocus}
          onBlur={() => setInputBoxActive(false)}
          onChange={handleInput}
          placeholder="Describe your assignment. Share references, links to articles or resources, and list any other instructions."
          className=" w-full bg-transparent rounded-lg outline-none min-h-36 resize-none overflow-hidden"
          style={{ height: "auto" }}
        />
      </div>
      {errorMessage && (
        <p className="animate-pulse text-red-600 text-sm">{errorMessage}</p>
      )}

      {/* Uploading files section */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="horizontal mt-8 gap-2 w-full bg-gray-100 transition-all duration-500 rounded-lg border-dashed border border-red-800 hover:border-blue-500 px-2 py-6 text-gray-600"
      >
        <VscFileSymlinkFile size={22} />
        <span className="text-blue-500">Browse</span>
        or drag and drop files here
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(Array.from(e.target.files));
          }
        }}
        accept=".doc,.docx,.pdf,.xlsx,.xls,.zip,.rar"
      />

      {files.length > 0 && (
        <div className="space-y-2 mt-4 w-full">
          {files.map((file) => (
            <div
              key={file.id}
              className="horizontal-space-between w-full bg-gray-300 text-gray-700 p-2 border rounded-md"
            >
              <div className="flex flex-col">
                <span className="truncate">{file.fileName}</span>
                {file.uploadedAt && (
                  <span className="text-xs text-gray-600">saved on cloud</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {file.status === "uploading" && (
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
                {file.status === "completed" && (
                  <span className="text-green-600">✓</span>
                )}
                {file.status === "error" && (
                  <span className="text-red-600">✗</span>
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="horizontal-start gap-2 text-sm mt-2">
        <HiOutlineInformationCircle size={23} />
        <p>
          Maximun file size is 200 MB. Also, you can add a Dropbox, Sendspace,
          or Google dirve link in the instructions.
        </p>
      </div>

      {/* Save Button */}
      <div className="order-form-save-button mt-8">
        <button
          onClick={uploadFiles}
          disabled={isUploading}
          className="group transition-all duration-500"
        >
          Save
          <IoChevronDown
            size={30}
            className="chev-icon group-hover:bg-blue-500"
          />
        </button>
      </div>

      {isUploading && (
        <div className="vertical z-[62] fixed inset-0 bg-black bg-opacity-50">
          <div className="vertical gap-5 bg-white p-4 rounded-lg w-80">
            <LoadingAnimantion />
            <div className="space-y-2">
              <div className="text-center">Uploading files...</div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsEditor;
