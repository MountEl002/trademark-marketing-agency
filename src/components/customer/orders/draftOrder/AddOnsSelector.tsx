import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

interface AddOnsSelectorProps {
  value: string;
  onChange: (value: string, totalPrice: number) => void;
  onContinue: () => void;
}

const addOns = [
  { id: "1", name: "1-Page abstract", price: 3.3 },
  { id: "2", name: "Graphics & tables", price: 2.3 },
  { id: "3", name: "Printable sources", price: 2.0 },
  { id: "4", name: "Detailed outline", price: 2.5 },
  { id: "5", name: "Plagiarism & AI report", price: 0 },
];

const mandatoryAddOns = [
  { id: "1", name: "Unlimited revisions", price: 0 },
  { id: "2", name: "Unlimited sources", price: 0 },
  { id: "3", name: "Title page and formatting", price: 0 },
  { id: "4", name: "Unlimited progress updates", price: 0 },
  { id: "5", name: "Premium service", price: 0 },
];

const AddOnsSelector: React.FC<AddOnsSelectorProps> = ({
  value,
  onChange,
  onContinue,
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
    <div className="vertical-start p-4">
      <p className="order-form-field-title">Add-ons</p>

      {/* Add-ons options */}
      <div className="flex flex-col sm:flex-row items-center justify-start gap-3 my-6 w-full text-sm">
        {/* Optional Add-ons */}
        <div className="vertical gap-1 p-1 bg-gray-200 rounded-lg w-full">
          {addOns.map((addOn) => (
            <div
              key={addOn.id}
              className="horizontal-space-between w-full hover:bg-gray-100 px-3 rounded-lg transition-all duration-500"
            >
              <div className="horizontal w-full">
                <input
                  type="checkbox"
                  id={`addon-${addOn.id}`}
                  checked={localSelectedAddOns.includes(addOn.name)}
                  onChange={() => handleCheckboxChange(addOn.name)}
                  className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={`addon-${addOn.id}`}
                  className="text-gray-500 cursor-pointer pl-3 py-3 w-full"
                >
                  {addOn.name}
                </label>
              </div>
              <span
                className={`font-medium ${
                  addOn.price === 0 ? "text-green-600" : "text-gray-600"
                }`}
              >
                {addOn.price === 0 ? "FREE" : `$${addOn.price.toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>

        {/* Mandatory Add-ons */}
        <div className="vertical gap-1 p-1 bg-gray-200 rounded-lg w-full">
          {mandatoryAddOns.map((addOn) => (
            <div
              key={addOn.id}
              className="horizontal-space-between w-full p-3 rounded-lg"
            >
              <p className="text-gray-500 cursor-pointer">{addOn.name}</p>
              <p className="font-medium text-green-600">FREE</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total price of selected add-ons  */}
      {localSelectedAddOns.length > 0 && (
        <div className="w-full p-3 bg-gray-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="order-form-save-button mt-6">
        <button onClick={handleContinue} className="group">
          Save
          <IoChevronDown
            size={30}
            className="chev-icon group-hover:bg-blue-500"
          />
        </button>
      </div>
    </div>
  );
};

export default AddOnsSelector;
