import React from "react";
import { FaUser } from "react-icons/fa";
import UserNumber from "./UserNumber";

const LinkToUserProfile = () => {
  return (
    <div className="horizontal-start w-full gap-4 text-gray-600 hover:text-blue-500 hover:bg-blue-200 px-2 py-2 hover:rounded-full transition-all duration-300">
      <div className="rounded-[50%] p-1 bg-gray-200">
        <FaUser size={15} />
      </div>
      <div className="">
        <UserNumber />
      </div>
    </div>
  );
};

export default LinkToUserProfile;
