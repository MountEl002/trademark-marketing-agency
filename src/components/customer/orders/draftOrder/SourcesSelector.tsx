"use client";

import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

interface SourcesOption {
  id: number;
  name: string;
  category: "Popular" | "All options";
}

interface SourcesSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface PopularButtons {
  id: number;
  name: string;
}

const popularButtons: PopularButtons[] = [
  { id: 0, name: "Not specified" },
  { id: 1, name: "1 source required" },
  { id: 2, name: "2 sources required" },
  { id: 3, name: "3 sources required" },
  { id: 4, name: "4 sources required" },
  { id: 5, name: "5 sources required" },
  { id: 6, name: "6 sources required" },
  { id: 7, name: "10 sources required" },
  { id: 8, name: "15 sources required" },
];

const sourcesOptions: SourcesOption[] = [
  // Popular category
  { id: 0, name: "Not specified", category: "Popular" },
  { id: 1, name: "1 source required", category: "Popular" },
  { id: 2, name: "2 sources required", category: "Popular" },
  { id: 3, name: "3 sources required", category: "Popular" },
  { id: 4, name: "4 sources required", category: "Popular" },
  { id: 5, name: "5 sources required", category: "Popular" },
  { id: 6, name: "6 sources required", category: "Popular" },
  { id: 7, name: "10 sources required", category: "Popular" },
  { id: 8, name: "15 sources required", category: "Popular" },

  // All options category
  { id: 0, name: "Not specified", category: "All options" },
  { id: 1, name: "1 source required", category: "All options" },
  { id: 2, name: "2 sources required", category: "All options" },
  { id: 3, name: "3 sources required", category: "All options" },
  { id: 4, name: "4 sources required", category: "All options" },
  { id: 5, name: "5 sources required", category: "All options" },
  { id: 6, name: "6 sources required", category: "All options" },
  { id: 7, name: "7 sources required", category: "All options" },
  { id: 8, name: "8 sources required", category: "All options" },
  { id: 9, name: "9 sources required", category: "All options" },
  { id: 10, name: "10 sources required", category: "All options" },
  { id: 11, name: "11 sources required", category: "All options" },
  { id: 12, name: "12 sources required", category: "All options" },
  { id: 13, name: "13 sources required", category: "All options" },
  { id: 14, name: "14 sources required", category: "All options" },
  { id: 15, name: "15 sources required", category: "All options" },
  { id: 16, name: "16 sources required", category: "All options" },
  { id: 17, name: "17 sources required", category: "All options" },
  { id: 18, name: "18 sources required", category: "All options" },
  { id: 19, name: "19 sources required", category: "All options" },
  { id: 20, name: "20 sources required", category: "All options" },
  { id: 21, name: "21 sources required", category: "All options" },
  { id: 22, name: "22 sources required", category: "All options" },
  { id: 23, name: "23 sources required", category: "All options" },
  { id: 24, name: "24 sources required", category: "All options" },
  { id: 25, name: "25 sources required", category: "All options" },
  { id: 26, name: "26 sources required", category: "All options" },
  { id: 27, name: "27 sources required", category: "All options" },
  { id: 28, name: "28 sources required", category: "All options" },
  { id: 29, name: "29 sources required", category: "All options" },
  { id: 30, name: "30 sources required", category: "All options" },
  { id: 31, name: "31 sources required", category: "All options" },
  { id: 32, name: "32 sources required", category: "All options" },
  { id: 33, name: "33 sources required", category: "All options" },
  { id: 34, name: "34 sources required", category: "All options" },
  { id: 35, name: "35 sources required", category: "All options" },
  { id: 36, name: "36 sources required", category: "All options" },
  { id: 37, name: "37 sources required", category: "All options" },
  { id: 38, name: "38 sources required", category: "All options" },
  { id: 39, name: "39 sources required", category: "All options" },
  { id: 40, name: "40 sources required", category: "All options" },
  { id: 41, name: "41 sources required", category: "All options" },
  { id: 42, name: "42 sources required", category: "All options" },
  { id: 43, name: "43 sources required", category: "All options" },
  { id: 44, name: "44 sources required", category: "All options" },
  { id: 45, name: "45 sources required", category: "All options" },
  { id: 46, name: "46 sources required", category: "All options" },
  { id: 47, name: "47 sources required", category: "All options" },
  { id: 48, name: "48 sources required", category: "All options" },
  { id: 49, name: "49 sources required", category: "All options" },
  { id: 50, name: "50 sources required", category: "All options" },
  { id: 51, name: "51 sources required", category: "All options" },
  { id: 52, name: "52 sources required", category: "All options" },
  { id: 53, name: "53 sources required", category: "All options" },
  { id: 54, name: "54 sources required", category: "All options" },
  { id: 55, name: "55 sources required", category: "All options" },
  { id: 56, name: "56 sources required", category: "All options" },
  { id: 57, name: "57 sources required", category: "All options" },
  { id: 58, name: "58 sources required", category: "All options" },
  { id: 59, name: "59 sources required", category: "All options" },
  { id: 60, name: "60 sources required", category: "All options" },
  { id: 61, name: "61 sources required", category: "All options" },
  { id: 62, name: "62 sources required", category: "All options" },
  { id: 63, name: "63 sources required", category: "All options" },
  { id: 64, name: "64 sources required", category: "All options" },
  { id: 65, name: "65 sources required", category: "All options" },
  { id: 66, name: "66 sources required", category: "All options" },
  { id: 67, name: "67 sources required", category: "All options" },
  { id: 68, name: "68 sources required", category: "All options" },
  { id: 69, name: "69 sources required", category: "All options" },
  { id: 70, name: "70 sources required", category: "All options" },
  { id: 71, name: "71 sources required", category: "All options" },
  { id: 72, name: "72 sources required", category: "All options" },
  { id: 73, name: "73 sources required", category: "All options" },
  { id: 74, name: "74 sources required", category: "All options" },
  { id: 75, name: "75 sources required", category: "All options" },
  { id: 76, name: "76 sources required", category: "All options" },
  { id: 77, name: "77 sources required", category: "All options" },
  { id: 78, name: "78 sources required", category: "All options" },
  { id: 79, name: "79 sources required", category: "All options" },
  { id: 80, name: "80 sources required", category: "All options" },
  { id: 81, name: "81 sources required", category: "All options" },
  { id: 82, name: "82 sources required", category: "All options" },
  { id: 83, name: "83 sources required", category: "All options" },
  { id: 84, name: "84 sources required", category: "All options" },
  { id: 85, name: "85 sources required", category: "All options" },
  { id: 86, name: "86 sources required", category: "All options" },
  { id: 87, name: "87 sources required", category: "All options" },
  { id: 88, name: "88 sources required", category: "All options" },
  { id: 89, name: "89 sources required", category: "All options" },
  { id: 90, name: "90 sources required", category: "All options" },
  { id: 91, name: "91 sources required", category: "All options" },
  { id: 92, name: "92 sources required", category: "All options" },
  { id: 93, name: "93 sources required", category: "All options" },
  { id: 94, name: "94 sources required", category: "All options" },
  { id: 95, name: "95 sources required", category: "All options" },
  { id: 96, name: "96 sources required", category: "All options" },
  { id: 97, name: "97 sources required", category: "All options" },
  { id: 98, name: "98 sources required", category: "All options" },
  { id: 99, name: "99 sources required", category: "All options" },
  { id: 100, name: "100 sources required", category: "All options" },
];

const SourcesSelector: React.FC<SourcesSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = sourcesOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options by category
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, SourcesOption[]>);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (!value) {
          setSearchTerm("");
        }
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
    if (newValue !== value) {
      onChange(""); // Clear the selected value when user starts typing something new
    }
    setIsOpen(true);
  };

  return (
    <div className="p-4">
      <div className="vertical-space-between mb-2">
        <p className="order-form-field-title">Number of sources required</p>
        <p
          className={`text-sm transition-all duration-1000 ${
            isOpen ? "text-gray-400" : "text-white"
          }`}
        >
          Select or search number of sources
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
            value={isOpen ? searchTerm : value}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={value || "Number of sources required"}
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

export default SourcesSelector;
