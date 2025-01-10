"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";

const OrderNow = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <button
        onClick={createNewOrder}
        disabled={isLoading}
        className="horizontal button-gradient"
      >
        Order now
      </button>
    </div>
  );
};

export default OrderNow;
