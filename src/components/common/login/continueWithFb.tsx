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
        className="horizontal gap-2 py-2 px-4 rounded-full border-2 font-semibold hover:bg-blue-100 hover:border-blue-400 transition-colors cursor-pointer"
      >
        <Image
          src={FacebookLogo}
          alt="Apple Logo"
          className="object-cover h-5 w-5"
        />
        <p>Facebook</p>
      </div>
      <Tooltip id="div-tooltip" />
    </>
  );
};

export default ContinueWithFacebook;
