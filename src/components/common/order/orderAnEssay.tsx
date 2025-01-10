"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";

const OrderAnEssay = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <button
        onClick={createNewOrder}
        disabled={isLoading}
        className="horizontal button-gradient"
      >
        Order an essay
      </button>
    </div>
  );
};

export default OrderAnEssay;
