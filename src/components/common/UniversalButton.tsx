import { IconType } from "react-icons";

interface ButtonProps {
  icon: IconType;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonClassName: string;
  iconClassName: string;
  disabled?: boolean;
}

const UniversalButton: React.FC<ButtonProps> = ({
  icon: Icon,
  text,
  onClick,
  buttonClassName = "",
  iconClassName = "",
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`horizontal-start group gap-3 pr-5 min-[550px]:pr-10 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500 ${buttonClassName}`}
    >
      <div
        className={`vertical p-1 min-[550px]:p-2 left-1 m-[2px] h-[90%] rounded transition-all duration-500 ${iconClassName}`}
      >
        <Icon size={20} />
      </div>
      <span className="truncate">{text}</span>
    </button>
  );
};

export default UniversalButton;
