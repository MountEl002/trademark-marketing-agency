"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
// import { IoChevronDown } from "react-icons/io5";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import LoadingScreen from "@/components/common/LoadingScreen";
import CountdownDisplayer from "@/components/customer/orders/draftOrder/CountdownDisplayer";
import { useBalance } from "@/hooks/useBalance";
// import { Tooltip } from "react-tooltip";
import OrdersNavbar from "@/components/customer/orders/OrdersNavbar";

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
  price: number;
  sources: string;
  style: string;
  userBalance: number;
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
    price: 0,
    sources: "",
    style: "",
    userBalance: 0,
  });

  const [loading, setLoading] = useState(true);
  const fieldRefs = useRef<Array<HTMLDivElement | null>>([]);

  const router = useRouter();

  const { balance } = useBalance();
  console.log(balance);

  // Fetch data from Firebase before page load
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const docRef = doc(db, "orders", orderNumber.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as OrderData;
          setOrderData(data);
        } else {
          window.alert(
            "Sorry, we can't find the order in our database. Please contact support."
          );
          router.push("/customer/orders/drafts");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        router.push("/customer/orders/open");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderNumber, router]);

  const fields = [
    {
      id: 1,
      name: "Assignment type",
      value: orderData.assignmentType,
      field: "assignmentType" as keyof OrderData,
    },
    {
      id: 2,
      name: "Service",
      value: orderData.service,
      field: "service" as keyof OrderData,
    },
    {
      id: 3,
      name: "Academic level",
      value: orderData.academicLevel,
      field: "academicLevel" as keyof OrderData,
    },
    {
      id: 4,
      name: "Language",
      value: orderData.language,
      field: "language" as keyof OrderData,
    },
    {
      id: 5,
      name: "Size",
      value: orderData.size,
      field: "size" as keyof OrderData,
    },
    {
      id: 6,
      name: "Deadline",
      value: orderData.deadline,
      field: "deadline" as keyof OrderData,
    },
    {
      id: 7,
      name: "Add-ons",
      value: orderData.addOns,
      field: "addOns" as keyof OrderData,
    },
    {
      id: 8,
      name: "Topic",
      value: orderData.topic,
      field: "topic" as keyof OrderData,
    },
    {
      id: 9,
      name: "Subject",
      value: orderData.subject,
      field: "subject" as keyof OrderData,
    },
    {
      id: 10,
      name: "Instructions",
      value: orderData.instructions,
      field: "instructions" as keyof OrderData,
    },
    {
      id: 11,
      name: "Style",
      value: orderData.style,
      field: "style" as keyof OrderData,
    },
    {
      id: 12,
      name: "sources",
      value: orderData.sources,
      field: "sources" as keyof OrderData,
    },
  ];

  // Initialize refs array in useEffect to avoid issues with changing array length
  useEffect(() => {
    fieldRefs.current = fieldRefs.current.slice(0, fields.length);
  }, [fields.length]);

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="logged-in-customer-pages pb-24">
      <div className="max-w-4xl mx-auto px-3">
        <OrdersNavbar />
        <div className="flex sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3  my-6">
          <div>
            <h4 className="!mb-0">
              Order {orderNumber}{" "}
              <span className="text-gray-500 font-medium">(Active)</span>
            </h4>
          </div>
          <div className="flex sm:flex-row sm:items-center sm:justify-center flex-wrap gap-3">
            <button className="button-red">Progress update</button>
            <Link className="button-blue" href="/customer/orders/open">
              All active orders
            </Link>
          </div>
        </div>
      </div>

      {/* List of fields */}
      <div className="grid grid-cols-1 gap-2 max-w-4xl mx-auto px-3">
        {fields.map((field) => (
          <div key={field.id}>
            <div className="draft-order-grids-min flex flex-row items-center justify-between">
              <div className="first-div">
                <p>{field.name}</p>
                <p
                  className={`sm:col-span-10 truncate ${
                    field.id === 10 ? "" : ""
                  }`}
                >
                  {field.id === 6 && orderData.deadline ? (
                    <>
                      {orderData.deadline.formattedDate} (
                      <CountdownDisplayer
                        targetDate={orderData.deadline.date}
                      />
                      )
                    </>
                  ) : (
                    field.value?.toString() || "None selected"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totol price of the order */}
      <div className="py-2 w-full mt-5">
        <div className="max-w-4xl mx-auto px-3">
          <div className="horizontal-space-between pl-3 pr-2 py-2 rounded-lg bg-green-300 hover:bg-white">
            <div className="horizontal-space-between w-1/3 gap-3">
              <p className="w-fit">Total price:</p>
              <p className="text-gray-700 font-medium">${orderData.price}</p>
            </div>
            <p className="text-base text-gray-600"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
