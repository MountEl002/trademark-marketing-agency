import React from "react";
import { MdOutlineDelete } from "react-icons/md";

interface CloseButtonProps {
  name?: string;
  onClick?: () => void;
}

const DiscardButton: React.FC<CloseButtonProps> = ({ name = "", onClick }) => {
  // If href is provided, render as a Link, otherwise render as a button
  return (
    <button
      type="button"
      onClick={onClick}
      className="horizontal-start group gap-3 pr-5 min-[550px]:pr-10 bg-red-500 hover:bg-red-700 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500"
    >
      <div className="vertical p-1 min-[550px]:p-2 left-1 m-[2px] bg-red-400 group-hover:bg-red-600 h-[90%] rounded transition-all duration-500">
        <MdOutlineDelete size={20} />
      </div>
      <span>{name || "Discard"}</span>
    </button>
  );
};

export default DiscardButton;
