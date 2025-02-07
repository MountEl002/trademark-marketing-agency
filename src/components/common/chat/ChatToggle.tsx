import React from "react";
import { SiGooglemessages } from "react-icons/si";

interface ChatToggleProps {
  onClick?: () => void;
}

const ChatToggle: React.FC<ChatToggleProps> = ({ onClick }) => {
  return (
    <div className="fixed group z-[100] top-1/2 right-3">
      <button
        type="button"
        onClick={onClick}
        className="vertical rounded-[50%] bg-white p-1 shadow-xl"
      >
        <SiGooglemessages
          size={40}
          className="text-blue-600 group-hover:scale-125 transition-all duration-500"
        />
      </button>
    </div>
  );
};

export default ChatToggle;
