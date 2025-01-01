"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LightLogo from "@/components/common/lightLogo";
import ContinueWith from "@/components/common/login/continueWith";
import EmailInfo from "@/components/common/login/emailInfo";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

const SignUpPage = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password);
      router.push("/customer/orders/new");
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof FirebaseError) {
        // Handle specific Firebase errors
        setError(error.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      } else {
        // Handle any other unexpected errors
        setError("Failed to create an account! Please try again");
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
          <h3 className="text-center">Create account</h3>
          <div>
            <ContinueWith />
          </div>
          <div className="flex flex-row items-center gap-3 my-4">
            <div className="w-full h-0 border-[0.5px] border-gray-200"></div>
            <div className="text-center text-gray-500">or</div>
            <div className="w-full h-0 border-[1px] border-gray-200"></div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label-email-password">Email</label>
              <div className="relative container-input-email-password">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-email-password"
                />
                <EmailInfo />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="label-email-password">
                Password
              </label>
              <div className="relative container-input-email-password">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
            <div className="horizontal mt-5">
              <button type="submit" className="button-blue w-full">
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
          <div>
            <p className="text-sm text-center py-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-500 hover:text-blue-700 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
        <div className="user-agreeement">
          <p>
            By creating an account, you agree to the{" "}
            <Link href="/terms-and-conditions">Terms and Conditions</Link>,{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>,{" "}
            <Link href="/refund-policy">Refund Policy</Link>,{" "}
            <Link href="/code-of-conduct">Code of Conduct</Link>, and{" "}
            <Link href="/confidentiality-policy">Confidentiality Policy</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
