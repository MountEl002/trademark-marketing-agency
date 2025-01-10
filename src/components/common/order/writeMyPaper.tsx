"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";

const WriteMyPaper = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <button
        onClick={createNewOrder}
        disabled={isLoading}
        className="horizontal button-gradient"
      >
        Write my paper
      </button>
    </div>
  );
};

export default WriteMyPaper;
