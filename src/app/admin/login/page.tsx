// app/admin/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc"; // Using react-icons for Google icon
import LoadingScreen from "@/components/common/LoadingScreen";

export default function AdminLoginPage() {
  const { user, isAdmin, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user && isAdmin) {
      router.push("/admin");
    } else if (user && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  const handleAdminGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Admin Google Sign-In Error:", error);
    }
  };

  if (loading || (user && isAdmin)) {
    return <LoadingScreen />;
  }
  if (user && !isAdmin) {
    return <LoadingScreen message="Access denied. Redirecting..." />;
  }

  // Only show login form if not loading, and not (user && isAdmin)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-slate-800 p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
          Admin Login
        </h1>

        <button
          onClick={handleAdminGoogleSignIn}
          className="w-full flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FcGoogle className="mr-3 text-2xl" />
          Sign in with Google
        </button>

        <p className="text-sm text-gray-400 mt-8 text-center">
          You must sign in with the Google account associated with Trademark
          Marketing Agency
        </p>
      </div>
    </div>
  );
}
