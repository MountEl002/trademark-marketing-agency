import React from "react";
import SignUp from "./signUp";
import Login from "./login";
import { useAuth } from "@/contexts/AuthContext";
import NewOrderButton from "@/components/customer/NewOrderButton";
import UserAccount from "./userAccount";

const UserAccessControl = () => {
  const { user } = useAuth();

  return (
    <div className="w-fit horizontal gap-3 h-full">
      {user ? (
        <>
          <UserAccount />
          <NewOrderButton />
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
