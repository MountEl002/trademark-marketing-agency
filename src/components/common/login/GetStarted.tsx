"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { FaArrowRight } from "react-icons/fa";

const GetStarted = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <>      {isLoading && <LoadingScreen />}

    <button onClick={createNewOrder}
        disabled={isLoading}
       className="w-fit horizontal button-gradient">
        Get Started{" "}
        <span className="ml-3">
          <FaArrowRight color="white" className="inline" />
        </span>
    </button>
    </>
  );
};

export default GetStarted;
