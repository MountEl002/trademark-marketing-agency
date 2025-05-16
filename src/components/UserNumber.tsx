"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const Username = () => {
  const { username } = useAuth();

  return <span>{username}</span>;
};

export default Username;
