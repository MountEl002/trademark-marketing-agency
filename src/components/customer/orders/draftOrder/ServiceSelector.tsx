import React from "react";

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const services = [
  { id: "1", name: "Writing" },
  { id: "2", name: "Rewriting" },
  { id: "3", name: "Editing" },
  { id: "4", name: "Proofreading" },
];

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="p-4">
      <p className="order-form-field-title">Service</p>
      <div className="order-form-buttons">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onChange(service.name)}
            className={`py-2 px-3 w-fit rounded-lg text-sm transition-all duration-500 
              ${
                value === service.name
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-100"
                  : "bg-gray-200 text-gray-600 hover:text-blue-500"
              }`}
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
