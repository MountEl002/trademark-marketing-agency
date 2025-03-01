import Link from "next/link";
import { IconType } from "react-icons";

interface UniversalLinkProps {
  icon: IconType;
  text: string;
  href: string;
  linkClassName: string;
  iconClassName: string;
}

const UniversalLink: React.FC<UniversalLinkProps> = ({
  icon: Icon,
  text,
  href,
  linkClassName = "",
  iconClassName = "",
}) => {
  return (
    <Link
      href={href}
      className={`horizontal-start w-fit group gap-3 pr-5 min-[550px]:pr-10 text-sm min-[550px]:text-base text-white font-semibold rounded-md transition-all duration-500 ${linkClassName}`}
    >
      <div
        className={`vertical p-1 min-[550px]:p-2 left-1 m-[2px] h-[90%] rounded transition-all duration-500 ${iconClassName}`}
      >
        <Icon size={20} />
      </div>
      <span className="truncate">{text}</span>
    </Link>
  );
};

export default UniversalLink;
