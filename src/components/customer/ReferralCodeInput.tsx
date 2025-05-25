"use client";

import { useState, useEffect } from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { verifyReferralCode } from "@/contexts/userService";
import LoadingAnimantion from "../common/LoadingAnimantion";

interface ReferralCodeInputProps {
  onIsCodeValid: (value: boolean | null) => void;
  onReferralCode: (value: string) => void;
}

const ReferralCodeInput = ({
  onIsCodeValid,
  onReferralCode,
}: ReferralCodeInputProps) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [fieldActive, setFieldActive] = useState<boolean>(false);

  // ✅ Move parent callbacks to useEffect hooks
  useEffect(() => {
    onReferralCode(referralCode);
  }, [referralCode, onReferralCode]);

  useEffect(() => {
    onIsCodeValid(isCodeValid);
  }, [isCodeValid, onIsCodeValid]);

  // Dynamic border styles based on field focus
  const fieldBorder = `transition-all duration-500 border ${
    fieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  // Verify referral code by checking userNames collection
  useEffect(() => {
    const checkReferralCode = async () => {
      if (referralCode.length >= 3) {
        setIsChecking(true);
        try {
          const exists = await verifyReferralCode(referralCode);
          setIsCodeValid(exists);
        } catch (error) {
          console.error("Error checking referral code:", error);
          setIsCodeValid(false);
        } finally {
          setIsChecking(false);
        }
      }
    };

    const timer = setTimeout(() => {
      checkReferralCode();
    }, 500);

    return () => clearTimeout(timer);
  }, [referralCode]);

  return (
    <>
      <div className="mb-4">
        <label htmlFor="referralCode" className="label-email-password">
          Referral code (optional)
        </label>
        <div
          className={`relative container-input-email-password ${fieldBorder}`}
        >
          <input
            id="referralCode"
            type="text"
            value={referralCode}
            onFocus={() => setFieldActive(true)}
            onBlur={() => setFieldActive(false)}
            onChange={(e) => {
              const value = e.target.value.trim();
              setReferralCode(value);
            }}
            placeholder="Enter referral code if you have one"
            className="input-email-password pr-10"
            autoComplete="off"
          />
          {referralCode && (
            <div className="absolute right-3 top-2.5">
              {isChecking ? (
                <LoadingAnimantion />
              ) : isCodeValid ? (
                <IoMdCheckmarkCircle
                  size={20}
                  className="text-green-500"
                  data-tooltip-id="code-valid"
                />
              ) : (
                <IoMdCloseCircle
                  size={20}
                  className="text-red-500"
                  data-tooltip-id="code-invalid"
                />
              )}
            </div>
          )}
        </div>
        {referralCode && !isChecking && (
          <p
            className={`text-sm mt-1 ${
              isCodeValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {isCodeValid ? "Valid referral code" : "Invalid referral code"}
          </p>
        )}
      </div>
    </>
  );
};

export default ReferralCodeInput;
