import React from "react";
import Image from "next/image";
import GoogleLogo from "@/assests/googleLogo.png";

const continueWithGoogle = () => {
  return (
    <div className="horizontal gap-2 py-2 px-4 rounded-full border-2 font-semibold">
      <Image
        src={GoogleLogo}
        alt="Google Logo"
        className="object-cover h-5 w-5"
      />
      <p>Continue with Google</p>
    </div>
  );
};

export default continueWithGoogle;
