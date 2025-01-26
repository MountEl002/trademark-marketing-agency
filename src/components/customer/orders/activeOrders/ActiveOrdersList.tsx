"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import ZeroOrders from "@/components/customer/orders/ZeroOrders";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";

interface ActiveOrder {
  id: string;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: string;
}

export default function ActiveOrdersList() {
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation dialog state
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchActiveOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const activeOrders: ActiveOrder[] = [];

        querySnapshot.forEach((doc) => {
          activeOrders.push({
            ...doc.data(),
            id: doc.id,
          } as ActiveOrder);
        });

        setActiveOrders(activeOrders);
      } catch (error) {
        console.error("Error fetching ActiveOrders:", error);
        setActiveOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrders();
  }, [activeOrders, user]);

  if (loading) {
    return (
      <div className="vertical py-32">
        <LoadingAnimantion className="m-10" />
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return <ZeroOrders />;
  }

  return (
    <>
      <div className="grid gap-1 grid-cols-1">
        {activeOrders.map((active) => (
          <div
            key={active.id}
            className="group cursor-pointer transition-all duration-500"
            onClick={() =>
              router.push(`/customer/orders/ActiveOrders/${active.orderNumber}`)
            }
          >
            <div className="horizontal-space-between rounded-lg bg-gray-100 hover:bg-gray-50 p-4 my-2">
              <div className="horizontal-start gap-5">
                <div className="text-blue-600 group-hover:text-blue-800">
                  Order {active.orderNumber}
                </div>
                <p className="text-sm text-gray-500 group-hover:text-blue-600">
                  Created: {new Date(active.createdAt).toLocaleDateString()}{" "}
                  <span className="ml-3">
                    Last updated:{" "}
                    {new Date(active.updatedAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
