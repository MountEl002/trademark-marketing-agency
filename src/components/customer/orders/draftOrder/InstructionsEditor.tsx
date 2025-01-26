import React, { useState, useCallback, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { IoChevronDown } from "react-icons/io5";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { HiOutlineInformationCircle } from "react-icons/hi2";

interface InstructionsEditorProps {
  value: string;
  onUpdate: (instructions: string, files: UploadedFileInfo[]) => void;
}

interface UploadedFileInfo {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  id: string;
  url?: string;
}

const InstructionsEditor: React.FC<InstructionsEditorProps> = ({
  value,
  onUpdate,
}) => {
  const [localInstructions, setLocalInstructions] = useState(value);
  const [inputBoxActive, setInputBoxActive] = useState(false);
  const [dropBoxActive, setDropBoxActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const fileInfos: UploadedFileInfo[] = newFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
        id: Math.random().toString(36).substr(2, 9),
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

    const uploadPromises = pendingFiles.map((fileInfo) => {
      const storageRef = ref(
        storage,
        `uploads/${fileInfo.id}-${fileInfo.file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, fileInfo.file);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFiles((prev) => {
              const newFiles = prev.map((f) =>
                f.id === fileInfo.id
                  ? { ...f, progress, status: "uploading" as const }
                  : f
              );

              // Calculate total progress across all files
              const totalProgress =
                newFiles.reduce((acc, file) => {
                  if (file.status === "completed") return acc + 100;
                  if (file.status === "uploading") return acc + file.progress;
                  return acc;
                }, 0) / newFiles.length;

              setUploadProgress(totalProgress);
              return newFiles;
            });
          },
          (error) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileInfo.id ? { ...f, status: "error" as const } : f
              )
            );
            reject(error);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileInfo.id
                  ? { ...f, status: "completed" as const, url: downloadUrl }
                  : f
              )
            );
            resolve();
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      onUpdate(localInstructions, files);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div
      onDragOver={handleFileDragOver}
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
              <span className="truncate">{file.file.name}</span>
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
          Maximun file size is 150 MB. Also, you can add a Dropbox or Sendspace
          link in the instructions.
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-80">
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
