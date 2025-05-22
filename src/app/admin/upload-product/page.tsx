"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import Image from "next/image";
import {
  FiUpload,
  FiCheck,
  FiX,
  FiLoader,
  FiImage,
  FiFileText,
  FiChevronLeft,
} from "react-icons/fi";
import {
  uploadProductFile,
  validateFile,
  formatFileSize,
  UploadResult,
} from "@/utils/upload-product";

interface FilePreview {
  file: File;
  preview?: string;
  isImage: boolean;
}

export default function AdminUploadPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<FilePreview | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
      return;
    }
  }, [loading, user, isAdmin, router]);

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      setUploadResult({
        success: false,
        message: validation.message,
      });
      return;
    }

    const isImage = file.type.startsWith("image/");
    const filePreview: FilePreview = {
      file,
      isImage,
    };

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        filePreview.preview = e.target?.result as string;
        setSelectedFile(filePreview);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(filePreview);
    }

    setUploadResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadResult(null);

      const result = await uploadProductFile(
        selectedFile.file,
        description,
        user?.email || "admin"
      );

      setUploadResult(result);

      if (result.success) {
        // Reset form on success
        setSelectedFile(null);
        setDescription("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "An unexpected error occurred during upload",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setDescription("");
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FiImage className="text-blue-500" size={24} />;
    } else {
      return <FiFileText className="text-gray-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back to admin dashboard
          </button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Upload Product File
          </h2>
          <p className="text-gray-600 mt-2">
            Upload promotional images and files that users can download
          </p>
        </div>
        {/* Status Section */}
        <div className="p-6">
          {uploadResult && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                uploadResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {uploadResult.success ? (
                    <FiCheck className="text-green-500" size={20} />
                  ) : (
                    <FiX className="text-red-500" size={20} />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      uploadResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {uploadResult.success
                      ? "Upload Successful!"
                      : "Upload Failed"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      uploadResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {uploadResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Recent Upload Info */}
          {uploading && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <FiLoader className="animate-spin text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  Uploading file to S3 and saving metadata...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Select File
            </h3>

            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <FiUpload className="text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Images, PDFs, and documents up to 10MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
              onChange={handleFileInputChange}
            />

            {/* File Preview */}
            {selectedFile && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Selected File</h4>
                  <button
                    onClick={clearSelection}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(selectedFile.file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedFile.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.file.size)} •{" "}
                      {selectedFile.file.type}
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {selectedFile.isImage && selectedFile.preview && (
                  <div className="mt-3">
                    <Image
                      src={selectedFile.preview}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="rounded object-cover"
                    />
                  </div>
                )}
              </div>
            )}
            {/* Upload Button */}
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
