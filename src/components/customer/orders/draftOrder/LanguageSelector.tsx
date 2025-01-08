import React from "react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const languages = [
  { id: "1", name: "English (US)" },
  { id: "2", name: "English (UK)" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => onChange(language.name)}
            className={`px-4 py-2 rounded-md transition-all duration-300 
              ${
                value === language.name
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {language.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
