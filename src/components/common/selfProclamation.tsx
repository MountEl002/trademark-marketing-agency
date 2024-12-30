"use client";

import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import WriteMyPaper from "./order/writeMyPaper";

type TabContent = {
  [key: string]: {
    items: string[];
  };
};

const SelfProclamation = () => {
  const [activeTab, setActiveTab] = useState("Paperwork");

  const tabs = ["Paperwork", "Coursework / homework", "Other assignments"];

  const tabContent: TabContent = {
    Paperwork: {
      items: [
        "Essay",
        "Case study",
        "Report",
        "Research paper",
        "Presentation or speech",
        "Annotated bibliography",
        "Article review",
        "Literature review",
        "Business plan",
        "Research proposal",
        "Book / movie review",
        "Editing and proofreading",
        "Reflective writing",
        "Thesis / dissertation",
        "Admission essay",
        "Creative writing",
        "Critical thinking / review",
        "Book review",
        "Term paper",
        "Other",
      ],
    },
    "Coursework / homework": {
      items: [
        "Homework",
        "Statistics",
        "Physics",
        "Engineering",
        "Biology",
        "Chemistry",
        "Math",
        "Geography",
        "Law",
        "Other",
      ],
    },
    "Other assignments": {
      items: [
        "Multiple choice questions",
        "Short answer questions",
        "Word problems",
      ],
    },
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto mt-10">
        <div className="mb-6  max-w-full md:max-w-[40%] text-center md:text-start vertical md:items-start">
          <h2>Your #1 paper writing service</h2>
          <p className="text-gray-600 mb-6">
            Our expert essay writers can tackle any academic task you entrust
            them with. Here are some of the services we offer:
          </p>
          <WriteMyPaper />
        </div>

        <div>
          <div className="flex border-b border-gray-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px hover:text-blue-500 transition-colors ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                } text-sm font-semibold`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 min-[1050px]:grid-cols-3 gap-4 text-sm">
            {tabContent[activeTab].items.map((item) => (
              <div
                key={item}
                className="horizontal !justify-start text-gray-600 gap-2"
              >
                <GoDotFill /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfProclamation;
