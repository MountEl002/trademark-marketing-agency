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

  const handleSubmit = () => {
    onChange(localTopic);
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="vertical-start gap-4">
      <div className="w-full">
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your topic
        </label>
        <textarea
          id="topic"
          value={localTopic}
          onChange={(e) => setLocalTopic(e.target.value)}
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the topic of your assignment..."
        />
      </div>

      <div className="w-full flex justify-end">
        <button
          onClick={handleSubmit}
          className="relative group horizontal px-8 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-all duration-500"
        >
          <span className="text-white text-sm mr-6">Continue</span>
          <IoChevronDown className="absolute right-1 text-xl text-white rounded-sm transition-all duration-500 bg-blue-500 group-hover:bg-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;
