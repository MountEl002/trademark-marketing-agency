"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export const useOrderCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, userNumber } = useAuth();

  const getNextOrderNumber = async (): Promise<number> => {
    if (!user || !userNumber) {
      router.push("/login");
      throw new Error("User not authenticated");
    }

    const result = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(doc(db, "counters", "orderNumber"));

      if (!counterDoc.exists()) {
        transaction.set(doc(db, "counters", "orderNumber"), {
          currentNumber: 3418596,
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
    if (!user || !userNumber) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const orderNumber = await getNextOrderNumber();

      const initialOrderData = {
        orderNumber,
        userId: user.uid,
        userNumber: userNumber,
        status: "draft",
        assignmentType: "",
        service: "",
        academicLevel: "",
        language: "",
        size: "",
        words: 0,
        deadline: "",
        addOns: "",
        topic: "",
        subject: "",
        instructions: "",
        price: 0,
        sources: "",
        style: "",
        userBalance: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "orders", orderNumber.toString());
        transaction.set(orderRef, initialOrderData);
      });

      router.push(`/customer/orders/drafts/${orderNumber}`);
      return orderNumber;
    } catch (error) {
      console.error("Error creating new order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    createNewOrder, 
    isLoading 
  };
};