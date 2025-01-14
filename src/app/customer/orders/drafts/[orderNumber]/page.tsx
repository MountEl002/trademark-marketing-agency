"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronDown } from "react-icons/io5";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import AssignmentTypeSelector from "@/components/customer/orders/draftOrder/AssignmentType";
import ServiceSelector from "@/components/customer/orders/draftOrder/ServiceSelector";
import AcademicLevelSelector from "@/components/customer/orders/draftOrder/AcademicLevelSelector";
import LanguageSelector from "@/components/customer/orders/draftOrder/LanguageSelector";
import LoadingScreen from "@/components/common/LoadingScreen";
import AddOnsSelector from "@/components/customer/orders/draftOrder/AddOnsSelector";
import TopicSelector from "@/components/customer/orders/draftOrder/TopicSelector";
import SubjectSelector from "@/components/customer/orders/draftOrder/SubjectSelector";
import SizeSelector from "@/components/customer/orders/draftOrder/SizeSelector";
import DeadlineSelector from "@/components/customer/orders/draftOrder/DeadlineSelector";
import InstructionsEditor from "@/components/customer/orders/draftOrder/InstructionsEditor";
import ConfirmationDialog from "@/components/customer/orders/draftOrder/ConfirmationDialog";
import CountdownDisplayer from "@/components/customer/orders/draftOrder/CountdownDisplayer";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

interface OrderData {
  assignmentType: string;
  service: string;
  academicLevel: string;
  language: string;
  size: string;
  words: number;
  deadline: {
    date: string;
    formattedDate: string;
  };
  addOns: string;
  topic: string;
  subject: string;
  instructions: string;
}

