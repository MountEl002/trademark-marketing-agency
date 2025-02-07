import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";

interface CHatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<CHatInputProps> = ({
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="horizontal-start w-full h-20 bg-gray-100 p-1">
      <div className="w-[90%] h-full border border-blue-500 rounded-lg p-1">
        <textarea
          name="message"
          id="message"
          placeholder="Type your message..."
          value={newMessage}
          onKeyDown={handleKeyPress}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full h-full p-2 bg-transparent outline-none resize-none chat-scrollbars text-sm whitespace-normal overflow-x-auto"
        />
      </div>
      <div className="vertical gap-1 w-[10%] h-full bg-transparent">
        <div className="group bg-transparent hover:bg-blue-600 rounded-[50%] transition-all duration-500 p-2">
          <GrAttachment className="text-blue-600 group-hover:text-white transition-all duration-500" />
        </div>
        <button
          onClick={sendMessage}
          className="group bg-transparent hover:bg-blue-600 rounded-[50%] transition-all duration-500 p-2"
        >
          <IoSend className="text-blue-600 group-hover:text-white transition-all duration-500" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
