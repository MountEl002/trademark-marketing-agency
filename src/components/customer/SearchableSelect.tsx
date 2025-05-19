import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  required,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative text-gray-800" ref={dropdownRef}>
      <div
        className="w-full p-2 border border-gray-300 rounded flex justify-between items-center cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <FaChevronDown
          className={`h-4 w-4 text-gray-500 transform transition-transform duration-500 ease-in-out ${
            isOpen === true ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <IoSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {option === value && (
                  <CiCircleCheck className="h-4 w-4 text-blue-500 mr-2" />
                )}
                <span className={option === value ? "text-blue-500" : ""}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {required && (
        <input
          type="text"
          tabIndex={-1}
          className="opacity-0 h-0 w-0 absolute"
          value={value}
          required
        />
      )}
    </div>
  );
}
