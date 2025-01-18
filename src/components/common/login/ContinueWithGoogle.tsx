import React from "react";
import Image from "next/image";
import GoogleLogo from "@/assests/googleLogo.png";
import { Tooltip } from "react-tooltip";
import { useAuth } from "@/contexts/AuthContext";

const ContinueWithGoogle = () => {
  const { signInWithGoogle } = useAuth();

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
        data-tooltip-content="Use your Google account to Sign Up!"
        className="continue-with-gaft"
      >
        <Image
          src={GoogleLogo}
          alt="Apple Logo"
          className="object-cover h-5 w-5"
        />
      </div>
      <Tooltip id="div-tooltip" />
    </>
  );
};

export default ContinueWithGoogle;
