import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

interface TopicSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onContinue?: () => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  value,
  onChange,
  onContinue,
}) => {
  const [localTopic, setLocalTopic] = useState(value);
  const [inputBoxActive, setInputBoxActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFocus = () => {
    setInputBoxActive(true);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    onChange(localTopic);
    if (localTopic.length === 0) {
      setErrorMessage("Topic is required");
    }
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="vertical-start p-4">
      <p className="order-form-field-title">Assignment&apos;s topic or name</p>

      <div className="w-full mb-6">
        <label
          htmlFor="topic"
          className={`text-sm transition-all duration-1000 ${
            inputBoxActive ? "text-gray-400" : "text-white"
          }`}
        >
          Select or search your subject
        </label>
        <input
          id="topic"
          value={localTopic}
          onFocus={handleFocus}
          onBlur={() => setInputBoxActive(false)}
          onChange={(e) => setLocalTopic(e.target.value)}
          className={`w-full focus:outline-none p-3 mb-2 transition-all duration-500  rounded-lg box-border ${
            errorMessage
              ? "border border-red-500"
              : inputBoxActive
              ? "bg-gray-100 border border-blue-500"
              : "bg-gray-200"
          }`}
          placeholder={value || "Name your assignment"}
        />
        {errorMessage && !inputBoxActive && (
          <p className="animate-pulse text-red-600 text-sm">{errorMessage}</p>
        )}
      </div>

      {/* Save Button */}
      <div className="order-form-save-button">
        <button
          onClick={handleSubmit}
          className="group transition-all duration-500"
        >
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

export default TopicSelector;
