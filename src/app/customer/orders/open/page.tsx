"use client";

import React from "react";
import OrdersNavbar from "@/components/customer/orders/odersNavbar";
import ZeroOrders from "@/components/customer/orders/zeroOrders";

const ActiveOrders = () => {
  return (
    <div className="logged-in-customer-pages">
      <div className="max-w-6xl mx-auto px-3">
        <OrdersNavbar />
        <ZeroOrders />
      </div>
    </div>
  );
};

export default ActiveOrders;
