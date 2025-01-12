import React, { useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

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
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      setLocalInstructions(editor.getHTML());
    },
  });

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const fileInfos: UploadedFileInfo[] = newFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending",
      id: Math.random().toString(36).substr(2, 9),
    }));

    setFiles((prev) => [...prev, ...fileInfos]);
  };

  const uploadFiles = async () => {
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

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`editor-button ${editor.isActive("bold") ? "active" : ""}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`editor-button ${
            editor.isActive("italic") ? "active" : ""
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-button ${
            editor.isActive("bulletList") ? "active" : ""
          }`}
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`editor-button ${
            editor.isActive("orderedList") ? "active" : ""
          }`}
        >
          1.
        </button>
      </div>

      <div
        className="min-h-[200px] border rounded-lg p-4"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <EditorContent editor={editor} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Files
          </button>
          <span className="text-sm text-gray-500">
            or drag and drop files anywhere
          </span>
        </div>
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
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border rounded"
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

      <div className="flex justify-end">
        <button
          onClick={uploadFiles}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Next"}
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
