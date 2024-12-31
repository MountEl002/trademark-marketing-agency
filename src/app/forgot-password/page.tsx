"use client";

import React, { useState } from "react";
import LightLogo from "@/components/common/lightLogo";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    try {
      // Add your API call or authentication logic here
      console.log("Password reset requested for:", email);
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  return (
    <>
      <section className="center-content-on-screen">
        <div className="centered-content-on-screen-rp">
          <LightLogo />
          <div>
            <h3 className="text-center">Reset Your Password</h3>
            <p className="text-center mb-4 text-gray-400">
              We&apos;ll email you a temporary link to change your password
            </p>
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
                </div>
              </div>
              <div className="horizontal">
                <button type="submit" className="button-blue w-full">
                  Get Reset Link
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
    </>
  );
};

export default ForgotPassword;
