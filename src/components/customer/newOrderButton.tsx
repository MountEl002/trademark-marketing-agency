import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "../common/LoadingScreen";
import { LuPlus } from "react-icons/lu";

const NewOrderButton = () => {
  const { createNewOrder, isLoading, isAuthenticated, isAuthLoading } =
    useOrderCreation();

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null; // Or some other fallback
  }

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <button onClick={createNewOrder} disabled={isLoading}>
        <div className="relative group horizontal-space-between button-blue py-10">
          <span className="mr-5">New order</span>
          <span className="absolute right-1 lg:right-2 bg-blue-400 group-hover:bg-blue-600 rounded-[50%] transition-all duration-300">
            <LuPlus className="text-2xl lg:text-3xl" />
          </span>
        </div>
      </button>
    </div>
  );
};

export default NewOrderButton;
