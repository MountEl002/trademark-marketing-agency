"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";

const PlaceAnOrder = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <button
        onClick={createNewOrder}
        disabled={isLoading}
        className="horizontal button-gradient"
      >
        Place an order
      </button>
    </div>
  );
};

export default PlaceAnOrder;
