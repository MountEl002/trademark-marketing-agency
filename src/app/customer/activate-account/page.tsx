import React from "react";
import { FaCheck } from "react-icons/fa";

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  priceSuffix: string;
  features: string[];
  buttonText: string;
  bgColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  borderColor: string;
}

const pricingPlansData: PricingPlan[] = [
  {
    id: "starter",
    title: "Starter",
    price: "Ksh 1200",
    priceSuffix: "/Forever",
    features: [
      "Advertise With us",
      "Cashback",
      "Cashback Ksh2400",
      "Whatsapp Earning",
    ],
    buttonText: "Get Started",
    bgColor: "bg-emerald-500",
    textColor: "text-white",
    buttonBgColor: "bg-slate-800",
    buttonTextColor: "text-white",
    borderColor: "border-emerald-300",
  },
  {
    id: "royal",
    title: "Royal",
    price: "Ksh 3000",
    priceSuffix: "/Forever",
    features: [
      "Advertise With us",
      "Cashback",
      "Cashback Ksh6000",
      "Whatsapp Earning",
    ],
    buttonText: "Get Started",
    bgColor: "bg-emerald-500",
    textColor: "text-white",
    buttonBgColor: "bg-slate-800",
    buttonTextColor: "text-white",
    borderColor: "border-emerald-300",
  },
  {
    id: "luxury",
    title: "Luxury",
    price: "Ksh 4800",
    priceSuffix: "/Forever",
    features: [
      "Advertise With us",
      "Cashback",
      "Cashback Ksh9600",
      "Whatsapp Earning",
    ],
    buttonText: "Get Started",
    bgColor: "bg-emerald-500",
    textColor: "text-white",
    buttonBgColor: "bg-slate-800",
    buttonTextColor: "text-white",
    borderColor: "border-emerald-300",
  },
];

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  return (
    <div
      className={`
        ${plan.bgColor} ${plan.textColor} 
        rounded-xl shadow-lg p-6 sm:p-8 
        flex flex-col justify-between h-full
      `}
    >
      <div>
        <h3 className="text-2xl font-semibold text-center mb-4">
          {plan.title}
        </h3>
        <div className="text-center mb-6">
          <span className="text-5xl font-bold">{plan.price}</span>
          <span className="text-sm opacity-80 ml-1">{plan.priceSuffix}</span>
        </div>
        <hr
          className={`border-t-2 border-dashed ${plan.borderColor} opacity-70 my-6`}
        />
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <FaCheck className="text-emerald-200 w-5 h-5 mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        className={`
          ${plan.buttonBgColor} ${plan.buttonTextColor}
          w-full py-3 px-6 rounded-lg font-semibold 
          hover:opacity-90 transition-opacity duration-200
        `}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

const PricingSectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlansData.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSectionPage;
