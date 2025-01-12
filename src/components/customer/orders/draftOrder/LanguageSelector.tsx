import React from "react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const languages = [
  { id: "1", name: "English (US)" },
  { id: "2", name: "English (UK)" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="p-4">
      <p className="order-form-field-title">Language</p>
      <div className="order-form-buttons">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => onChange(language.name)}
            className={`py-2 px-3 w-fit rounded-lg text-sm transition-all duration-500 
              ${
                value === language.name
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                  : "bg-gray-200 text-gray-600 hover:text-blue-500"
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
