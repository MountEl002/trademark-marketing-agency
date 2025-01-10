import React from "react";
import OrderAnEssay from "./OrderAnEssay";

const TryNow = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-between w-full gap-12 mt-8">
        <div className="text-2xl font-semibold">
          Try our essay writing service right now!
        </div>
        <div>
          <OrderAnEssay />
        </div>
      </div>
    </div>
  );
};

export default TryNow;
