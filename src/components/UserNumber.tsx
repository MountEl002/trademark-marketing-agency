"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const UserNumber = () => {
  const { userNumber } = useAuth();

  return <span>{userNumber}</span>;
};

export default UserNumber;
