import React from "react";
import LightLogo from "../common/lightLogo";
import UserAccessControl from "../common/login/userAccessControl";

const SecondNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-md">
      <div className="relative max-w-5xl mx-auto">
        <div className="horizontal-space-between h-16">
          {/* Left section */}
          <LightLogo />
          {/* Middle Section */}
          <div></div>
          {/* Right Section */}
          <UserAccessControl />
        </div>
      </div>
    </nav>
  );
};

export default SecondNavbar;
