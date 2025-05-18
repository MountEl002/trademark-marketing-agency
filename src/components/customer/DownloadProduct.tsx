"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FileDownloadButton from "@/components/common/FileDownloadButton";
import ProductPlaceholder from "@/assests/PlaceholderProduct.jpg";

interface ProductFile {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: { toDate: () => Date };
}

const DownloadProduct: React.FC = () => {
  const [latestFile, setLatestFile] = useState<ProductFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placeholderFile, setPlaceholderFile] = useState<File | null>(null);

  useEffect(() => {
    // Preload the placeholder image as a File object for download
    const loadPlaceholderAsFile = async () => {
      try {
        // Fetch the placeholder image and convert it to a Blob
        const response = await fetch(ProductPlaceholder.src);
        const blob = await response.blob();

        // Create a File object from the Blob
        const file = new File([blob], "travel-promotion.jpg", {
          type: "image/jpeg",
        });

        setPlaceholderFile(file);
      } catch (err) {
        console.error("Error loading placeholder image:", err);
      }
    };

    loadPlaceholderAsFile();
  }, []);

  useEffect(() => {
    const fetchLatestFile = async () => {
      try {
        setIsLoading(true);

        // Reference the productFiles collection
        const filesRef = collection(db, "productFiles");

        // Create a query to get the most recent file
        const q = query(filesRef, orderBy("uploadedAt", "desc"), limit(1));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first (and only) document
          const docData = querySnapshot.docs[0].data() as ProductFile;
          setLatestFile(docData);
        } else {
          // No files found in collection
          setLatestFile(null);
        }
      } catch (err) {
        console.error("Error fetching latest file:", err);
        setError("Failed to load promotion image");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestFile();
  }, []);

  // Function to handle direct download button click
  const handleDownloadNow = () => {
    if (latestFile) {
      // If we have a file from Firebase, trigger download using the button's ref
      document.getElementById("status-download-button")?.click();
    } else if (placeholderFile) {
      // If no Firebase file but placeholder is loaded, download the placeholder
      const url = window.URL.createObjectURL(placeholderFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = "travel-promotion.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // Neither Firebase file nor placeholder is available
      console.error("No file available to download");
    }
  };

  return (
    <div className="w-fit mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
      {/* Download instructions */}
      <div className="mt-4 text-center">
        <p className="font-medium text-gray-800 uppercase tracking-wide mb-4">
          DOWNLOAD THIS IMAGE AND POST ON YOUR STATUS TO EARN WITH VIEWS
        </p>

        {/* Display the visible download button */}
        <button
          onClick={handleDownloadNow}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded mb-8 transition-colors duration-300"
        >
          DOWNLOAD NOW
        </button>

        {/* Hidden FileDownloadButton that gets triggered by the visible button */}
        {latestFile && (
          <div className="hidden">
            <FileDownloadButton
              fileName={latestFile.fileName}
              fileKey={latestFile.fileKey}
            />
          </div>
        )}

        {/* Error message if needed */}
        {error && <p className="mt-2 text-red-500 text-sm hidden">{error}</p>}
      </div>

      {/* Travel promotion card */}
      <div className="relative horizontal overflow-hidden rounded-lg">
        {/* Image */}
        <div className="w-fit h-auto aspect-[3/1] relative">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : (
            <Image
              src={latestFile?.fileUrl || ProductPlaceholder}
              alt="Promotion"
              className="object-cover rounded-lg"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadProduct;
