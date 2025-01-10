"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOrderCreation } from "@/hooks/useOrderCreation";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function NewPage() {
  const { createNewOrder } = useOrderCreation();
  const router = useRouter();
  const orderCreationAttempted = useRef(false);

  useEffect(() => {
    const createOrder = async () => {
      if (!orderCreationAttempted.current) {
        orderCreationAttempted.current = true;
        try {
          const orderNumber = await createNewOrder();
          if (orderNumber) {
            router.push(`/customer/orders/drafts/${orderNumber}`);
          }
        } catch (error) {
          console.error("Error in order creation:", error);
          // Handle error - maybe redirect to an error page or show an error message
        }
      }
    };

    createOrder();
  }, [createNewOrder, router]); // Empty dependency array since we only want this to run once

  return <LoadingScreen />;
}
