import {
  ButtonColor,
  colorClasses,
  CommonRoute,
  iconColorClasses,
} from "@/lib/constants";
import Link from "next/link";
import { IconType } from "react-icons";

interface UniversalLinkProps {
  icon: IconType;
  iconSize?: number;
  text: string;
  href: CommonRoute | string;
  buttonClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  toolTipMessage?: string;
  color?: ButtonColor;
}

export default function UniversalLink({
  icon: Icon,
  iconSize = 20,
  text,
  buttonClassName = "",
  iconClassName = "",
  toolTipMessage,
  color = "blue",
  href,
}: UniversalLinkProps) {
  return (
    <Link
      href={href}
      title={toolTipMessage}
      className={`horizontal-start group gap-3 pr-5 min-[550px]:pr-10 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500 w-fit ${colorClasses[color]} ${buttonClassName}`}
    >
      <div
        className={`vertical p-1 min-[550px]:p-2 left-1 m-[2px] h-[90%] rounded transition-all duration-500 ${iconColorClasses[color]} ${iconClassName}`}
      >
        <Icon size={iconSize} />
      </div>
      <span className="truncate">{text}</span>
    </Link>
  );
}
