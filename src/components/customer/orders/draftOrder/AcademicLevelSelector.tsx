import React from "react";

interface AcademicLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const academicLevels = [
  { id: "1", name: "Middle School" },
  { id: "2", name: "High school" },
  { id: "3", name: "College" },
  { id: "4", name: "Bachelor's" },
  { id: "5", name: "Master's" },
  { id: "6", name: "Doctorate" },
];

const AcademicLevelSelector: React.FC<AcademicLevelSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {academicLevels.map((academicLevel) => (
          <button
            key={academicLevel.id}
            onClick={() => onChange(academicLevel.name)}
            className={`px-4 py-2 rounded-md transition-all duration-300 
              ${
                value === academicLevel.name
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {academicLevel.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AcademicLevelSelector;
