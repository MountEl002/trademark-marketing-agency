import React, { useState, useCallback, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { uploadFilesToS3, validateFiles } from "@/utils/s3-upload";
import { deleteFileFromS3 } from "@/utils/delete-file";
import { useAuth } from "@/contexts/AuthContext";
import { UploadedFileInfo } from "@/types/order";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import FileDownloadButton from "@/components/common/FileDownloadButton";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";
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
  const [isDeletingFile, setIsDeletingFile] = useState(false);

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
      // Before calling onUpdate, remove the File object
      const filesWithoutFileObjects = files.filter(
        (file) => delete file.file && true
      );
      onUpdate(localInstructions, filesWithoutFileObjects);
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async (id: string) => {
    const fileToDelete = files.find((f) => f.id === id);
    if (!fileToDelete) return;

    try {
      setIsDeletingFile(true);

      // If the file has been uploaded to S3 (has a fileKey), delete it from cloud
      if (fileToDelete.fileKey && fileToDelete.status === "completed" && user) {
        await deleteFileFromS3({
          fileKey: fileToDelete.fileKey,
          userId: user.uid,
          orderNumber,
        });
      }

      // Remove from local state
      setFiles((prev) => prev.filter((f) => f.id !== id));

      // Update parent component
      // const updatedFiles = files.filter((f) => f.id !== id);
      // onUpdate(localInstructions, updatedFiles);
    } catch (error) {
      console.error("Error removing file:", error);
      setErrorMessage("Failed to delete file. Please try again.");
    } finally {
      setIsDeletingFile(false);
    }
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
        <div className="absolute inset-0 vertical z-[55] gap-6 -mx-2 -my-3 bg-black opacity-50 rounded-lg">
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
      />

      {files.length > 0 && (
        <div className="space-y-2 mt-4 w-full">
          {files.map((file) => (
            <div
              key={file.id}
              className="horizontal-space-between gap-2 relative w-full h-fit bg-gray-300 text-gray-700 px-2 border rounded-md"
            >
              <div className="flex flex-row gap-2 truncate my-1">
                <span className="truncate">{file.fileName}</span>
                <div>
                  {file.status === "completed" && (
                    <span className="text-sm text-green-600">✓ Saved</span>
                  )}
                </div>
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
                {file.status === "error" && (
                  <span className="text-red-600">✗</span>
                )}
              </div>
              <div className="absolute right-2 p-2 group vertical h-full text-gray-500 hover:text-gray-800 transtion-all duration-500">
                <FaEllipsisVertical size={18} />
                <div className="absolute hidden group-hover:flex flex-col items-center justify-center gap-1 z-40 bg-gray-200 -right-2 top-full rounded-md p-2">
                  <FileDownloadButton
                    fileName={file.fileName}
                    fileKey={file.fileKey}
                    localFile={file.file}
                    orderNumber={orderNumber}
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    disabled={isDeletingFile}
                    className={`w-full p-2 text-red-600 bg-transparent rounded-md text-base transition-all duration-500 hover:text-gray-50 hover:bg-red-600 ${
                      isDeletingFile
                        ? "horizontal cursor-not-allowed"
                        : "horizontal-start gap-2"
                    }`}
                  >
                    {isDeletingFile ? (
                      <LoadingAnimantion />
                    ) : (
                      <>
                        <MdOutlineDelete size={20} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
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
