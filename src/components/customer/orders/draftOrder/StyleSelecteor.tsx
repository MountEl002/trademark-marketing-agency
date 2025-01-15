import React from "react";

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const styles = [
  { id: "1", name: "APA 6th edition" },
  { id: "2", name: "APA 7th edition" },
  { id: "3", name: "ASA" },
  { id: "4", name: "Bluebook" },
  { id: "5", name: "Chicago/Turabian" },
  { id: "6", name: "Harvard" },
  { id: "7", name: "IEE" },
  { id: "8", name: "MLA" },
  { id: "9", name: "OSCOLA" },
  { id: "10", name: "Vancouver" },
  { id: "11", name: "Other" },
  { id: "12", name: "Not applicable" },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="p-4">
      <p className="order-form-field-title">Citation style</p>
      <div className="order-form-buttons">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.name)}
            className={`py-2 px-3 w-fit rounded-lg text-sm transition-all duration-500 
              ${
                value === style.name
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                  : "bg-gray-200 text-gray-600 hover:text-blue-500"
              }`}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
