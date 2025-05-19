"use client";

import { useState, useEffect } from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { doc, getDoc, collection, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface ReferralCodeInputProps {
  username: string;
  onValidationChange?: (isValid: boolean) => void;
}

const ReferralCodeInput = ({
  username,
  onValidationChange,
}: ReferralCodeInputProps) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [fieldActive, setFieldActive] = useState<boolean>(false);

  const { user } = useAuth();

  // Dynamic border styles based on field focus
  const fieldBorder = `transition-all duration-500 border ${
    fieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  // Verify referral code in real-time
  useEffect(() => {
    const verifyReferralCode = async () => {
      if (!referralCode || referralCode.trim() === "") {
        setIsCodeValid(null);
        if (onValidationChange) onValidationChange(false);
        return;
      }

      setIsChecking(true);
      try {
        const normalizedCode = referralCode.trim();
        const referralDocRef = doc(db, "referrals", normalizedCode);
        const docSnap = await getDoc(referralDocRef);

        const valid = docSnap.exists();
        setIsCodeValid(valid);
        if (onValidationChange) onValidationChange(valid);
      } catch (error) {
        console.error("Error verifying referral code:", error);
        setIsCodeValid(false);
        if (onValidationChange) onValidationChange(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Add debounce to prevent too many Firestore reads
    const timer = setTimeout(() => {
      if (referralCode) {
        verifyReferralCode();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [referralCode, onValidationChange]);

  // Process referral during form submission
  const processReferral = async () => {
    if (!username) {
      console.error("Username is required to process referral");
      return;
    }

    try {
      const batch = writeBatch(db);

      // 1. Always create a document for the current user in referrals collection
      const userReferralDocRef = doc(db, "referrals", username);
      batch.set(userReferralDocRef, {
        userId: user?.uid,
        packages: [],
        createdAt: new Date(),
        referrals: 0, // Counter for future referrals
      });

      // 2. If referral code is valid, create a subcollection entry
      if (isCodeValid && referralCode) {
        const referrerDocRef = doc(db, "referrals", referralCode.trim());
        const referredUserDocRef = doc(
          collection(referrerDocRef, "referred"),
          username
        );

        batch.set(referredUserDocRef, {
          username: username,
          referredAt: new Date(),
          processed: false, // Flag for future reward processing
        });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Error processing referral:", error);
      return false;
    }
  };

  return {
    component: (
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
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
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
    ),
    processReferral,
    isCodeValid,
  };
};

export default ReferralCodeInput;
