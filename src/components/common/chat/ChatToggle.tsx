import { usePathname } from "next/navigation";
import { SiGooglemessages } from "react-icons/si";

interface ChatToggleProps {
  onClick?: () => void;
  unreadCount?: number;
}

const ChatToggle: React.FC<ChatToggleProps> = ({ onClick, unreadCount }) => {
  const pathname = usePathname();

  // Determine class based on pathname
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
        className="relative vertical rounded-[50%] bg-white p-1 shadow-xl"
      >
        <SiGooglemessages
          size={40}
          className="text-blue-600 group-hover:scale-125 transition-all duration-500"
        />
        {unreadCount && unreadCount > 0 ? (
          <span
            className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 
                       bg-red-600 text-white text-xs font-semibold 
                       rounded-full h-5 w-5 min-w-[1.25rem] flex items-center justify-center
                       border-2 border-white"
            style={{ lineHeight: "1" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>
    </div>
  );
};

export default ChatToggle;
