"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LightLogo from "@/components/common/LightLogo";
import ContinueWith from "@/components/common/login/ContinueWith";
import {
  IoMdEye,
  IoMdEyeOff,
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import Chat from "@/components/common/Chat";
import SearchableSelect from "@/components/customer/SearchableSelect";
import { countries } from "@/contexts/globalData";
import { verifyUsername } from "@/contexts/userService";
import ReferralCodeInput from "@/components/customer/ReferralCodeInput";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  focusState: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  isPassword?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
  isUsername?: boolean;
  usernameExists?: boolean;
  usernameChecking?: boolean;
}

// Reusable form field component
const FormField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  focusState,
  handleFocus,
  handleBlur,
  isPassword = false,
  showPassword,
  toggleShowPassword,
  isUsername = false,
  usernameExists,
  usernameChecking,
}: FormFieldProps) => {
  const fieldBorder = `transition-all duration-500 border ${
    focusState ? "border-blue-500 bg-gray-50" : "border-transparent bg-gray-100"
  }`;

  return (
    <div className="mb-4">
      <label className="label-email-password">{label}</label>
      <div className={`relative container-input-email-password ${fieldBorder}`}>
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-email-password ${isUsername ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={toggleShowPassword}
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
        )}
        {isUsername && value.length >= 3 && (
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
      </div>
      {isUsername && usernameExists && value.length >= 3 && (
        <p className="text-xs text-red-500 mt-1">
          This username is already taken
        </p>
      )}
    </div>
  );
};

interface FormData {
  email: string;
  mobile: string;
  username: string;
  country: string;
  password: string;
  repeatPassword: string;
}

const SignUp = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    mobile: "",
    username: "",
    country: "",
    password: "",
    repeatPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameExists, setUsernameExists] = useState<boolean>(false);
  const [usernameChecking, setUsernameChecking] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  // Single state object to track focus state of all fields
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { component: referralComponent, processReferral } = ReferralCodeInput({
    username: formData.username,
  });

  useEffect(() => {
    setPasswordsMatch(formData.password === formData.repeatPassword);
  }, [formData.password, formData.repeatPassword]);

  // Check if username exists in database
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length >= 3) {
        setUsernameChecking(true);
        try {
          const exists = await verifyUsername(formData.username);
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
  }, [formData.username]);

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    let value = e.target.value;

    // Special handling for username to prevent spaces
    if (field === "username") {
      value = value.trim().toLowerCase();
    }

    setFormData({ ...formData, [field]: value });
  };

  // Handler for country selection
  const handleCountryChange = (selectedCountry: string) => {
    setFormData({ ...formData, country: selectedCountry });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form
    if (usernameExists) {
      setError("Username is already taken. Please choose another one.");
      setLoading(false);
      return;
    }

    try {
      await signup(
        formData.email,
        formData.password,
        formData.mobile,
        formData.username,
        formData.country
      );
      await processReferral();
      setShowSuccessPopup(true);

      setTimeout(() => {
        if (showSuccessPopup) {
          router.push("/customer/dashboards");
        }
      }, 15000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Failed to create an account! Please try again");
      }
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleContinueToDashboard = () => {
    setShowSuccessPopup(false);
    router.push("/customer/dashboards");
  };

  const formIsValid =
    formData.email &&
    formData.mobile &&
    formData.username.length >= 3 &&
    formData.country &&
    passwordsMatch &&
    !usernameExists;

  return (
    <section className="center-content-on-screen">
      <Chat />
      <div className="centered-content-on-screen">
        <LightLogo />
        <div className="w-full px-4">
          <h3 className="text-center">Let’s get started</h3>
          <p className="text-center mb-6">
            Create your Trademark Marketing account
          </p>
          <ContinueWith />
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
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              placeholder="Enter your email"
              focusState={focusedField === "email"}
              handleFocus={() => handleFocus("email")}
              handleBlur={handleBlur}
            />

            <FormField
              label="Mobile"
              type="text"
              value={formData.mobile}
              onChange={(e) => handleChange(e, "mobile")}
              placeholder="Enter your mobile number"
              focusState={focusedField === "mobile"}
              handleFocus={() => handleFocus("mobile")}
              handleBlur={handleBlur}
            />

            <FormField
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange(e, "username")}
              placeholder="Enter your preferred username"
              focusState={focusedField === "username"}
              handleFocus={() => handleFocus("username")}
              handleBlur={handleBlur}
              isUsername={true}
              usernameExists={usernameExists}
              usernameChecking={usernameChecking}
            />

            {/* Replace the Country FormField with SearchableSelect */}
            <div className="mb-4">
              <label className="label-email-password">Country</label>
              <SearchableSelect
                options={countries}
                value={formData.country}
                onChange={handleCountryChange}
                placeholder="Select your country of residence"
                required={true}
              />
            </div>
            {referralComponent}
            <FormField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange(e, "password")}
              placeholder="Enter your password"
              focusState={focusedField === "password"}
              handleFocus={() => handleFocus("password")}
              handleBlur={handleBlur}
              isPassword={true}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
            />

            <FormField
              label="Repeat password"
              type="password"
              value={formData.repeatPassword}
              onChange={(e) => handleChange(e, "repeatPassword")}
              placeholder="Please repeat your password"
              focusState={focusedField === "repeatPassword"}
              handleFocus={() => handleFocus("repeatPassword")}
              handleBlur={handleBlur}
              isPassword={true}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
            />

            <p
              className={
                passwordsMatch
                  ? "hidden"
                  : "block animate-pulse text-xs text-red-500"
              }
            >
              Passwords do not match
            </p>

            <div className="horizontal mt-5">
              <button
                type="submit"
                disabled={loading || !formIsValid}
                className={`button-blue w-full ${
                  loading || !formIsValid ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <span>
                    <div className="animate-spin h-5 w-5 border-4 text-gray-100 rounded-[50%] border-t-transparent mx-auto" />
                  </span>
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
            <Link href="/terms-and-conditions">Terms and Conditions</Link>, and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* Success Popup Dialog */}
      {showSuccessPopup && (
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
              Your Trademark Marketing account has been created successfully.
              Welcome aboard!
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleContinueToDashboard}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignUp;
