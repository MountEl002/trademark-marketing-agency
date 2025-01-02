import React from "react";
import Link from "next/link";

const UserAccount = () => {
  return (
    <div className="horizontal button-blue">
      <Link href="/customer/profile">My Acccount</Link>
    </div>
  );
};

export default UserAccount;
