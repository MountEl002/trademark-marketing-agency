import React from "react";
import Image from "next/image";
import AppleLogo from "@/assests/appleLogo.png";
import { Tooltip } from "react-tooltip";

const ContinueWithApple = () => {
  return (
    <>
      <div
        data-tooltip-id="div-tooltip"
        data-tooltip-content="Use your Apple account to Sign Up!"
        className="continue-with-gaft"
      >
        <Image
          src={AppleLogo}
          alt="Apple Logo"
          className="object-cover h-5 w-5"
        />
      </div>
      <Tooltip id="div-tooltip" />
    </>
  );
};

export default ContinueWithApple;
