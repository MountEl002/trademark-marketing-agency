"use client";

import React, { FC } from "react";
import Image from "next/image";
import GoogleLogo from "@/assests/googleLogo.png";
import { Tooltip } from "react-tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

interface ContinueWithGoogleProps {
  className?: string;
  text?: string;
}

const ContinueWithGoogle: FC<ContinueWithGoogleProps> = ({
  className,
  text,
}) => {
  const { signInWithGoogle } = useAuth();
  const pathName = usePathname();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      // You might want to show an error message to the user here
    }
  };
  return (
    <>
      <div
        onClick={handleGoogleSignIn}
        data-tooltip-id="div-tooltip"
        data-tooltip-content={`Use your Google account to ${
          pathName === "/login" ? "Login" : "Sign Up!"
        }`}
        className={className}
      >
        <Image
          src={GoogleLogo}
          alt="Google Logo"
          className="object-cover h-5 w-5"
        />
        {text && <span className="ml-2 font-medium">{text}</span>}
      </div>
      <Tooltip id="div-tooltip" />
    </>
  );
};

export default ContinueWithGoogle;
