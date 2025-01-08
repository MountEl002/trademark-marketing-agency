import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

interface AddOnsSelectorProps {
  value: string;
  onChange: (value: string, totalPrice: number) => void;
  onContinue: () => void;
  className?: string;
}

const addOns = [
  { id: "1", name: "1-Page abstract", price: 12.99 },
  { id: "2", name: "Graphics & tables", price: 8.99 },
  { id: "3", name: "Printable sources", price: 6.99 },
  { id: "4", name: "Detailed outline", price: 9.99 },
  { id: "5", name: "Plagiarism & AI report", price: 0 },
];

const AddOnsSelector: React.FC<AddOnsSelectorProps> = ({
  value,
  onChange,
  onContinue,
  className = "",
}) => {
  // Initialize local state with current value
  const [localSelectedAddOns, setLocalSelectedAddOns] = useState<string[]>(
    value ? value.split(",").map((item) => item.trim()) : []
  );

  const handleCheckboxChange = (addOnName: string) => {
    setLocalSelectedAddOns((prev) => {
      if (prev.includes(addOnName)) {
        return prev.filter((name) => name !== addOnName);
      } else {
        return [...prev, addOnName];
      }
    });
  };

  const handleContinue = () => {
    // Calculate total price
    const totalPrice = localSelectedAddOns.reduce((sum, name) => {
      const addOn = addOns.find((item) => item.name === name);
      return sum + (addOn?.price || 0);
    }, 0);

    // Update parent component
    onChange(localSelectedAddOns.join(", "), totalPrice);
    onContinue();
  };

  const calculateTotalPrice = () => {
    return localSelectedAddOns.reduce((sum, name) => {
      const addOn = addOns.find((item) => item.name === name);
      return sum + (addOn?.price || 0);
    }, 0);
  };

  return (
    <div className={`vertical-start gap-4 ${className}`}>
      <div className="flex flex-col gap-3 w-full">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`addon-${addOn.id}`}
                checked={localSelectedAddOns.includes(addOn.name)}
                onChange={() => handleCheckboxChange(addOn.name)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`addon-${addOn.id}`}
                className="text-gray-900 font-medium cursor-pointer"
              >
                {addOn.name}
              </label>
            </div>
            <span
              className={`font-medium ${
                addOn.price === 0 ? "text-green-600" : "text-gray-900"
              }`}
            >
              {addOn.price === 0 ? "FREE" : `$${addOn.price.toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>

      {localSelectedAddOns.length > 0 && (
        <div className="w-full p-3 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end">
        <button
          onClick={handleContinue}
          className="relative group horizontal px-8 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-500"
        >
          <span className="text-white text-sm mr-6">Continue</span>
          <IoChevronDown className="absolute right-1 text-xl text-white rounded-sm transition-all duration-500 bg-blue-500 group-hover:bg-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default AddOnsSelector;
