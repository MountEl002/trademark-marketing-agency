"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface FaqArray {
  id: number;
  question: string;
  answer: string;
}

// Update the props interface to use a generic type
interface FAQProps<T extends FaqArray> {
  faqArray: T[];
}

// Use a generic function component
function FAQ<T extends FaqArray>({ faqArray }: FAQProps<T>) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="w-full space-y-4">
      {faqArray.map((item) => (
        <div key={item.id} className="border rounded-lg shadow-sm">
          <button
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${
              activeId === item.id
                ? "text-blue-500"
                : "text-gray-700 hover:text-blue-400"
            }`}
          >
            <span className="text-2xl font-medium pr-8">{item.question}</span>
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
  );
}

export default FAQ;
