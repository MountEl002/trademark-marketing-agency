"use client";

import React, { useState } from "react";
import LightLogo from "@/components/common/lightLogo";
import ContinueWith from "@/components/common/login/continueWith";
import EmailInfo from "@/components/common/login/emailInfo";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import Link from "next/link";

interface LoginProps {
  onSubmit?: (email: string, password: string, stayLoggedIn: boolean) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email, password, stayLoggedIn);
    }
  };

  return (
    <section className="center-content-on-screen">
      <div className="centered-content-on-screen">
        <LightLogo />
        <div>
          <h3 className="text-center">Log into your account</h3>
          <ContinueWith />
          <div className="flex flex-row items-center gap-3 my-4">
            <div className="w-full h-0 border-[0.5px] border-gray-200"></div>
            <div className="text-center text-gray-500">or</div>
            <div className="w-full h-0 border-[1px] border-gray-200"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label-email-password">Email</label>
              <div className="relative">
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
              <div className="relative">
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
                    <IoMdEye size={20} />
                  ) : (
                    <IoMdEyeOff size={20} />
                  )}
                </button>
                <Tooltip id="password-tooltip" />
              </div>
            </div>
            <div className="horizontal-space-between mb-4">
              <label className="horizontal space-x-2">
                <input
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
              <button type="submit" className="button-blue w-full">
                Continue
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

export default LoginPage;
