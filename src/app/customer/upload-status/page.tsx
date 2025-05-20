"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { validateFile, uploadImageToS3 } from "@/utils/s3-upload";
import { getUserBalance, getUserPackageNames } from "@/contexts/userService";
import Link from "next/link";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

const WhatsappStatusUpload: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [views, setViews] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [payments, setPayments] = useState<number>(0);
  const [userPackages, setUserPackages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Package rates
  const PACKAGE_RATES: { [key: string]: number } = {
    Basic: 15,
    Bronze: 25,
    Silver: 50,
    Gold: 100,
  };

  // Fetch user balance, payments, and packages on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userBalance = await getUserBalance(user.uid);
          setBalance(userBalance);

          const packages = await getUserPackageNames(user.uid);
          setUserPackages(packages);

          // In a real app, you would have a similar function to fetch payments
          // For now, we'll just set it to 0 as per the image
          setPayments(0);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file is an image
      const validation = validateFile(file);

      if (!validation.valid) {
        setUploadError(validation.errors.join(", "));
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setUploadError("");
    }
  };

  const handleViewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setViews(isNaN(value) ? 0 : value);
  };

  // Calculate amount based on views and user packages
  const calculateAmount = (views: number): number => {
    if (views <= 0 || userPackages.length === 0) {
      return 0;
    }

    let totalAmount = 0;

    for (const packageName of userPackages) {
      const rate = PACKAGE_RATES[packageName];
      if (rate) {
        totalAmount += views * rate;
      }
    }

    return totalAmount;
  };

  const handleUpload = async () => {
    if (!user?.uid || !selectedFile || views <= 0) {
      setUploadError("Please select an image and enter the number of views");
      return;
    }

    if (userPackages.length === 0) {
      setUploadError(
        "You don't have any packages. Please purchase a package first."
      );
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");

      // Calculate the amount based on views and packages
      const amount = calculateAmount(views);

      // Upload the image file to S3 with all required parameters
      const uploadedFile = await uploadImageToS3(
        selectedFile,
        user.uid,
        views,
        "pending", // status defaults to "pending"
        amount
      );

      console.log("File uploaded successfully:", uploadedFile);
      console.log("Views requested:", views);
      console.log("User packages:", userPackages);
      console.log("Amount calculated:", amount);

      // Reset form after successful upload
      setSelectedFile(null);
      setViews(0);

      // In a real app, you would refresh the balance here
      // For now, we'll just show an alert
      alert(
        `Upload successful! Your status with ${views} views (Ksh ${amount.toFixed(
          2
        )}) is being reviewed and will be processed soon!`
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="vertical min-h-screen min-w-screen bg-gray-100">
      <div className="p-6 bg-gray-50 mx-auto max-w-6xl rounded-lg shadow-sm w-fit">
        {/* Balance and Payment Display */}
        <div className="horizontal-space-between mb-8">
          <div className="horizontal gap-4">
            <div className="border-dashed border rounded-md p-4 mx-2">
              <p className="text-2xl font-bold text-gray-800">
                Ksh {balance.toFixed(2)}
              </p>
              <p className="text-gray-500">Deposit Balance</p>
            </div>
            <div className="border-dashed border rounded-md p-4 mx-2">
              <p className="text-2xl font-bold text-gray-800">Ksh {payments}</p>
              <p className="text-gray-500">Payments</p>
            </div>
          </div>
          <Link
            href="/customer/whatsapp-records"
            className="vertical text-white bg-green-500 px-4 py-2 rounded-md shadow-sm hover:bg-green-600 transition-all duration-500"
          >
            Logs
          </Link>
        </div>

        {/* User Packages Display */}
        {userPackages.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h5 className="font-semibold mb-2">Your Active Packages:</h5>
            <div className="flex flex-wrap gap-2">
              {userPackages.map((packageName, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {packageName} (Ksh {PACKAGE_RATES[packageName]}/view)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Upload Status Section */}
        <div className="mb-6">
          <h4>Upload your whatsapp status and get paid</h4>
          {/* File Upload Section */}
          <div className="mb-4">
            <button
              onClick={handleChooseFile}
              className="border rounded py-2 px-4 text-gray-700 hover:bg-gray-100"
            >
              Choose File
            </button>
            <span className="ml-2 text-gray-600">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Views Input */}
          <div className="mb-4">
            <label className="block mb-2">Enter Number of Views</label>
            <input
              type="number"
              value={views || ""}
              onChange={handleViewsChange}
              placeholder="views"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-green-500"
              min="1"
            />
            {views > 0 && userPackages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Calculation:{" "}
                  {userPackages
                    .map((pkg) => `${views} × ${PACKAGE_RATES[pkg]} (${pkg})`)
                    .join(" + ")}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Estimated payment: Ksh {calculateAmount(views).toFixed(2)}
                </p>
              </div>
            )}
            {views > 0 && userPackages.length === 0 && (
              <p className="mt-1 text-sm text-red-600">
                No packages found. Please purchase a package first.
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={
              isUploading ||
              !selectedFile ||
              views <= 0 ||
              userPackages.length === 0
            }
            className={`rounded py-2 px-4 text-white ${
              isUploading ||
              !selectedFile ||
              views <= 0 ||
              userPackages.length === 0
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isUploading ? (
              <div className="horizontal gap-4">
                <LoadingAnimantion /> Uploading...
              </div>
            ) : (
              "Upload Image"
            )}
          </button>

          {/* Error Message */}
          {uploadError && <p className="mt-2 text-red-500">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
};

export default WhatsappStatusUpload;
