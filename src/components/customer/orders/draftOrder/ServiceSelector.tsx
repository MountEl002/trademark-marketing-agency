import React from "react";

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
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
  className = "",
}) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onChange(service.name)}
            className={`px-4 py-2 rounded-md transition-all duration-300 
              ${
                value === service.name
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
