import Link from "next/link";
import React from "react";
import { LuPlus } from "react-icons/lu";

const NewOrderButton = () => {
  return (
    <Link href="/customer/orders/new">
      <div className="relative group horizontal-space-between button-blue py-10">
        <span className="mr-5">New order</span>
        <span className="absolute  right-1 lg:right-2 bg-blue-400 group-hover:bg-blue-600 rounded-[50%] transition-all duration-300">
          <LuPlus className="text-2xl lg:text-3xl" />
        </span>
      </div>
    </Link>
  );
};

export default NewOrderButton;
