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
import { deleteAllOrderFiles } from "@/utils/delete-all-order-files";
import { MdOutlineDelete } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";
import CountdownDisplayer from "./draftOrder/CountdownDisplayer";

interface DraftOrder {
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

export default function DraftOrdersList() {
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorDiscarding, setErrorDiscarding] = useState(false);
  const [successDiscarding, setSuccessDiscarding] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftOrder | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const BlueSeparator = () => (
    <span className="text-blue-700 text-xl"> | </span>
  );
  // Delete handler
  const handleDiscardDraft = async (draft: DraftOrder, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setSelectedDraft(draft);
    setShowConfirmation(true);
  };

  const confirmDiscard = async () => {
    if (!selectedDraft) return;

    try {
      setDiscarding(true);
      await deleteDoc(doc(db, "orders", selectedDraft.id));
      if (user) {
        try {
          const result = await deleteAllOrderFiles(
            selectedDraft.orderNumber.toString(),
            user.uid,
            false
          );
          console.log(`Deleted ${result.deletedFiles.length} files`);

          if (!result.success) {
            console.error("Some files failed to delete:", result.message);
          }
        } catch (error) {
          console.error("Failed to delete order files:", error);
        }
      } else {
        throw new Error("User is not authenticated");
      }
      setDiscarding(false);
      setSuccessDiscarding(true);
      setTimeout(() => {
        setSuccessDiscarding(false);
        setShowConfirmation(false);
      }, 3000);
      setDrafts(drafts.filter((draft) => draft.id !== selectedDraft.id));
      setSelectedDraft(null);
    } catch (error) {
      setDiscarding(false);
      setErrorDiscarding(true);
      console.error("Error discarding draft:", error);
      setTimeout(() => {
        setErrorDiscarding(false);
        setShowConfirmation(false);
      }, 3000);
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
      <div className="grid gap-1 grid-cols-1">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="cursor-pointer transition-all duration-500"
            onClick={() =>
              router.push(`/customer/orders/drafts/${draft.orderNumber}`)
            }
          >
            <div className="relative flex sm:flex-row flex-col items-start sm:items-center justify-start sm:justify-between w-full gap-2 rounded-lg bg-gray-100 hover:bg-gray-50 py-2 px-4 my-2">
              <div className="vertical-start w-full">
                <div className="text-gray-800 truncate overflow-hidden">
                  {draft.topic ? draft.topic : "(No topic)"}
                </div>
                <div className="text-sm w-[90%] text-gray-500">
                  <p className="truncate">
                    {draft.orderNumber}
                    {draft.words > 0 && (
                      <>
                        <BlueSeparator />
                        <span>{draft.words} words</span>
                      </>
                    )}
                    {draft.assignmentType && (
                      <>
                        <BlueSeparator /> {draft.assignmentType}
                      </>
                    )}
                    {draft.language && (
                      <>
                        <BlueSeparator /> {draft.language}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-start justify-start gap-2 mr-7">
                {draft.price > 0 && (
                  <div className="text-sm text-gray-800">
                    <span className="truncate">~ ${draft.price}</span>
                  </div>
                )}
                {draft.deadline && (
                  <CountdownDisplayer targetDate={draft.deadline.date} />
                )}
              </div>
              <div className="absolute right-2 p-2 group vertical h-full top-0  text-gray-500 hover:text-blue-700 transtion-all duration-500">
                <FaEllipsisVertical size={18} />
                <div className="absolute hidden group-hover:block z-40 bg-transparent top-full -right-2">
                  <button
                    type="button"
                    onClick={(e) => handleDiscardDraft(draft, e)}
                    className="horizontal-start group gap-3 pr-5 min-[550px]:pr-10 bg-red-500 hover:bg-red-700 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500"
                  >
                    <div className="vertical p-1 min-[550px]:p-2 left-1 m-[2px] bg-red-400 group-hover:bg-red-600 h-[90%] rounded transition-all duration-500">
                      <MdOutlineDelete size={20} />
                    </div>
                    <span>Discard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationDialog
        isOpen={showConfirmation}
        discarding={discarding}
        successDiscarding={successDiscarding}
        errorDiscarding={errorDiscarding}
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
