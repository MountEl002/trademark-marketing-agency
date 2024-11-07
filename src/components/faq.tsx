import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Who writes my essays?",
    answer:
      "At High-Quality Essay, we believe in matching you with the absolute best writer for your specific assignment. Unlike services where you choose from multiple writers, our expert team carefully selects the most qualified professional based on your subject matter and academic requirements. All our writers hold advanced degrees and undergo rigorous vetting to ensure exceptional quality. You can communicate directly with your assigned writer throughout the process at no additional cost.",
  },
  {
    id: 2,
    question: "How quickly can you complete my essay?",
    answer:
      "We pride ourselves on delivering high-quality work within your specified timeframe. When placing your order, simply indicate your desired deadline in the order form. We recommend allowing extra time for potential revisions to ensure complete satisfaction with the final product. Our experienced writers excel at meeting tight deadlines while maintaining superior quality. For urgent needs, we can complete single-page assignments in as little as 2 hours.",
  },
  {
    id: 3,
    question: "Do you provide original essays?",
    answer:
      "Absolutely. Our commitment to quality means every essay is written completely from scratch. Our experienced writers take pride in creating 100% original content tailored to your specific requirements. To ensure your complete confidence, we provide access to plagiarism detection software so you can verify the uniqueness of your essay. We stand firmly behind the originality of our work.",
  },
  {
    id: 4,
    question: "What is your pricing structure?",
    answer:
      "We believe in transparent, straightforward pricing. Our service charges a flat rate of $3 per page, making quality academic writing accessible to all students. This competitive rate covers all aspects of our service - there are no hidden fees or surcharges. We've simplified pricing to focus on what matters most: delivering exceptional quality at an affordable price.",
  },
  {
    id: 5,
    question: "Why should I trust your essay writing service?",
    answer:
      "High-Quality Essay has built its reputation on delivering superior academic writing at affordable prices. We offer several guarantees to ensure your confidence: free revisions until you're completely satisfied, a secure payment system, and 24/7 customer support. Rather than using a bidding system, we carefully match you with the most qualified writer for your subject matter. Our focus is on quality and reliability, providing you with the best possible academic support.",
  },
];

const FAQ = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqData.map((item) => (
          <div key={item.id} className="border rounded-lg shadow-sm">
            <button
              onClick={() => handleClick(item.id)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${
                activeId === item.id
                  ? "text-blue-500"
                  : "text-gray-700 hover:text-blue-400"
              }`}
            >
              <span className="font-medium">{item.question}</span>
              {activeId === item.id ? (
                <FaChevronUp className="flex-shrink-0 ml-2" />
              ) : (
                <FaChevronDown className="flex-shrink-0 ml-2" />
              )}
            </button>
            {activeId === item.id && (
              <div className="px-4 pb-4 text-gray-600 animate-fadeIn">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
