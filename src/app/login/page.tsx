"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import LightLogo from "@/components/common/LightLogo";
import ContinueWithGoogle from "@/components/common/login/ContinueWithGoogle";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emialFieldActive, setEmailFieldActive] = useState(false);
  const [passwordFieldActive, setPasswordFieldActive] = useState(false);

  console.log("[Login] Component rendered", {
    email,
    hasPassword: !!password,
    loading,
    error,
  });

  const emialFieldBorder = `transition-all duration-500 border ${
    emialFieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  const passwordFieldBorder = `transition-all duration-500 border ${
    passwordFieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Login] handleSubmit called", {
      email,
      hasPassword: !!password,
      stayLoggedIn,
    });

    setError("");
    setLoading(true);
    console.log("[Login] Loading state set to true");

    try {
      console.log("[Login] Calling login function");
      await login(email, password);
      console.log("[Login] Login function completed successfully");

      console.log("[Login] Attempting manual redirect to dashboard");
      router.push("/customer/dashboards");
      console.log("[Login] Manual redirect called");

      console.log("Login attempted with:", { email, stayLoggedIn });
    } catch (error) {
      console.error("[Login] Error during login:", error);

      if (error instanceof FirebaseError) {
        console.log("[Login] Firebase error detected", {
          code: error.code,
          message: error.message,
        });

        setError(error.message);
        switch (error.message) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            console.log("[Login] Invalid credentials");
            setError("Invalid email or password");
            break;
          case "auth/invalid-email":
            console.log("[Login] Invalid email format");
            setError("Invalid email address");
            break;
          case "auth/too-many-requests":
            console.log("[Login] Too many requests");
            setError("Too many failed attempts. Please try again later");
            break;
          case "Firebase: Error (auth/invalid-credential).":
            console.log("[Login] Invalid credential");
            setError("Wrong email or password.");
            break;
          default:
            console.log("[Login] Unhandled Firebase error", error.message);
        }
        setTimeout(() => {
          console.log("[Login] Clearing error after timeout");
          setError("");
        }, 5000);
      } else {
        console.error("[Login] Non-Firebase error:", error);
        setError("Failed to log in! Please try again");
        setTimeout(() => {
          console.log("[Login] Clearing error after timeout");
          setError("");
        }, 5000);
      }
    } finally {
      console.log("[Login] Setting loading to false");
      setLoading(false);
    }
  };

  return (
    <section className="center-content-on-screen">
      <div className="centered-content-on-screen">
        <LightLogo />
        <div className="w-full px-4">
          <h3 className="text-center">Let's get started</h3>
          <p className="text-center mb-6">
            Sign in to continue to Trademark Marketing
          </p>
          <ContinueWithGoogle className="continue-with" />
          <div className="flex flex-row items-center gap-3 my-4">
            <div className="w-full h-0 border-[0.5px] border-gray-200"></div>
            <div className="text-center text-gray-500">or</div>
            <div className="w-full h-0 border-[1px] border-gray-200"></div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg relative mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="label-email-password">
                Email
              </label>
              <div
                className={`relative container-input-email-password ${emialFieldBorder}`}
              >
                <input
                  id="email"
                  type="email"
                  value={email}
                  onFocus={() => {
                    console.log("[Login] Email field focused");
                    setEmailFieldActive(true);
                  }}
                  onBlur={() => {
                    console.log("[Login] Email field blurred");
                    setEmailFieldActive(false);
                  }}
                  onChange={(e) => {
                    console.log("[Login] Email changed:", e.target.value);
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter your email"
                  className="input-email-password"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="label-email-password">
                Password
              </label>
              <div
                className={`relative container-input-email-password ${passwordFieldBorder}`}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onFocus={() => {
                    console.log("[Login] Password field focused");
                    setPasswordFieldActive(true);
                  }}
                  onBlur={() => {
                    console.log("[Login] Password field blurred");
                    setPasswordFieldActive(false);
                  }}
                  value={password}
                  onChange={(e) => {
                    console.log(
                      "[Login] Password changed, length:",
                      e.target.value.length
                    );
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter your password"
                  className="input-email-password"
                />
                <button
                  type="button"
                  onClick={() => {
                    console.log("[Login] Toggle password visibility");
                    setShowPassword(!showPassword);
                  }}
                  data-tooltip-id="password-tooltip"
                  data-tooltip-content="Click to show or hide password"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <IoMdEye size={20} className="password-eye" />
                  ) : (
                    <IoMdEyeOff size={20} className="password-eye" />
                  )}
                </button>
                <Tooltip id="password-tooltip" />
              </div>
            </div>
            <div className="horizontal-space-between mb-4">
              <label htmlFor="rememberMe" className="horizontal space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={stayLoggedIn}
                  onChange={(e) => {
                    console.log(
                      "[Login] Stay logged in changed:",
                      e.target.checked
                    );
                    setStayLoggedIn(e.target.checked);
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-base text-gray-600">Stay logged in</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-base font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() =>
                  console.log("[Login] Forgot password link clicked")
                }
              >
                Forgot password?
              </Link>
            </div>
            <div className="horizontal">
              <button
                type="submit"
                disabled={loading}
                className={`button-blue w-full ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                onClick={() => console.log("[Login] Submit button clicked")}
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-4 text-gray-100 rounded-[50%] border-t-transparent mx-auto" />
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
          <div>
            <p className="text-sm text-center py-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() => console.log("[Login] Sign up link clicked")}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
