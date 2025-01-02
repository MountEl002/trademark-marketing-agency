"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const UserNumber = () => {
  const { userNumber } = useAuth();

  return (
    <div>
      <h1>{userNumber}</h1>
    </div>
  );
};

export default UserNumber;
