import React from "react";
import SignUp from "./signUp";
import Login from "./login";
import UserAccount from "./userAccount";

const UserAccessControl = () => {
  const userLoginStatus: boolean = false;

  return (
    <div className="w-fit horizontal gap-2">
      {userLoginStatus ? (
        <>
          <UserAccount />
        </>
      ) : (
        <>
          <Login />
          <SignUp />
        </>
      )}
    </div>
  );
};

export default UserAccessControl;
