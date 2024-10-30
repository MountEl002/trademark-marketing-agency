import React from "react";
import Link from "next/link";

const orderPaper = () => {
  return (
    <div className="horizontal px-10 py-2 bg-green-400 text-gray-50 rounded-full font-semibold">
      <Link href="#">Order a Paper</Link>
    </div>
  );
};

export default orderPaper;
