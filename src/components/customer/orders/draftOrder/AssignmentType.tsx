"use client";

import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

interface AssignmentOption {
  id: string;
  name: string;
  category: "Popular" | "Assignment" | "HomeWork" | "Questions" | "";
}

interface AssignmentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface PopularButtons {
  id: number;
  name: string;
}

const popularButtons: PopularButtons[] = [
  { id: 1, name: "Essay (any type)" },
  { id: 2, name: "Research paper" },
  { id: 3, name: "Discussion post" },
  { id: 4, name: "Homework (any type)" },
  { id: 5, name: "Case study" },
  { id: 6, name: "PowerPoint presentation with speaker notes" },
];

const assignmentOptions: AssignmentOption[] = [
  // Popular category
  { id: "1", name: "Essay (any type)", category: "Popular" },
  { id: "2", name: "Research paper", category: "Popular" },
  { id: "3", name: "Discussion post", category: "Popular" },
  {
    id: "4",
    name: "PowerPoint presentation with speaker notes",
    category: "Popular",
  },
  { id: "5", name: "Homework (any type)", category: "Popular" },
  { id: "6", name: "Case study", category: "Popular" },

  // Assignment category
  { id: "7", name: "Essay (any type)", category: "Assignment" },
  { id: "8", name: "Admission essay", category: "Assignment" },
  { id: "9", name: "Analyisis (any type)", category: "Assignment" },
  { id: "10", name: "Annotated bibliography", category: "Assignment" },
  { id: "11", name: "Article (written)", category: "Assignment" },
  { id: "12", name: "Book/movie review", category: "Assignment" },
  { id: "13", name: "Business plan", category: "Assignment" },
  { id: "14", name: "Business proposal", category: "Assignment" },
  { id: "15", name: "Case study", category: "Assignment" },
  { id: "16", name: "Coursework", category: "Assignment" },
  { id: "17", name: "Capstone project", category: "Assignment" },
  { id: "18", name: "Creative writing", category: "Assignment" },
  { id: "19", name: "Critical thinking", category: "Assignment" },
  { id: "20", name: "Discussion post", category: "Assignment" },
  { id: "21", name: "Lab report", category: "Assignment" },
  { id: "22", name: "Letter/Memos", category: "Assignment" },
  { id: "23", name: "Literature review", category: "Assignment" },
  { id: "24", name: "Outline", category: "Assignment" },
  { id: "25", name: "Personal narrative", category: "Assignment" },
  { id: "26", name: "Presentation or speech", category: "Assignment" },
  { id: "27", name: "Reaction paper", category: "Assignment" },
  { id: "28", name: "Reflective writing", category: "Assignment" },
  { id: "29", name: "Report", category: "Assignment" },
  { id: "30", name: "Research paper", category: "Assignment" },
  { id: "31", name: "Research proposal", category: "Assignment" },
  { id: "32", name: "Systematic review", category: "Assignment" },
  { id: "33", name: "Term paper", category: "Assignment" },
  { id: "34", name: "Thesis / Dissertation", category: "Assignment" },
  { id: "35", name: "PowerPoint presentation", category: "Assignment" },
  {
    id: "36",
    name: "PowerPoint presentaion with speaker notes",
    category: "Assignment",
  },

  // Homework category
  { id: "37", name: "Homework (any type)", category: "HomeWork" },
  { id: "38", name: "Biology", category: "HomeWork" },
  { id: "39", name: "Chemistry", category: "HomeWork" },
  { id: "40", name: "Engineering", category: "HomeWork" },
  { id: "41", name: "Geography", category: "HomeWork" },
  { id: "42", name: "Mathematics", category: "HomeWork" },
  { id: "43", name: "Physics", category: "HomeWork" },
  { id: "44", name: "Statistics", category: "HomeWork" },
  { id: "45", name: "Marketing", category: "HomeWork" },
  { id: "46", name: "Programming", category: "HomeWork" },
  { id: "47", name: "Excel", category: "HomeWork" },
  { id: "48", name: "Economics", category: "HomeWork" },
  { id: "49", name: "Accounting", category: "HomeWork" },

  // Questions category
  { id: "50", name: "Multiple choice questions", category: "Questions" },
  { id: "51", name: "Short answer questions", category: "Questions" },

  // Other category
  { id: "52", name: "Other", category: "" },
  { id: "53", name: "Let's Talk", category: "" },
];

const AssignmentTypeSelector: React.FC<AssignmentTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  // Filter options based on search term
  const filteredOptions = assignmentOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options by category
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, AssignmentOption[]>);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setDisplayValue(value); // Reset display value to selected value
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Handle option selection
  const handleOptionSelect = (optionName: string) => {
    onChange(optionName);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setDisplayValue(newValue);
    setIsOpen(true);
  };

  return (
    <div className="p-4">
      <div className="vertical-space-between mb-2">
        <p className="order-form-field-title">Assignment type</p>
        <p
          className={`text-sm transition-all duration-1000 ${
            isOpen ? "text-gray-400" : "text-white"
          }`}
        >
          Select or search assignment
        </p>
      </div>
      <div ref={containerRef} className="w-fit relative">
        <div
          onClick={() => setIsOpen(true)}
          className={`w-[324px] p-3 bg-gray-100 rounded-md transition-all duration-500 ${
            isOpen
              ? "horizontal-start gap-3 border border-blue-500"
              : "horizontal-space-between cursor-pointer"
          }`}
        >
          <IoSearch
            size={23}
            className={`text-gray-400 ${isOpen ? "block" : "hidden"}`}
          />
          <input
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={value || "Select assignment"}
            className="focus:outline-none bg-transparent w-[80%]"
          />
          <FaChevronDown
            size={20}
            className={`text-gray-400 ${isOpen ? "hidden" : "block"}`}
          />
        </div>
        {isOpen && (
          <div className="absolute z-[65] order-form-drop-down-cont">
            <div className="order-form-drop-down">
              {Object.entries(groupedOptions).map(([category, options]) => (
                <div key={category}>
                  <div className="category-name">{category}</div>
                  {options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleOptionSelect(option.name)}
                      className={`p-2 my-1 mx-2 cursor-pointer rounded-md text-gray-600 truncate transition-all duration-500 ${
                        value === option.name
                          ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              ))}
              {Object.keys(groupedOptions).length === 0 && (
                <div className="px-1 py-2 text-gray-500">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pupular Buttons */}
      <div className="mt-8">
        <p className="text-gray-500 text-sm">Popular:</p>
        <div className="container">
          <div className="order-form-buttons">
            {popularButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleOptionSelect(button.name)}
                className={`py-2 px-3 w-fit rounded-lg text-sm transition-all duration-500 ${
                  value === button.name
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                    : "bg-gray-200 text-gray-600 hover:text-blue-500"
                }`}
              >
                {button.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTypeSelector;
