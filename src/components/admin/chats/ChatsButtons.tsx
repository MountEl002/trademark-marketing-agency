import React from "react";
import { BsChatSquareTextFill } from "react-icons/bs";

interface ChatsButtonProps {
  name?: string;
  onClick?: () => void;
}

const ChatsButton: React.FC<ChatsButtonProps> = ({ name = "", onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="horizontal-start group gap-3 pr-5 min-[550px]:pr-10 bg-green-500 hover:bg-green-700 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500"
    >
      <div className="vertical  p-1 min-[550px]:p-2 left-1 m-[2px] bg-green-400 group-hover:bg-green-600 h-[90%] rounded transition-all duration-500">
        <BsChatSquareTextFill size={20} />
      </div>
      <span>{name || "Chats"}</span>
    </button>
  );
};

export default ChatsButton;
