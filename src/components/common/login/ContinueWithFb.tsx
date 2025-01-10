import React from "react";
import Image from "next/image";
import FacebookLogo from "@/assests/facebookLogo.png";
import { Tooltip } from "react-tooltip";

const ContinueWithFacebook = () => {
  return (
    <>
      <div
        data-tooltip-id="div-tooltip"
        data-tooltip-content="Use your Facebook account to Sign Up!"
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
