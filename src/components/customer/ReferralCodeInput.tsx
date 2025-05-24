"use client";

import { useState, useEffect } from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
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

  // Verify referral code by checking userNames collection
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
        // Check if username exists in userNames collection
        const usernameDocRef = doc(db, "userNames", normalizedCode);
        const docSnap = await getDoc(usernameDocRef);

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
      return false;
    }

    try {
      // Always create a document for the current user in referrals collection
      const userReferralDocRef = doc(db, "referrals", username);
      await setDoc(userReferralDocRef, {
        userId: user?.uid,
        packages: [],
        createdAt: new Date(),
        referrals: 0, // Counter for future referrals this user will make
      });

      // If referral code is valid, process the referral
      if (isCodeValid && referralCode) {
        const normalizedCode = referralCode.trim();
        const referrerDocRef = doc(db, "referrals", normalizedCode);

        try {
          // Check if referrer document exists
          const referrerDoc = await getDoc(referrerDocRef);

          if (referrerDoc.exists()) {
            // Document exists, increment referrals count
            await updateDoc(referrerDocRef, {
              referrals: increment(1),
              updatedAt: new Date(),
            });
          } else {
            // Document doesn't exist, create it with referrals: 1
            await setDoc(referrerDocRef, {
              userId: "", // We don't have the referrer's userId from userNames collection
              packages: [],
              createdAt: new Date(),
              referrals: 1, // First referral for this user
            });
          }

          // Create a subcollection entry to track this specific referral
          const referredUserDocRef = doc(
            db,
            "referrals",
            normalizedCode,
            "referred",
            username
          );

          await setDoc(referredUserDocRef, {
            username: username,
            referredAt: new Date(),
            processed: true,
          });

          console.log(`Referral processed successfully for ${normalizedCode}`);
        } catch (referralError) {
          console.error("Error processing referral:", referralError);
          // Don't fail the entire process if referral processing fails
        }
      }

      return true;
    } catch (error) {
      console.error("Error in processReferral:", error);
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
