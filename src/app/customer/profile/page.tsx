import Logout from "@/components/userComponents/logout";
import SignupDate from "@/components/userComponents/signupDate";
import UserNumber from "@/components/userComponents/userNumber";
import React from "react";

const Profile = () => {
  return (
    <div className="Vertical">
      <SignupDate />
      <UserNumber />
      <Logout />
    </div>
  );
};

export default Profile;
