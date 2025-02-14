"use client";

import React, { FC } from "react";
import Image from "next/image";
import FacebookLogo from "@/assests/facebookLogo.png";
import { Tooltip } from "react-tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

interface ContinueWithFacebookProps {
  className?: string;
  text?: string;
}

const ContinueWithFacebook: FC<ContinueWithFacebookProps> = ({
  className,
  text,
}) => {
  const { signInWithFacebook } = useAuth();
  const pathName = usePathname();

  const handleFacebookSignIn = async () => {
    try {
      if (signInWithFacebook) {
        await signInWithFacebook();
      }
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
    }
  };
  return (
    <>
      <div
        onClick={handleFacebookSignIn}
        data-tooltip-id="div-tooltip"
        data-tooltip-content={`Use your Facebook account to ${
          pathName === "/login" ? "Login" : "Sign Up!"
        }`}
        className={className}
      >
        <Image
          src={FacebookLogo}
          alt="Facebook Logo"
          className="object-cover h-5 w-5"
        />
        {text && <span className="ml-2 font-medium">{text}</span>}
      </div>
      <Tooltip id="div-tooltip" />
    </>
  );
};

export default ContinueWithFacebook;
