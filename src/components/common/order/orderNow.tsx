import React from "react";
import Link from "next/link";

const orderNow = () => {
  return (
    <div className="horizontal px-10 py-2 bg-green-400 text-gray-50 rounded-full font-semibold">
      <Link href="#">Order Now</Link>
    </div>
  );
};

export default orderNow;
