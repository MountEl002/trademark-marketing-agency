"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FAQItem } from "@/types/servicesPages";

interface FAQProps {
  faqArray: FAQItem[];
  serviceTitle: string;
}

const FAQ = ({ faqArray, serviceTitle }: FAQProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-blue-100">
      <div className="max-w-4xl mx-auto">
        <h2>Frequently asked questions about our {serviceTitle}:</h2>
        <div className="w-full space-y-4">
          {faqArray.map((item) => (
            <div
              key={item.id}
              className="border border-blue-300 hover:border-white rounded-lg shadow-sm transition-all duration-500"
            >
              <button
                onClick={() =>
                  setActiveId(activeId === item.id ? null : item.id)
                }
                className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${
                  activeId === item.id
                    ? "text-blue-700"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <span className="text-xl font-medium pr-8">
                  {item.question}
                </span>
                <FaChevronDown
                  className={`flex-shrink-0 ml-2 transform transition-transform duration-500 ease-in-out ${
                    activeId === item.id ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeId === item.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-4 text-gray-600">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
