import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export const useOrderStatusModifier = () => {
  const [isModifying, setIsModifying] = useState(false);
  const [modificationError, setModificationError] = useState<Error | null>(null);

  const modifyOrderStatus = async (
    orderNumber: string, 
    newStatus: string
  ): Promise<void> => {
    setIsModifying(true);
    setModificationError(null);

    try {
      const orderRef = doc(db, "orders", orderNumber);
      await updateDoc(orderRef, {
        status: newStatus.toLowerCase(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      setModificationError(error instanceof Error ? error : new Error('An unknown error occurred'));
      throw error;
    } finally {
      setIsModifying(false);
    }
  };

  return { 
    modifyOrderStatus, 
    isModifying, 
    modificationError 
  };
};