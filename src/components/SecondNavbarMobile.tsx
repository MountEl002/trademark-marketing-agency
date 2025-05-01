"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { IconType } from "react-icons";
import { IoWalletSharp, IoNotifications } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { FaFolderOpen } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarItem {
  id: number;
  name: string;
  linkTo: string;
  currentState?: string;
  itemIcon: IconType;
}

const SecondNavBarMobile = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const accountBalance = "$0.00";
  const totalOrders = "0";
  const unReadNotifications = "0";
  const unReadChats = "0";

  const [chatsOpen, setChatsOpen] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);

  const toggleChats = () => {
    if (helpCenterOpen) {
      setHelpCenterOpen(false);
    }
    setChatsOpen(!chatsOpen);
  };

  const toggleHelpCenter = () => {
    if (chatsOpen) {
      setChatsOpen(false);
    }
    setHelpCenterOpen(!helpCenterOpen);
  };

  const navbarItems: NavbarItem[] = [
    {
      id: 1,
      name: "Balance",
      linkTo: "/customer/finance/transactions",
      itemIcon: IoWalletSharp,
      currentState: accountBalance,
    },
    {
      id: 2,
      name: "My Orders",
      linkTo: "/customer/orders/open",
      itemIcon: FaFolderOpen,
      currentState: totalOrders,
    },
    {
      id: 3,
      name: "Notifications",
      linkTo: "/customer/notifications",
      itemIcon: IoNotifications,
      currentState: unReadNotifications,
    },
  ];

  return (
    <>
      {user && (
        <div className="hidden max-[614px]:block w-full h-fit bg-gray-100 p-2">
          <div className="vertical-start gap-2">
            {navbarItems.map((item) => (
              <div
                key={item.id}
                className={`horizontal-start w-full group rounded-md  p-2 transition-all duration-500 ${
                  pathname === item.linkTo ||
                  (item.id === 2 && pathname.startsWith("/customer/orders"))
                    ? "bg-white"
                    : "hover:bg-white"
                }`}
              >
                <Link href={item.linkTo}>
                  <span
                    className={`horizontal gap-1 transition-all duration-500 ${
                      pathname === item.linkTo ||
                      (item.id === 2 && pathname.startsWith("/customer/orders"))
                        ? "font-semibold text-blue-700 group-hover:text-blue-900"
                        : "text-gray-600 group-hover:text-blue-500"
                    }`}
                  >
                    <item.itemIcon className="text-base md:text-lg" />
                    <span className="text-sm md:text-base">
                      {item.name} [{item.currentState}]
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <div className="vertical-start gap-2">
            <button
              className={`horizontal-start w-full group rounded-md  p-2 transition-all duration-500 ${
                chatsOpen === true ? "bg-white" : "hover:bg-white"
              }`}
              onClick={toggleChats}
            >
              <div
                className={`horizontal gap-1 transition-all duration-500 ${
                  chatsOpen === true
                    ? "font-semibold text-blue-700 group-hover:text-blue-900"
                    : "text-gray-600 group-hover:text-blue-500"
                }`}
              >
                <MdMessage className="text-base md:text-lg" />
                <span className="text-sm md:text-base">Chats</span>
                <span className="text-sm md:text-base">[{unReadChats}]</span>
              </div>
            </button>
            <button
              className={`horizontal-start w-full group rounded-md  p-2 transition-all duration-500 ${
                helpCenterOpen === true ? "bg-white" : "hover:bg-white"
              }`}
              onClick={toggleHelpCenter}
            >
              <div
                className={`horizontal gap-1 transition-all duration-500 ${
                  helpCenterOpen === true
                    ? "font-semibold text-blue-700 group-hover:text-blue-900"
                    : "text-gray-600 group-hover:text-blue-500"
                }`}
              >
                <TfiHeadphoneAlt className="text-base md:text-lg" />
                <span className="text-sm md:text-base">Help Center</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SecondNavBarMobile;
