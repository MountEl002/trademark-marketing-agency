import React from "react";
import SignUp from "./signUp";
import Login from "./login";
import UserAccount from "./userAccount";
import { useAuth } from "@/contexts/AuthContext";

const UserAccessControl = () => {
  const { user } = useAuth();

  return (
    <div className="w-fit horizontal gap-2">
      {user ? (
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
