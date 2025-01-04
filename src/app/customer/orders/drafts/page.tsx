import OrdersNavbar from "@/components/userComponents/orders/odersNavbar";
import ZeroOrders from "@/components/userComponents/orders/zeroOrders";
import React from "react";

const Drafts = () => {
  return (
    <div className="logged-in-customer-pages">
      <div className="max-w-6xl mx-auto px-3">
        <OrdersNavbar />
        <ZeroOrders />
      </div>
    </div>
  );
};

export default Drafts;
