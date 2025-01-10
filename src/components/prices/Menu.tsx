"use client";

import React, { useState } from "react";
import Enticers from "./Enticers";
import RewritingPricing from "./RewritingPricing";
import WritingPricing from "@/components/prices/WritingPricing";
import EditingPricing from "./EditingPricing";
import ProofreadingPricing from "./ProofreadingPricing";

interface ServiceComponent {
  id: number;
  name: string;
  conponent: React.ReactElement;
}

const serviceComponents: ServiceComponent[] = [
  { id: 1, name: "Writing", conponent: <WritingPricing /> },
  { id: 2, name: "Rewriting", conponent: <RewritingPricing /> },
  { id: 3, name: "Editing", conponent: <EditingPricing /> },
  { id: 4, name: "Proofreading", conponent: <ProofreadingPricing /> },
];

const Menu = () => {
  const [selectedService, setSelectedService] = useState<number>(1);

  const handleClick = (id: number) => {
    setSelectedService(id);
  };

  return (
    <div>
      <div className="horizontal-start border-b-2 border-gray-300">
        {serviceComponents.map((service) => (
          <div key={service.id}>
            <div className="w-full horizontal-start">
              <button
                onClick={() => handleClick(service.id)}
                className={`relative inline-block p-3 text-base md:text-lg transition-all duration-500 ${
                  selectedService === service.id
                    ? "text-blue-600 hover:text-blue-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {service.name}{" "}
                <span
                  className={`absolute w-full border-b-2 -bottom-0.5 left-0 border-blue-600 ${
                    selectedService === service.id ? "block" : "hidden"
                  }`}
                ></span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start justify-start lg:flex-row lg:justify-center lg:items-center gap-5">
        <div className="mt-5 border max-w-[90vw] rounded-xl px-2 py-4">
          {serviceComponents.map(
            (service) =>
              selectedService === service.id && (
                <div key={service.id}>{service.conponent}</div>
              )
          )}
        </div>
        <Enticers />
      </div>
    </div>
  );
};

export default Menu;
