"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Logout from "@/components/userComponents/logout";
import UserNumber from "@/components/userComponents/userNumber";

const UserAccount = () => {
  const [myAccountMenuOpen, setMyAccountMenuOpen] = useState(true);
  const pathname = usePathname();

  const closeMyAccountMenu = () => {
    setMyAccountMenuOpen(false);

    setTimeout(() => {
      setMyAccountMenuOpen(true);
    }, 1000);
  };

  const myAccountLinkStyles = `horizontal gap-1 text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname === "/customer/profile"
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const myAccountChevronLinkStyles = `transition-all duration-500 ${
    pathname === "/customer/profile"
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  return (
    <Link href="#" className="relative vertical group transition-all h-full">
      <p className={myAccountLinkStyles}>
        <span>My Account</span>
        <FaChevronDown className={myAccountChevronLinkStyles} />
      </p>
      {/* MyAccount Dropdown Menu */}
      {myAccountMenuOpen && (
        <div className="absolute w-[200px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
          <div>
            <div className="pt-2">
              {/* Go to user profile */}
              <Link
                href="/customer/profile"
                onClick={closeMyAccountMenu}
                className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                  pathname === "/customer/profile"
                    ? "text-blue-700 hover:text-blue-900"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                My Profile{"  -  "}
                <span>
                  #<UserNumber />
                </span>
              </Link>

              {/* Log out */}
              <div
                onClick={closeMyAccountMenu}
                className="block px-4 pb-2 text-sm py-2"
              >
                <Logout />
              </div>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default UserAccount;
