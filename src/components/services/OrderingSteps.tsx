"use client";

import { useState } from "react";
import Image from "next/image";
import OrderingStep1 from "@/assests/OrderingStep1.png";
import OrderingStep2 from "@/assests/OrderingStep2.png";
import OrderingStep3 from "@/assests/OrderingStep3.png";
import GetServiceButton from "./GetServiceButton";
import { CreateAnOrderStep, OrderingStepImage } from "@/types/servicesPages";

interface OrderingStepsProps {
  orderingStepsTitle: string;
  orderingStepsDescription: string;
  stepOneTitle: string;
  stepOneDescription: string;
  stepThreeTitle: string;
  stepThreeDescription: string;
}

const orderingStepImages: OrderingStepImage[] = [
  { id: 1, src: OrderingStep1, alt: "Creating an order step 1" },
  { id: 2, src: OrderingStep2, alt: "Creating an order step 2" },
  { id: 3, src: OrderingStep3, alt: "Creating an order step 3" },
];

const OrderingSteps = ({
  orderingStepsTitle,
  orderingStepsDescription,
  stepOneTitle,
  stepOneDescription,
  stepThreeTitle,
  stepThreeDescription,
}: OrderingStepsProps) => {
  const createAnOrderSteps: CreateAnOrderStep[] = [
    {
      id: 1,
      step: stepOneTitle,
      stepDescription: stepOneDescription,
    },
    {
      id: 2,
      step: "Add funds to your personal account",
      stepDescription:
        "Once you have completed filling the ordering form, you should click the green button to add funds to your personal account at High-Quality Essay. We will start working on the order as soon as the funds are confirmed. However, if your account has sufficient funds, you will only click an activate button that will notify us that we should start working on the order.",
    },
    {
      id: 3,
      step: stepThreeTitle,
      stepDescription: stepThreeDescription,
    },
  ];

  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="bg-blue-50">
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
        <div className="mx-auto text-start">
          <h2>{orderingStepsTitle}</h2>
          <p className="mb-0 md:mb-12">{orderingStepsDescription}</p>
          <div className="hidden md:block">
            <GetServiceButton text="Create an order" />
          </div>
        </div>
        <div className="space-y-3">
          {createAnOrderSteps.map((step, index) => {
            const stepImage = orderingStepImages[index];
            return (
              <div
                key={step.id}
                className={`max-w-3xl mx-auto border border-gray-400 hover:border-blue-600 rounded-2xl cursor-pointer transition-all duration-500 ${
                  activeStep === step.id ? "shadow-md" : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="horizontal-start gap-4 px-6 py-3">
                  <div
                    className={`vertical font-bold text-xl w-10 h-10 rounded-[50%] flex-shrink-0 transition-all duration-500 ${
                      activeStep === step.id
                        ? "text-white bg-blue-700"
                        : "text-blue-600 bg-blue-100"
                    }`}
                  >
                    {step.id}
                  </div>
                  <h5 className="!mb-0 text-blue-600">{step.step}</h5>
                </div>
                <p
                  className={`text-gray-600 p-6 ${
                    activeStep === step.id ? "block" : "hidden"
                  }`}
                >
                  {step.stepDescription}
                </p>
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    activeStep === stepImage.id ? "block" : "hidden"
                  }`}
                >
                  <Image
                    src={stepImage.src}
                    alt={stepImage.alt}
                    className="rounded-2xl shadow-lg w-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 mx-auto md:hidden block">
          <GetServiceButton text="Create an order" />
        </div>
      </div>
    </section>
  );
};

export default OrderingSteps;
