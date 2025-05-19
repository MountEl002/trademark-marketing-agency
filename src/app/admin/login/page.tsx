//admin login page

"use client";

import React, { useState, useEffect } from "react";
import GoogleLogo from "@/assests/googleLogo.png";
import Image from "next/image";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth(); // Use the context

  useEffect(() => {
    // If user is already logged in and is an admin, redirect from login page
    if (!authLoading && user && isAdmin) {
      router.push("/admin");
    }
  }, [user, isAdmin, authLoading, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (caughtError: unknown) {
      let errorMessage = "Failed to login with Google. Please try again.";

      if (
        typeof caughtError === "object" &&
        caughtError !== null &&
        "message" in caughtError
      ) {
        errorMessage = String((caughtError as { message: unknown }).message);
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
      } else if (typeof caughtError === "string") {
        errorMessage = caughtError;
      }

      setError(errorMessage);
      console.error("Google Login Error:", caughtError);
    } finally {
      setLoading(false);
    }
  };

  // If still checking auth state, or user is admin and being redirected, show loading
  if (authLoading || (user && isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-10 bg-gray-900 text-white">
        <LoadingAnimantion className="mr-3" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 sm:p-10 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Admin Login
        </h1>
        {error && (
          <p className="mb-4 text-red-400 bg-red-900/30 p-3 rounded">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <LoadingAnimantion className="mr-4" />
          ) : (
            <Image
              src={GoogleLogo}
              alt="Google Logo"
              className="object-cover h-5 w-5 mr-3"
            />
          )}
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        <p className="text-xs text-gray-500 mt-6 text-center">
          You must sign in with the Google account associated with DataSphere
          Research Limited.
        </p>
      </div>
    </div>
  );
}
