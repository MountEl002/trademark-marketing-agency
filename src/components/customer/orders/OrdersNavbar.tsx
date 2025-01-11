"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const OrdersNavbar = () => {
  const linksToOrdersPage = [
    { href: "/customer/orders/open", label: "Active" },
    { href: "/customer/orders/drafts", label: "Drafts" },
    { href: "/customer/orders/closed", label: "Closed" },
    { href: "/customer/orders/new", label: "Create new" },
  ];

  const pathname = usePathname();

  return (
    <div>
      <div>
        <h3>My orders</h3>
      </div>
      <div className="border-b border-gray-400">
        {linksToOrdersPage.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative inline-block px-3 py-4 text-lg transition-all duration-500 ${
              pathname === item.href
                ? "text-blue-600 hover:text-blue-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`absolute w-full border-b -bottom-[0.45] left-0 border-blue-600 ${
                pathname === item.href ? "block" : "hidden"
              }`}
            ></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersNavbar;
