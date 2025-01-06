// components/customer/NewOrderButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { LuPlus } from "react-icons/lu";
import LoadingScreen from "../common/LoadingScreen";

interface NewOrderButtonProps {
  className?: string;
}

// Definition of the initial order structure
interface OrderData {
  orderNumber: number;
  userId: string;
  userNumber: string;
  status: string;
  assignmentType: string;
  service: string;
  academicLevel: string;
  language: string;
  pages: number;
  words: number;
  deadline: string;
  addOns: string;
  subject: string;
  instructions: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
}

export const NewOrderButton = ({ className = "" }: NewOrderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, userNumber } = useAuth();

  const getNextOrderNumber = async (): Promise<number> => {
    const result = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(
        doc(db, "counters", "orderNumber")
      );

      if (!counterDoc.exists()) {
        // Initialize counter if it doesn't exist
        transaction.set(doc(db, "counters", "orderNumber"), {
          currentNumber: 3418596, // One less than the first required number
        });
        return 3418597;
      }

      const newNumber = counterDoc.data().currentNumber + 1;
      transaction.update(doc(db, "counters", "orderNumber"), {
        currentNumber: newNumber,
      });

      return newNumber;
    });

    return result;
  };

  const createNewOrder = async () => {
    if (!user || !userNumber) return;

    setIsLoading(true);
    try {
      const orderNumber = await getNextOrderNumber();

      // Create the initial order data
      const initialOrderData: OrderData = {
        orderNumber,
        userId: user.uid,
        userNumber: userNumber,
        status: "draft",
        assignmentType: "",
        service: "",
        academicLevel: "",
        language: "",
        pages: 0,
        words: 0,
        deadline: "",
        addOns: "",
        subject: "",
        instructions: "",
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create the order document
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "orders", orderNumber.toString());
        transaction.set(orderRef, initialOrderData);
      });

      // Log the created order data
      console.log("New order created with initial data:", initialOrderData);

      // Redirect to the new order page
      router.push(`/customer/orders/drafts/${orderNumber}`);
    } catch (error) {
      console.error("Error creating new order:", error);
      // Here you might want to show an error toast/notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={createNewOrder}
      disabled={isLoading}
      className={`${className}`}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="relative group horizontal-space-between button-blue py-10">
          <span className="mr-5">New order</span>
          <span className="absolute  right-1 lg:right-2 bg-blue-400 group-hover:bg-blue-600 rounded-[50%] transition-all duration-300">
            <LuPlus className="text-2xl lg:text-3xl" />
          </span>
        </div>
      )}
    </button>
  );
};

export default NewOrderButton;
