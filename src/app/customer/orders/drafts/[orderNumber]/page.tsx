"use client";

import { use, useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import AssignmentTypeSelector from "@/components/customer/orders/draftOrder/AssignmentType";
import router from "next/router";
import LoadingScreen from "@/components/common/LoadingScreen";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

interface UploadedFileInfo {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  id: string;
}

// interface ClickCounts {
//   [key: number]: number;
// }

interface OrderData {
  assignmentType: string;
  service: string;
  academicLevel: string;
  language: string;
  size: string;
  pages: number;
  words: number;
  deadline: string;
  addOns: string;
  topic: string;
  subject: string;
  instructions: string;
  uploadedFiles: UploadedFileInfo[];
}

function OrderPage({ params }: PageProps) {
  const { orderNumber } = use(params);
  const [orderData, setOrderData] = useState<OrderData>({
    assignmentType: "",
    service: "",
    academicLevel: "",
    language: "",
    size: "",
    pages: 0,
    words: 0,
    deadline: "",
    addOns: "",
    topic: "",
    subject: "",
    instructions: "",
    uploadedFiles: [],
  });

  const [loading, setLoading] = useState(true);

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
  }, [orderNumber]);

  const [activeField, setActiveField] = useState<number | null>(null);
  // const [clickCounts, setClickCounts] = useState<ClickCounts>({});

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
    updateFirebase(field, value);
  };

  const handleClick = (id: number) => {
    setActiveField(activeField === id ? null : id);
    // setClickCounts((prevCounts) => ({
    //   ...prevCounts,
    //   [id]: (prevCounts[id] || 0) + 1,
    // }));
  };

  const fields = [
    {
      id: 1,
      name: "Assignment type",
      placeHolder: "Select assignment type",
      value: orderData.assignmentType,
      field: "assignmentType" as keyof OrderData,
    },
    {
      id: 2,
      name: "Service",
      placeHolder: "Select service",
      value: orderData.service,
      field: "service" as keyof OrderData,
    },
    {
      id: 3,
      name: "Academic level",
      placeHolder: "Select academic level",
      value: orderData.academicLevel,
      field: "academicLevel" as keyof OrderData,
    },
    {
      id: 4,
      name: "Language",
      placeHolder: "Select language",
      value: orderData.language,
      field: "language" as keyof OrderData,
    },
    {
      id: 5,
      name: "Size",
      placeHolder: "Indicate the size of assignment",
      value: orderData.size,
      field: "size" as keyof OrderData,
    },
    {
      id: 6,
      name: "Deadline",
      placeHolder: "Select deadline",
      value: orderData.deadline,
      field: "deadline" as keyof OrderData,
    },
    {
      id: 7,
      name: "Add-ons",
      placeHolder: "Select add-ons",
      value: orderData.addOns,
      field: "addOns" as keyof OrderData,
    },
    {
      id: 8,
      name: "Topic",
      placeHolder: "Write Your Topic",
      value: orderData.topic,
      field: "topic" as keyof OrderData,
    },
    {
      id: 9,
      name: "Subject",
      placeHolder: "Select your subject",
      value: orderData.subject,
      field: "subject" as keyof OrderData,
    },
    {
      id: 10,
      name: "Instructions",
      placeHolder: "Write instructions and/or attach files",
      value: orderData.instructions,
      field: "instructions" as keyof OrderData,
    },
  ];

  // const getClickCount = (id: number): number => {
  //   return clickCounts[id] || 0;
  // };

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden">
      <div className="fixed inset-x-0 top-0 h-24 z-[60] px-3 py-8 bg-gray-200">
        <div className="horizontal-space-between max-w-4xl mx-auto">
          <div>
            <h3 className="!mb-0">
              Order #{orderNumber}{" "}
              <span className="text-gray-500 font-medium">(Draft)</span>
            </h3>
          </div>
          <div className="button-blue">
            <Link href="/customer/orders/drafts">Close/Back</Link>
          </div>
        </div>
      </div>{" "}
      <div className="grid grid-cols-1 gap-2 mt-24 max-w-4xl mx-auto">
        {fields.map((field, index) => {
          const previousField = fields[index - 1];
          const shouldRenderField =
            index === 0 || (previousField && previousField.value);

          return shouldRenderField ? (
            <div key={field.id}>
              <div
                onClick={() => handleClick(field.id)}
                className={`draft-order-grids-min group ${
                  activeField === field.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="first-div">
                  <p>{field.name}</p>
                  <p>{field.value || field.placeHolder}</p>
                  {/* <span className="text-xs text-gray-500">
                  Clicked: {getClickCount(field.id)} times
                </span> */}
                </div>
                <div className="second-div group-hover:bg-blue-500 transition-all duration-500">
                  <span className="text-white text-sm">Edit</span>
                  <IoChevronDown
                    className={`group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transition-all duration-500 ${
                      activeField === field.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeField === field.id ? "max-h-full" : "max-h-0"
                }`}
              >
                {field.id === 1 ? (
                  <AssignmentTypeSelector
                    value={orderData.assignmentType}
                    onChange={(value) => updateField("assignmentType", value)}
                    className="p-4"
                  />
                ) : null}
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export default OrderPage;
