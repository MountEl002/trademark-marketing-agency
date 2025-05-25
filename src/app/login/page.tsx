"use client";

import { useEffect, useState } from "react";
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
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/customer/dashboards");
      console.log("Login attempted with:", { email, stayLoggedIn });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
        switch (error.message) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("Invalid email or password");
            break;
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          case "auth/too-many-requests":
            setError("Too many failed attempts. Please try again later");
            break;
          case "Firebase: Error (auth/invalid-credential).":
            setError("Wrong email or password.");
            break;
          default:
        }
        setTimeout(() => {
          setError("");
        }, 5000);
      } else {
        setError("Failed to log in! Please try again");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="center-content-on-screen">
      <div className="centered-content-on-screen">
        <LightLogo />
        <div className="w-full px-4">
          <h3 className="text-center">Let’s get started</h3>
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
                    setEmailFieldActive(true);
                  }}
                  onBlur={() => {
                    setEmailFieldActive(false);
                  }}
                  onChange={(e) => setEmail(e.target.value)}
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
                    setPasswordFieldActive(true);
                  }}
                  onBlur={() => {
                    setPasswordFieldActive(false);
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-email-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-base text-gray-600">Stay logged in</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-base font-semibold text-blue-500 hover:text-blue-700 transition-colors"
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
