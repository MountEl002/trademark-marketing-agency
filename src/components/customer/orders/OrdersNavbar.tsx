"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const OrdersNavbar = () => {
  const linksToOrdersPage = [
    { href: "/customer/orders/open", label: "Active" },
    { href: "/customer/orders/drafts", label: "Drafts" },
    { href: "/customer/orders/closed", label: "Closed" },
    { href: "/customer/orders/new", label: "New" },
  ];

  const pathname = usePathname();

  return (
    <div>
      <div>
        <h3>My orders</h3>
      </div>
      <div className="border-b-2 border-gray-400">
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
              className={`absolute w-full border-b-2 -bottom-0.5 left-0 border-blue-600 ${
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
