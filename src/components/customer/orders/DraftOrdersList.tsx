// components/customer/DraftOrdersList.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import ZeroOrders from "@/components/customer/orders/ZeroOrders";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import ConfirmationDialog from "./draftOrder/ConfirmationDialog";

interface DraftOrder {
  id: string; // Added id to the interface
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  userId: string; // Also adding userId for completeness
  status: string; // Adding status field
}

export default function DraftOrdersList() {
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftOrder | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Delete handler
  const handleDiscardDraft = async (draft: DraftOrder, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setSelectedDraft(draft);
    setShowConfirmation(true);
  };

  const confirmDiscard = async () => {
    if (!selectedDraft) return;

    try {
      await deleteDoc(doc(db, "orders", selectedDraft.id));
      setDrafts(drafts.filter((draft) => draft.id !== selectedDraft.id));
      setShowConfirmation(false);
      setSelectedDraft(null);
    } catch (error) {
      console.error("Error discarding draft:", error);
      // You might want to show an error message to the user here
    }
  };

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          where("status", "==", "draft"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const draftOrders: DraftOrder[] = [];

        querySnapshot.forEach((doc) => {
          draftOrders.push({
            ...doc.data(),
            id: doc.id,
          } as DraftOrder);
        });

        setDrafts(draftOrders);
      } catch (error) {
        console.error("Error fetching drafts:", error);
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [user]);

  if (loading) {
    return (
      <div className="vertical py-32">
        <LoadingAnimantion className="m-10" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return <ZeroOrders />;
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1">
        {drafts.map((draft) => (
          <div
            key={draft.id} // Changed from orderNumber to id for better uniqueness
            className="group cursor-pointer transition-all duration-500"
            onClick={() =>
              router.push(`/customer/orders/drafts/${draft.orderNumber}`)
            }
          >
            <div className="horizontal-space-between rounded-lg bg-gray-100 hover:bg-gray-50 p-4 my-2">
              <div className="horizontal-start gap-5">
                <div className="text-blue-600 group-hover:text-blue-800">
                  Order {draft.orderNumber}
                </div>
                <p className="text-sm text-gray-500 group-hover:text-blue-600">
                  Created: {new Date(draft.createdAt).toLocaleDateString()}{" "}
                  <span className="ml-3">
                    Last updated:{" "}
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div>
                <button
                  onClick={(e) => handleDiscardDraft(draft, e)}
                  className="text-red-500"
                >
                  Discard
                </button>{" "}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setSelectedDraft(null);
        }}
        onConfirm={confirmDiscard}
        title="Discard Draft"
        message="Are you sure you want to discard this draft? This action cannot be undone."
      />
    </>
  );
}
