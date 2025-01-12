import React from "react";

interface AcademicLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const academicLevels = [
  { id: "1", name: "Middle School" },
  { id: "2", name: "High school" },
  { id: "3", name: "College" },
  { id: "4", name: "Bachelor's" },
  { id: "5", name: "Master's" },
  { id: "6", name: "PhD" },
];

const AcademicLevelSelector: React.FC<AcademicLevelSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="p-4">
      <p className="order-form-field-title">Academic Level</p>
      <div className="order-form-buttons">
        {academicLevels.map((academicLevel) => (
          <button
            key={academicLevel.id}
            onClick={() => onChange(academicLevel.name)}
            className={`py-2 px-3 w-fit rounded-lg text-sm transition-all duration-500 
              ${
                value === academicLevel.name
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                  : "bg-gray-200 text-gray-600 hover:text-blue-500"
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
