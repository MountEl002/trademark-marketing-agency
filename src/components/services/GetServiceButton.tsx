"use client";

import React, { FC } from "react";
import UniversalLink from "../common/UniversalLink";
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

interface GetServiceButtonProps {
  text: string;
}

const GetServiceButton: FC<GetServiceButtonProps> = ({ text }) => {
  const { user } = useAuth();

  const correctPath = user ? "/customer/orders/drafts/new" : "/signup";
  return (
    <UniversalLink
      icon={FaArrowRight}
      href={correctPath}
      linkClassName="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-800"
      iconClassName="bg-orange-400 group-hover:bg-yellow-400"
      text={text}
    />
  );
};

export default GetServiceButton;
