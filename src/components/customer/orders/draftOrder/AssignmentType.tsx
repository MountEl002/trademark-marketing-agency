// components/common/AssignmentTypeSelector.tsx
import { useState, useEffect, useRef } from "react";

interface AssignmentOption {
  id: string;
  name: string;
  category: "Popular" | "Assignment";
}

interface AssignmentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

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
  { id: "7", name: "Admission essay", category: "Assignment" },
  { id: "8", name: "Analysis (any type)", category: "Assignment" },
  { id: "9", name: "Annotated bibliography", category: "Assignment" },
  { id: "10", name: "Article review", category: "Assignment" },
  { id: "11", name: "Thesis / Dissertation", category: "Assignment" },
];

const AssignmentTypeSelector: React.FC<AssignmentTypeSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle option selection
  const handleOptionSelect = (optionName: string) => {
    onChange(optionName);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm || value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Select assignment"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="z-50 mt-1 bg-white rounded-md shadow-lg h-[300px] w-[400px] overflow-y-auto">
          {Object.entries(groupedOptions).map(([category, options]) => (
            <div key={category} className="px-3 py-2">
              <div className="text-blue-500 text-sm font-medium underline mb-2">
                {category}
              </div>
              {options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(option.name)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md text-gray-700"
                >
                  {option.name}
                </div>
              ))}
            </div>
          ))}
          {Object.keys(groupedOptions).length === 0 && (
            <div className="px-3 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentTypeSelector;