function OrderPage({ params }: PageProps) {
  const { orderNumber } = use(params);
  const [orderData, setOrderData] = useState<OrderData>({
    assignmentType: "",
    service: "",
    academicLevel: "",
    language: "",
    size: "",
    words: 0,
    deadline: { date: "", formattedDate: "" },
    addOns: "",
    topic: "",
    subject: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(true);
  const [activeField, setActiveField] = useState<number | null>(null);
  const [addOnsTotalPrice, setAddOnsTotalPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorDiscarding, setErrorDiscarding] = useState(false);
  const [successDiscarding, setSuccessDiscarding] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const router = useRouter();

  console.log(addOnsTotalPrice);

  // Function to handle draft deletion
  const handleDiscardDraft = async () => {
    try {
      const orderRef = doc(db, "orders", orderNumber.toString());
      setDiscarding(true);
      await deleteDoc(orderRef);
      setDiscarding(false);
      setSuccessDiscarding(true);
      setTimeout(() => {
        router.push("/customer/orders/drafts");
      }, 2000);
    } catch (error) {
      console.error("Error discarding draft:", error);
      setErrorDiscarding(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  // Function to find the next empty field
  const findNextEmptyField = () => {
    const nextEmptyField = fields.find(
      (field) => !orderData[field.field as keyof OrderData]
    );
    console.log("Next empty field is: ", nextEmptyField?.name);

    return nextEmptyField?.id || null;
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const docRef = doc(db, "orders", orderNumber.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrderData(docSnap.data() as OrderData);
        } else {
          console.error("No such document!");
          router.push("/customer/orders/drafts");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        router.push("/customer/orders/drafts");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderNumber, router]);

  // Function to update Firebase
  const updateFirebase = async (field: string, value: unknown) => {
    try {
      const orderRef = doc(db, "orders", orderNumber.toString());
      await updateDoc(orderRef, {
        [field]: value,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Generic state update function
  const updateField = (field: keyof OrderData, value: unknown) => {
    setOrderData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Find and activate next empty field
    const nextEmptyField = findNextEmptyField();
    setActiveField(nextEmptyField);

    updateFirebase(field, value);
  };

  const handleClick = (id: number) => {
    setActiveField(activeField === id ? null : id);
  };

  const handleInstructionsUpdate = (instructions: string) => {
    updateField("instructions", instructions);
    // Handle the uploaded files as needed
  };

  const fields = [
    {
      id: 1,
      name: "Assignment type",
      placeHolder: "Select assignment type",
      neccessity: "required",
      value: orderData.assignmentType,
      field: "assignmentType" as keyof OrderData,
    },
    {
      id: 2,
      name: "Service",
      placeHolder: "Select service",
      neccessity: "required",
      value: orderData.service,
      field: "service" as keyof OrderData,
    },
    {
      id: 3,
      name: "Academic level",
      placeHolder: "Select academic level",
      neccessity: "required",
      value: orderData.academicLevel,
      field: "academicLevel" as keyof OrderData,
    },
    {
      id: 4,
      name: "Language",
      placeHolder: "Select language",
      neccessity: "required",
      value: orderData.language,
      field: "language" as keyof OrderData,
    },
    {
      id: 5,
      name: "Size",
      placeHolder: "Indicate the size of assignment",
      neccessity: "required",
      value: orderData.size,
      field: "size" as keyof OrderData,
    },
    {
      id: 6,
      name: "Deadline",
      placeHolder: "Select deadline",
      neccessity: "required",
      value: orderData.deadline,
      field: "deadline" as keyof OrderData,
    },
    {
      id: 7,
      name: "Add-ons",
      placeHolder: "Select add-ons",
      neccessity: "optional",
      value: orderData.addOns,
      field: "addOns" as keyof OrderData,
    },
    {
      id: 8,
      name: "Topic",
      placeHolder: "Write Your Topic",
      neccessity: "required",
      value: orderData.topic,
      field: "topic" as keyof OrderData,
    },
    {
      id: 9,
      name: "Subject",
      placeHolder: "Select your subject",
      neccessity: "required",
      value: orderData.subject,
      field: "subject" as keyof OrderData,
    },
    {
      id: 10,
      name: "Instructions",
      placeHolder: "Write instructions and/or attach files",
      neccessity: "required",
      value: orderData.instructions,
      field: "instructions" as keyof OrderData,
    },
  ];

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden">
      <div className="fixed inset-x-0 top-0 h-24 z-[60] py-8 bg-gray-200">
        <div className="horizontal-space-between max-w-4xl mx-auto px-3">
          <div>
            <h4 className="!mb-0">
              Order {orderNumber}{" "}
              <span className="text-gray-500 font-medium">(Draft)</span>
            </h4>
          </div>
          <div className="horizontal gap-3">
            <button
              onClick={() => setShowConfirmation(true)}
              className="button-red"
            >
              Discard
            </button>
            <Link className="button-blue" href="/customer/orders/drafts">
              Close
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation dialog component */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        discarding={discarding}
        successDiscarding={successDiscarding}
        errorDiscarding={errorDiscarding}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDiscardDraft}
        title="Discard Draft"
        message="Are you sure you want to discard this draft? This action cannot be undone."
      />

      {/* List of fields */}
      <div className="grid grid-cols-1 gap-2 my-24 max-w-4xl mx-auto px-3">
        {fields.map((field) => (
          <div key={field.id}>
            <div
              onClick={() => handleClick(field.id)}
              className={`draft-order-grids-min group ${
                activeField === field.id
                  ? "hidden"
                  : "flex flex-row items-center justify-between"
              }`}
            >
              <div className="first-div">
                <p>{field.name}</p>
                <p>
                  {field.id === 6 && orderData.deadline ? (
                    <>
                      {orderData.deadline.formattedDate} (
                      <CountdownDisplayer
                        targetDate={orderData.deadline.date}
                      />
                      )
                    </>
                  ) : (
                    field.value?.toString() || field.placeHolder
                  )}
                  {!field.value && field.neccessity === "required" && (
                    <span className="animate-pulse ml-2 inline text-red-600">
                      ({field.neccessity})
                    </span>
                  )}
                </p>
              </div>
              <div
                className={`second-div transition-all duration-500 ${
                  field.value
                    ? "bg-blue-400 group-hover:bg-blue-500"
                    : "bg-blue-600 group-hover:bg-blue-700"
                }`}
              >
                <span className="text-white text-sm">
                  {field.value ? "Edit" : "Fill"}
                </span>
                <IoChevronDown
                  className={`text-xl text-white rounded-sm transition-all duration-500 ${
                    field.value
                      ? "bg-blue-300 group-hover:bg-blue-400"
                      : "bg-blue-500 group-hover:bg-blue-600"
                  }`}
                />
              </div>
            </div>
            <div
              className={`bg-white rounded-lg py-3 px-2 transition-all duration-300 ${
                activeField === field.id
                  ? "flex flex-col items-start justify-start h-fit"
                  : "hidden"
              }`}
            >
              <div className="w-full">
                {field.id === 1 ? (
                  <AssignmentTypeSelector
                    value={orderData.assignmentType}
                    onChange={(value) => updateField("assignmentType", value)}
                  />
                ) : field.id === 2 ? (
                  <ServiceSelector
                    value={orderData.service}
                    onChange={(value: unknown) => updateField("service", value)}
                  />
                ) : field.id === 3 ? (
                  <AcademicLevelSelector
                    value={orderData.academicLevel}
                    onChange={(value: unknown) =>
                      updateField("academicLevel", value)
                    }
                  />
                ) : field.id === 4 ? (
                  <LanguageSelector
                    value={orderData.language}
                    onChange={(value: unknown) =>
                      updateField("language", value)
                    }
                  />
                ) : field.id === 5 ? (
                  <SizeSelector
                    value={orderData.size}
                    onChange={(sizeString) => {
                      // Extract word count from the size string
                      const wordCount = parseInt(sizeString.split(" ")[2]);
                      // Update both fields using the existing updateField function
                      updateField("size", sizeString);
                      updateField("words", wordCount);
                    }}
                  />
                ) : field.id === 6 ? (
                  <DeadlineSelector
                    value={orderData.deadline}
                    onChange={(value) => updateField("deadline", value)}
                  />
                ) : field.id === 7 ? (
                  <AddOnsSelector
                    value={orderData.addOns}
                    onChange={(value, totalPrice) => {
                      updateField("addOns", value);
                      setAddOnsTotalPrice(totalPrice);
                    }}
                    onContinue={() => {
                      const nextEmptyFieldId = findNextEmptyField();
                      if (nextEmptyFieldId) {
                        setActiveField(nextEmptyFieldId);
                      }
                    }}
                  />
                ) : field.id === 8 ? (
                  <TopicSelector
                    value={orderData.topic}
                    onChange={(value) => updateField("topic", value)}
                    onContinue={() => {
                      const nextEmptyFieldId = findNextEmptyField();
                      if (nextEmptyFieldId) {
                        setActiveField(nextEmptyFieldId);
                      }
                    }}
                  />
                ) : field.id === 9 ? (
                  <SubjectSelector
                    value={orderData.subject}
                    onChange={(value) => updateField("subject", value)}
                  />
                ) : field.id === 10 ? (
                  <InstructionsEditor
                    value={orderData.instructions}
                    onUpdate={handleInstructionsUpdate}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPage;
