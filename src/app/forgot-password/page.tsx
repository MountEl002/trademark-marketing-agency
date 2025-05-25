"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path to your AuthContext
import { MdEmail, MdCheckCircle, MdError } from "react-icons/md";
import LightLogo from "@/components/common/LightLogo";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const { resetPassword } = useAuth(); // Use the auth context

  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/customer/dashboards");
    }
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await resetPassword(email);
      setMessage(
        "Password reset email sent! Check your inbox and spam folder."
      );
      setMessageType("success");
      setEmail(""); // Clear the email field on success
    } catch (error: unknown) {
      console.error("Error during password reset:", error);

      // Handle specific Firebase error codes
      let errorMessage = "An error occurred. Please try again.";

      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string };
        switch (firebaseError.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email address.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/too-many-requests":
            errorMessage =
              "Too many requests. Please wait before trying again.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection.";
            break;
        }
      }
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="center-content-on-screen">
        <div className="centered-content-on-screen-rp !h-fit">
          <LightLogo />
          <div>
            <h3 className="text-center">Reset Your Password</h3>
            <p className="text-center mb-4 text-gray-400">
              We&apos;ll email you a temporary link to change your password
            </p>

            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  messageType === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {messageType === "success" ? (
                  <MdCheckCircle className="text-green-500 flex-shrink-0" />
                ) : (
                  <MdError className="text-red-500 flex-shrink-0" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label-email-password">Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-email-password pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div className="horizontal">
                <button
                  type="submit"
                  className="button-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Get Reset Link"}
                </button>
              </div>
            </form>

            <div>
              <p className="text-sm text-center py-4">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
