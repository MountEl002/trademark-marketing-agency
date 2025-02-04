import React from "react";
import { IoClose } from "react-icons/io5";

interface CloseButtonProps {
  name?: string;
  onClick?: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ name = "", onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="horizontal-start group gap-3 pr-5 min-[550px]:pr-10 bg-blue-500 hover:bg-blue-700 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500"
    >
      <div className="vertical  p-1 min-[550px]:p-2 left-1 m-[2px] bg-blue-400 group-hover:bg-blue-600 h-[90%] rounded transition-all duration-500">
        <IoClose size={20} />
      </div>
      <span>{name || "Close"}</span>
    </button>
  );
};

export default CloseButton;
