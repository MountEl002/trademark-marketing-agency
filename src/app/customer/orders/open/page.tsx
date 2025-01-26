"use client";

import React from "react";
import OrdersNavbar from "@/components/customer/orders/OrdersNavbar";
import ActiveOrdersList from "@/components/customer/orders/activeOrders/ActiveOrdersList";

const ActiveOrders = () => {
  return (
    <div className="logged-in-customer-pages">
      <div className="max-w-6xl mx-auto px-3">
        <OrdersNavbar />
        <ActiveOrdersList />
      </div>
    </div>
  );
};

export default ActiveOrders;
