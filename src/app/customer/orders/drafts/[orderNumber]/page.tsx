"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoChevronDown } from "react-icons/io5";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { calculateDeadlineString } from "@/constants/calculateDeadlineString";
import { AcademicLevel, TimeFrame } from "@/types/pricing";
import { WritingTotalPriceMapper } from "@/utils/writingPriceMapper";
import { editingPriceMapper } from "@/utils/editingPriceMapper";
import { rewritingPriceMapper } from "@/utils/rewritingPriceMapper";
import { proofreadingPriceMapper } from "@/utils/proofreadingPriceMapper";
import { IoChevronForwardSharp } from "react-icons/io5";
import StyleSelector from "@/components/customer/orders/draftOrder/StyleSelecteor";
import SourcesSelector from "@/components/customer/orders/draftOrder/SourcesSelector";
import { useBalance } from "@/hooks/useBalance";
import { Tooltip } from "react-tooltip";
import { useOrderStatusModifier } from "@/utils/useOrderStatusModifier";
import OrderActivationDialog from "@/components/customer/orders/draftOrder/OrderActivationDialog";
import { UploadedFileInfo } from "@/types/order";
import CloseButton from "@/components/common/CloseButton";
import DiscardButton from "@/components/common/DiscardButton";
import { deleteAllOrderFiles } from "@/utils/delete-all-order-files";
import { useAuth } from "@/contexts/AuthContext";
import Chat from "@/components/common/Chat";

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
  addOnsTotalPrice: number;
  topic: string;
  subject: string;
  instructions: string;
  orderFiles: UploadedFileInfo[];
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
    addOnsTotalPrice: 0,
    topic: "",
    subject: "",
    instructions: "",
    orderFiles: [],
    price: 0,
    sources: "",
    style: "",
    userBalance: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeField, setActiveField] = useState<number | null>(null);
  const fieldRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [addOnsTotalPrice, setAddOnsTotalPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [errorDiscarding, setErrorDiscarding] = useState(false);
  const [successDiscarding, setSuccessDiscarding] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [activationSuccesful, setActivationSuccesful] = useState(false);
  const [activationFailed, setActivationFailed] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const { modifyOrderStatus, isModifying, modificationError } =
    useOrderStatusModifier();

  const handlePageClose = () => {
    router.push("/customer/orders/drafts");
  };
  // PRICE CALCULATION SECTION
  const allFieldsFilled = [
    orderData.academicLevel,
    orderData.deadline,
    orderData.size,
    orderData.assignmentType,
    orderData.instructions,
    orderData.language,
    orderData.service,
    orderData.subject,
    orderData.topic,
    orderData.sources,
    orderData.style,
  ];

  const areAllFieldsFilled = () => {
    return allFieldsFilled.every((field) => field !== null && field !== "");
  };

  const { balance } = useBalance();

  // Price calculation section
  const calculateServicePrice = () => {
    if (!areAllFieldsFilled()) return null;

    const deadlineString = calculateDeadlineString(
      orderData.deadline.date
    ) as TimeFrame;
    const academicLevelString = orderData.academicLevel as AcademicLevel;

    switch (orderData.service.toLowerCase()) {
      case "writing":
        return WritingTotalPriceMapper(
          academicLevelString,
          deadlineString,
          orderData.words
        );

      case "editing":
        return editingPriceMapper(
          academicLevelString,
          deadlineString,
          orderData.words
        );

      case "proofreading":
        return proofreadingPriceMapper(
          academicLevelString,
          deadlineString,
          orderData.words
        );

      case "rewriting":
        return rewritingPriceMapper(
          academicLevelString,
          deadlineString,
          orderData.words
        );

      default:
        return null;
    }
  };

  const servicePrice = calculateServicePrice();
  const totalPrice = (servicePrice?.price ?? 0) + addOnsTotalPrice;

  // Function to handle draft deletion
  const handleDiscardDraft = async () => {
    try {
      const orderRef = doc(db, "orders", orderNumber.toString());
      setDiscarding(true);
      await deleteDoc(orderRef);
      if (user) {
        try {
          const result = await deleteAllOrderFiles(
            orderNumber,
            user.uid,
            false
          );
          console.log(`Deleted ${result.deletedFiles.length} files`);
        } catch (error) {
          console.error("Failed to delete order files:", error);
        }
      } else {
        throw new Error("User is not authenticated");
      }
      setDiscarding(false);
      setSuccessDiscarding(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setSuccessDiscarding(false);
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

  const findNextEmptyField = () => {
    // Start searching from the field after the current active field
    const fieldsAfterCurrent = fields.filter(
      (field) => field.id > (activeField || 0)
    );

    const nextEmptyField = fieldsAfterCurrent.find(
      (field) => !orderData[field.field as keyof OrderData]
    );
    return nextEmptyField?.id || null;
  };

  // Fetch data from Firebase before page load
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const docRef = doc(db, "orders", orderNumber.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as OrderData;
          setOrderData(data);
          setAddOnsTotalPrice(data.addOnsTotalPrice);

          // Find the first empty field on page load
          switch (true) {
            case !data.assignmentType:
              setActiveField(1);
              break;
            case !data.service:
              setActiveField(2);
              break;
            case !data.academicLevel:
              setActiveField(3);
              break;
            case !data.language:
              setActiveField(4);
              break;
            case !data.size:
              setActiveField(5);
              break;
            case !data.deadline.date:
              setActiveField(6);
              break;
            case !data.addOns:
              setActiveField(7);
              break;
            case !data.topic:
              setActiveField(8);
              break;
            case !data.subject:
              setActiveField(9);
              break;
            case !data.instructions:
              setActiveField(10);
              break;
            default:
              setActiveField(null);
          }
        } else {
          console.error("No such document!");
          router.push("/customer/orders/new");
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

  const handleInstructionsUpdate = (
    instructions: string,
    files: UploadedFileInfo[]
  ) => {
    updateField("instructions", instructions);
    updateField("orderFiles", files);
  };

  const formatInstructionsDisplay = (
    instructions?: string | null,
    files?: UploadedFileInfo[] | null
  ): string => {
    // Ensure instructions and files are defined and not null
    const safeInstructions = instructions || "";
    const safeFiles = files || [];

    // If both instructions and files are empty, return empty string
    if (!safeInstructions.trim() && safeFiles.length === 0) {
      return "";
    }

    // Create file prefix if files exist
    const filePrefix =
      safeFiles.length > 0 ? `| Attached files (${safeFiles.length}) | ` : "";

    // Combine file prefix and instructions
    return `${filePrefix}${safeInstructions}`.trim();
  };

  // Update the price field

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
      value: formatInstructionsDisplay(
        orderData.instructions,
        orderData.orderFiles
      ),
      field: "instructions" as keyof OrderData,
    },
    {
      id: 11,
      name: "Style",
      placeHolder: "Select your citation style",
      neccessity: "required",
      value: orderData.style,
      field: "style" as keyof OrderData,
    },
    {
      id: 12,
      name: "sources",
      placeHolder: "Select the required number of sources",
      neccessity: "required",
      value: orderData.sources,
      field: "sources" as keyof OrderData,
    },
  ];

  // Initialize refs array in useEffect to avoid issues with changing array length
  useEffect(() => {
    fieldRefs.current = fieldRefs.current.slice(0, fields.length);
  }, [fields.length]);

  // Scroll to active field effect
  useEffect(() => {
    if (activeField !== null) {
      const activeElement = fieldRefs.current[activeField - 1];
      if (activeElement) {
        // Calculate positions
        const elementRect = activeElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle =
          absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

        // Smooth scroll to the element
        window.scrollTo({
          top: middle,
          behavior: "smooth",
        });
      }
    }
  }, [activeField]);

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  const handleOrderActivation = async () => {
    setShowActivationDialog(true);
    if (balance > totalPrice) {
      try {
        await modifyOrderStatus(orderNumber, "Active");
        setActivationSuccesful(true);
        await updateFirebase("price", totalPrice);
      } catch {
        setActivationFailed(true);
      }
    } else {
      setActivationFailed(true);
    }
  };

  const openActiveOrders = () => {
    router.push("/customer/orders/open");
    setActivationSuccesful(false);
    setActivationFailed(false);
    setShowActivationDialog(false);
  };

  const goBackToDraft = () => {
    setActivationSuccesful(false);
    setActivationFailed(false);
    setShowActivationDialog(false);
  };

  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden pb-80">
      <Chat />
      <div className="fixed inset-x-0 top-0 min-[360px]:h-24 z-[60] py-8 bg-gray-200">
        <div className="flex flex-col min-[360px]:flex-row gap-2 items-center justify-between max-w-4xl mx-auto px-3">
          <div>
            <h4 className="!mb-0">
              Order {orderNumber}
              <span className="text-gray-500 font-medium">(Draft)</span>
            </h4>
          </div>
          <div className="horizontal gap-3">
            <DiscardButton onClick={() => setShowConfirmation(true)} />
            <CloseButton onClick={handlePageClose} />
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

      {/* Order activation dialog component */}
      <OrderActivationDialog
        isOpen={showActivationDialog}
        activating={isModifying}
        successActivating={activationSuccesful}
        errorActivating={activationFailed}
        openActiveOrders={openActiveOrders}
        goBackToDraft={goBackToDraft}
        modificationError={modificationError}
      />

      {/* List of fields */}
      <div className="grid grid-cols-1 gap-2 mb-[0.18rem] mt-[6.3rem] max-w-4xl mx-auto px-3">
        {fields.map((field) => (
          <div
            key={field.id}
            ref={(element) => {
              fieldRefs.current[field.id - 1] = element;
            }}
          >
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
                    field.value?.toString() || field.placeHolder
                  )}
                  {!field.value && field.neccessity === "required" && (
                    <span className="animate-pulse ml-2 inline text-red-600">
                      ({field.neccessity})
                    </span>
                  )}
                </p>
              </div>

              {/* Edit/Fill button */}
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
                    onChange={(data) => {
                      // Update both fields using the existing updateField function
                      updateField("size", data.sizeString);
                      updateField("words", data.finalWords);
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
                    onChange={(value, addOnsTotalPrice) => {
                      updateField("addOns", value);
                      updateField("addOnsTotalPrice", addOnsTotalPrice);
                      setAddOnsTotalPrice(addOnsTotalPrice);
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
                    orderNumber={orderNumber}
                    onUpdate={handleInstructionsUpdate}
                    orderFiles={orderData.orderFiles}
                  />
                ) : field.id === 11 ? (
                  <StyleSelector
                    value={orderData.style}
                    onChange={(value: unknown) => updateField("style", value)}
                  />
                ) : field.id === 12 ? (
                  <SourcesSelector
                    value={orderData.sources}
                    onChange={(value) => updateField("sources", value)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totol price of the order */}
      {areAllFieldsFilled() && (
        <div className="py-2 w-full">
          <div className="max-w-4xl mx-auto px-3">
            <div className="horizontal-space-between pl-3 pr-2 py-2 rounded-lg bg-gray-100 hover:bg-white">
              <div className="horizontal-space-between w-1/3 gap-3">
                <p className="w-fit">Total price:</p>
                <p className="text-gray-700 font-medium">${totalPrice}</p>
              </div>
              <p className="text-base text-gray-600"></p>
              {/* Add funds Button and Activate order button */}
              {balance > totalPrice ? (
                <div
                  onClick={handleOrderActivation}
                  data-tooltip-id="activate-order-tooltip"
                  data-tooltip-content="Click to submit the order and we will start working on it immediately."
                  className="add-funds-button text-sm"
                >
                  <button type="button" className="group">
                    Activate order
                    <IoChevronForwardSharp
                      size={30}
                      className="chev-icon group-hover:bg-green-500"
                    />
                  </button>
                  <Tooltip id="activate-order-tooltip" />
                </div>
              ) : (
                <div
                  data-tooltip-id="add-funds-tooltip"
                  data-tooltip-content="Click to click to add funds to your account so that we can start working on this order immediately."
                  className="add-funds-button text-sm"
                >
                  <button type="button" className="group">
                    Add funds
                    <IoChevronForwardSharp
                      size={30}
                      className="chev-icon group-hover:bg-green-500"
                    />
                  </button>
                  <Tooltip id="add-funds-tooltip" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
