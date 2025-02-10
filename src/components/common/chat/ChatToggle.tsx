import { usePathname } from "next/navigation";
import { SiGooglemessages } from "react-icons/si";

interface ChatToggleProps {
  onClick?: () => void;
}

const ChatToggle: React.FC<ChatToggleProps> = ({ onClick }) => {
  const pathname = usePathname();

  const className =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
      ? "fixed group z-[100] right-3 top-10"
      : "fixed group z-[100] right-3 top-1/2";

  return (
    <div className={className}>
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
