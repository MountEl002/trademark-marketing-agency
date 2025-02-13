"use client";

import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "../common/LoadingScreen";
import { LuPlus } from "react-icons/lu";
import UniversalButton from "../common/UniversalButton";

const NewOrderButton = () => {
  const { createNewOrder, isLoading } = useOrderCreation();

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <UniversalButton
        icon={LuPlus}
        onClick={createNewOrder}
        disabled={isLoading}
        text="New order"
        buttonClassName="bg-blue-500 hover:bg-blue-700"
        iconClassName="bg-blue-400 group-hover:bg-blue-600"
      />
    </div>
  );
};

export default NewOrderButton;
