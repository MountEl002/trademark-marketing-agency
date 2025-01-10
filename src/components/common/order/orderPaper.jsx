"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";

const OrderPaper = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <button
        onClick={createNewOrder}
        disabled={isLoading}
        className="horizontal button-gradient"
      >
        Order a paper
      </button>
    </div>
  );
};

export default OrderPaper;
