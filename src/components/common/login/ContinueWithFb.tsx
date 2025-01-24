import React from "react";
import Image from "next/image";
import FacebookLogo from "@/assests/facebookLogo.png";
import { Tooltip } from "react-tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const ContinueWithFacebook = () => {
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
        className="continue-with-gaft"
      >
        <Image
          src={FacebookLogo}
          alt="Apple Logo"
          className="object-cover h-5 w-5"
        />
      </div>
      <Tooltip id="div-tooltip" />
    </>
  );
};

export default ContinueWithFacebook;
