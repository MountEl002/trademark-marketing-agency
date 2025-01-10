import React from "react";
import Image from "next/image";
import GoogleLogo from "@/assests/googleLogo.png";
import { Tooltip } from "react-tooltip";

const ContinueWithGoogle = () => {
  return (
    <>
      <div
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
