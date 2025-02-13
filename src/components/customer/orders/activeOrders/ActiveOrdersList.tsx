"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import ZeroOrders from "@/components/customer/orders/ZeroOrders";
import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import CountdownDisplayer from "../draftOrder/CountdownDisplayer";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdTipsAndUpdates } from "react-icons/md";
import UniversalButton from "@/components/common/UniversalButton";

interface ActiveOrder {
  id: string;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: string;
  assignmentType: string;
  language: string;
  size: string;
  price: number;
  topic: string;
  deadline: {
    date: string;
    formattedDate: string;
  };
  words: number;
}

export default function ActiveOrdersList() {
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation dialog state
  const { user } = useAuth();
  const router = useRouter();

  const BlueSeparator = () => (
    <span className="text-blue-700 text-xl"> | </span>
  );

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
            className="cursor-pointer transition-all duration-500"
            onClick={() =>
              router.push(`/customer/orders/open/${active.orderNumber}`)
            }
          >
            <div className="order-details-container">
              <div className="vertical-start w-full">
                <div className="text-gray-800 truncate overflow-hidden">
                  {active.topic ? active.topic : "(No topic)"}
                </div>
                <div className="text-sm w-[90%] text-gray-500">
                  <p className="truncate">
                    {active.orderNumber}
                    {active.words > 0 && (
                      <>
                        <BlueSeparator />
                        <span>{active.words} words</span>
                      </>
                    )}
                    {active.assignmentType && (
                      <>
                        <BlueSeparator /> {active.assignmentType}
                      </>
                    )}
                    {active.language && (
                      <>
                        <BlueSeparator /> {active.language}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-start justify-start gap-2 mr-7">
                {active.price > 0 && (
                  <div className="text-sm text-gray-800">
                    <span className="truncate">${active.price}</span>
                  </div>
                )}
                {active.deadline && (
                  <CountdownDisplayer targetDate={active.deadline.date} />
                )}
              </div>
              <div className="absolute right-2 p-2 group vertical h-fit botton-1/2  text-gray-500 hover:text-blue-700 transtion-all duration-500">
                <FaEllipsisVertical size={18} />
                <div className="absolute hidden group-hover:block z-40 bg-transparent top-full -right-2">
                  <UniversalButton
                    icon={MdTipsAndUpdates}
                    text="Progress update"
                    buttonClassName="bg-green-500 hover:bg-green-700"
                    iconClassName="bg-green-400 group-hover:bg-green-600"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
