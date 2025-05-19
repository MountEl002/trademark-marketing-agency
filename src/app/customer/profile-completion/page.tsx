"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { countries } from "@/contexts/globalData";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tooltip } from "react-tooltip";
import LightLogo from "@/components/common/LightLogo";
import { FirebaseError } from "firebase/app";
import Chat from "@/components/common/Chat";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import SearchableSelect from "@/components/customer/SearchableSelect";

const UpdateProfile = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState(""); // Fixed: country is a string, not an object
  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
  const verifyUsername = async (username: string) => {
    if (!username || username.length < 3) return;

    setUsernameChecking(true);
    try {
      // The usernames collection might not exist yet
      const usernameQuery = query(
        collection(db, "userNames"),
        where("username", "==", username)
      );

      const querySnapshot = await getDocs(usernameQuery);

      // If any documents are found with this username
      setUsernameExists(querySnapshot.size > 0);
    } catch (error) {
      // If the collection doesn't exist or there's another error,
      // we can assume the username is available
      console.error("Error checking username:", error);
      setUsernameExists(false);
    } finally {
      setUsernameChecking(false);
    }
  };

  // Debounce the username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username.length >= 3) {
        verifyUsername(username);
      }
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to update your profile");
      return;
    }

    if (!formValid) return;

    setLoading(true);
    setError("");

    try {
      // Save username to usernames collection
      try {
        // First update the user document
        await updateDoc(doc(db, "users", user.uid), {
          username: username,
          mobile: mobile,
          country: country,
          updatedAt: new Date(),
        });

        // Then try to add to usernames collection
        try {
          // Check if the usernames collection exists and if the document exists
          const usernameRef = doc(db, "userNames", username);
          const usernameDoc = await getDoc(usernameRef);

          if (usernameDoc.exists()) {
            // If it exists, update it
            await updateDoc(usernameRef, {
              username: username,
              userId: user.uid,
              updatedAt: new Date(),
            });
          } else {
            // If it doesn't exist, set it
            await setDoc(usernameRef, {
              username: username,
              userId: user.uid,
              createdAt: new Date(),
            });
          }
        } catch (innerError) {
          // If there's an error with the usernames collection, log it but don't fail the whole operation
          console.error("Error updating username record:", innerError);
          // The user's profile has still been updated successfully
        }

        setSuccess(true);
        setShowSuccessPopup(true);
        // Wait 2 seconds before redirecting
        setTimeout(() => {
          router.push("/customer/dashboards");
        }, 2000);
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
    } finally {
      router.push("/customer/dashboards");
    }
  };

  return (
    <section className="center-content-on-screen">
      <Chat />
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

          {success && !showSuccessPopup && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg relative mb-4">
              Profile updated successfully! Redirecting...
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

            <div className="horizontal">
              <button
                type="submit"
                disabled={!formValid || loading}
                className={`button-blue w-full ${
                  !formValid || loading
                    ? "opacity-50 !cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-4 text-gray-100 rounded-[50%] border-t-transparent mx-auto" />
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
