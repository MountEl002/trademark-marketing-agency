"use client";

import React from "react";
import { FaRegFolderOpen } from "react-icons/fa";
import NewOrderButton from "../NewOrderButton";
import { usePathname } from "next/navigation";

const ZeroOrders = () => {
  const currentOderSection = [
    { href: "/customer/orders/open", label: "You have no Active Orders" },
    { href: "/customer/orders/drafts", label: "You have no Orders in Drafts" },
    { href: "/customer/orders/closed", label: "You have no Closed Orders" },
  ];

  const pathname = usePathname();

  return (
    <div className="vertical bg-gray-50 rounded-3xl w-full h-[50vh] mt-12">
      <div className="vertical gap-5">
        <div className="p-6 rounded-[50%] bg-gradient-to-t from-gray-400 to-gray-100">
          <FaRegFolderOpen className="text-9xl text-gray-500" />
        </div>
        <div>
          {currentOderSection.map((item) => (
            <p
              key={item.href}
              className={`text-lg font-semibold text-gray-500 ${
                pathname === item.href ? "block" : "hidden"
              }`}
            >
              {item.label}
            </p>
          ))}
        </div>
        <div>
          <NewOrderButton />
        </div>
      </div>
    </div>
  );
};

export default ZeroOrders;
