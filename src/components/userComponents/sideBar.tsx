import React from "react";
import NewOrderButton from "./newOrderButton";
import Logout from "./logout";
import LinkToUserProfile from "./linkToUserProfile";

const SideBar = () => {
  return (
    <>
      <div className="vertical-space-between w-[250px] h-[85vh] overflow-hidden pl-5 pt-5">
        <div className="">
          <NewOrderButton />
          <div className="mt-10">
            <LinkToUserProfile />
          </div>
        </div>
        <Logout />
      </div>
    </>
  );
};

export default SideBar;
