// components/customer/DraftOrdersList.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import ZeroOrders from "@/components/customer/orders/zeroOrders";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

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
  const { user } = useAuth();
  const router = useRouter();

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <div
          key={draft.id} // Changed from orderNumber to id for better uniqueness
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() =>
            router.push(`/customer/orders/drafts/${draft.orderNumber}`)
          }
        >
          <div>
            <div>Order #{draft.orderNumber}</div>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Created: {new Date(draft.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
