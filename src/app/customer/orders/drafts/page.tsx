"use client";

import DraftOrdersList from "@/components/customer/orders/DraftOrdersList";
import OrdersNavbar from "@/components/customer/orders/odersNavbar";

const Drafts = () => {
  return (
    <div className="logged-in-customer-pages">
      <div className="max-w-6xl mx-auto px-3">
        <OrdersNavbar />
        <DraftOrdersList />
      </div>
    </div>
  );
};

export default Drafts;
