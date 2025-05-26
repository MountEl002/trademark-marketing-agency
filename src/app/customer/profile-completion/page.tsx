"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { countries } from "@/contexts/globalData";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tooltip } from "react-tooltip";
import LightLogo from "@/components/common/LightLogo";
import { FirebaseError } from "firebase/app";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import SearchableSelect from "@/components/customer/SearchableSelect";
import ReferralCodeInput from "@/components/customer/ReferralCodeInput";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import Link from "next/link";
import { processReferral, verifyUsername } from "@/contexts/userService";

const UpdateProfile = () => {
  const router = useRouter();
  const { user: authUser, username: savedUsername } = useAuth();
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [showReferralConfirmation, setShowReferralConfirmation] =
    useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  // Field focus states
  const [usernameFieldActive, setUsernameFieldActive] = useState(false);
  const [mobileFieldActive, setMobileFieldActive] = useState(false);
  const [countryFieldActive, setCountryFieldActive] = useState(false);

  // Dynamic border styles based on field focus
  const usernameBorder = `transition-all duration-500 border ${
    usernameFieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  const mobileBorder = `transition-all duration-500 border ${
    mobileFieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  const countryBorder = `transition-all duration-500 border ${
    countryFieldActive
      ? "border-blue-500 bg-gray-50"
      : "border-transparent bg-gray-100"
  }`;

  // Check if username exists in database
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length >= 3) {
        setUsernameChecking(true);
        try {
          const exists = await verifyUsername(username);
          setUsernameExists(exists);
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameExists(false);
        } finally {
          setUsernameChecking(false);
        }
      }
    };

    const timer = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Check if the form is valid
  useEffect(() => {
    setFormValid(
      username.length >= 3 &&
        mobile.length >= 10 &&
        !!country &&
        !usernameExists &&
        !usernameChecking
    );
  }, [username, mobile, country, usernameExists, usernameChecking]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formValid) return;

    if (isCodeValid && referralCode) {
      setShowReferralConfirmation(true);
    } else {
      // No referral code or invalid, proceed directly
      handleActualSubmit();
    }
  };

  const handleActualSubmit = async () => {
    if (!authUser) {
      setError("You must be logged in to update your profile");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First update the user document
      await updateDoc(doc(db, "users", authUser.uid), {
        username: username.trim(),
        mobile: mobile.trim(),
        country: country,
        updatedAt: new Date(),
      });

      // Then handle username in userNames collection
      try {
        const usernameRef = doc(db, "userNames", username);
        const usernameDoc = await getDoc(usernameRef);

        if (usernameDoc.exists()) {
          // If it exists, update it
          await updateDoc(usernameRef, {
            username: username.trim(),
            userId: authUser.uid,
            updatedAt: new Date(),
          });
        } else {
          // If it doesn't exist, set it
          await setDoc(usernameRef, {
            username: username.trim(),
            userId: authUser.uid,
            createdAt: new Date(),
          });
        }
      } catch (innerError) {
        console.error("Error updating username record:", innerError);
      }

      // Process referral after successful profile update
      try {
        await processReferral(
          authUser?.uid,
          username.trim(),
          referralCode,
          isCodeValid
        );
      } catch (referralError) {
        console.error("Error processing referral:", referralError);
        // Don't fail the entire process if referral processing fails
      }

      setSuccess(true);
      setShowSuccessPopup(true);

      // Wait 2 seconds before redirecting
      setTimeout(() => {
        router.push("/customer/dashboards");
      }, 5000);
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "not-found":
            setError("User not found");
            break;
          default:
            setError(error.message);
        }
      } else {
        setError("Failed to update profile. Please try again.");
      }

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReferralConfirmation = () => {
    setShowReferralConfirmation(false);
    handleActualSubmit();
  };

  return (
    <section className="center-content-on-screen">
      <div className="centered-content-on-screen">
        <LightLogo />
        <div className="w-full px-4">
          <h3 className="text-center">Complete Your Profile</h3>
          <p className="text-center mb-6">
            Add a few more details to your Trademark Marketing account
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg relative mb-4">
              {error}
            </div>
          )}

          {(success && !showSuccessPopup) || savedUsername ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <IoMdCheckmarkCircle size={40} className="text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Thank You for Joining!
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Your Trademark Marketing account has been updated
                  successfully. Welcome aboard!
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/customer/dashboards"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Continue to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Referral Confirmation Popup */}
          {showReferralConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <IoMdCheckmarkCircle size={40} className="text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Referral Code Valid!
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  You have a valid referral code. Click continue to complete
                  your registration with this referral.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowReferralConfirmation(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReferralConfirmation}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                    disabled={loading || !!savedUsername}
                  >
                    {loading ? <LoadingAnimantion /> : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="label-email-password">
                Username
              </label>
              <div
                className={`relative container-input-email-password ${usernameBorder}`}
              >
                <input
                  id="username"
                  type="text"
                  value={username}
                  onFocus={() => setUsernameFieldActive(true)}
                  onBlur={() => setUsernameFieldActive(false)}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setUsername(value);
                  }}
                  placeholder="Choose a username"
                  className="input-email-password pr-10"
                  autoComplete="off"
                />
                {username.length >= 3 && (
                  <div className="absolute right-3 top-2.5">
                    {usernameChecking ? (
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
                    ) : usernameExists ? (
                      <IoMdCloseCircle
                        size={20}
                        className="text-red-500"
                        data-tooltip-id="username-taken"
                      />
                    ) : (
                      <IoMdCheckmarkCircle
                        size={20}
                        className="text-green-500"
                        data-tooltip-id="username-available"
                      />
                    )}
                  </div>
                )}
                <Tooltip id="username-taken" content="Username already taken" />
                <Tooltip id="username-available" content="Username available" />
              </div>
              {usernameExists && username.length >= 3 && (
                <p className="text-red-500 text-sm mt-1">
                  This username is already taken
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="mobile" className="label-email-password">
                Mobile Number
              </label>
              <div
                className={`relative container-input-email-password ${mobileBorder}`}
              >
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onFocus={() => setMobileFieldActive(true)}
                  onBlur={() => setMobileFieldActive(false)}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setMobile(value);
                  }}
                  placeholder="Enter your mobile number"
                  className="input-email-password"
                />
              </div>
            </div>

            <div
              className="mb-6"
              onFocus={() => setCountryFieldActive(true)}
              onBlur={() => setCountryFieldActive(false)}
            >
              <label htmlFor="country" className="label-email-password">
                Country
              </label>
              <div className={`${countryBorder} rounded-lg`}>
                <SearchableSelect
                  options={countries}
                  value={country}
                  onChange={(value) => setCountry(value)}
                  placeholder="Select a country"
                  required
                />
              </div>
            </div>
            {/* Use the ReferralCodeInput component */}
            <ReferralCodeInput
              onIsCodeValid={setIsCodeValid}
              onReferralCode={setReferralCode}
            />
            <div className="horizontal">
              <button
                type="submit"
                disabled={!formValid || loading || !!savedUsername}
                className={`button-blue w-full ${
                  !formValid || loading
                    ? "opacity-50 !cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {loading ? <LoadingAnimantion /> : <span>Update Profile</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
