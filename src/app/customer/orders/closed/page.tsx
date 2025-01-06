import OrdersNavbar from "@/components/customer/orders/odersNavbar";
import ZeroOrders from "@/components/customer/orders/zeroOrders";
import React from "react";

const ClosedOrders = () => {
  return (
    <div className="logged-in-customer-pages">
      <div className="max-w-6xl mx-auto px-3">
        <OrdersNavbar />
        <ZeroOrders />
      </div>
    </div>
  );
};

export default ClosedOrders;
