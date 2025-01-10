import React from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { useAuth } from "@/contexts/AuthContext";
import NewOrderButton from "@/components/customer/NewOrderButton";
import UserAccount from "./UserAccount";

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
