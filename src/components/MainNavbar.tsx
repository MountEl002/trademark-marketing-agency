import Link from "next/link";
import { IconType } from "react-icons";
import { RiHome6Line } from "react-icons/ri";
import { TfiWallet } from "react-icons/tfi";
import { BsWhatsapp } from "react-icons/bs";
import { LuDownload } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { BiMoneyWithdraw } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Logout from "./Logout";
import { WiSunrise } from "react-icons/wi";
import { GoLink } from "react-icons/go";
import { BiImageAdd } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { LuLayoutDashboard } from "react-icons/lu";

interface MainNavbarItem {
  itemIcon: IconType;
  name: string;
  linkTo: string;
}

interface MainNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavbarItems: MainNavbarItem[] = [
  {
    itemIcon: LuLayoutDashboard,
    name: "Dashboards",
    linkTo: "/customer/dashboards",
  },
  {
    itemIcon: TfiWallet,
    name: "Deposit Funds",
    linkTo: "/customer/deposit",
  },
  {
    itemIcon: RiHome6Line,
    name: "Packages",
    linkTo: "/customer/packages",
  },
  {
    itemIcon: MdOutlineWorkspacePremium,
    name: "Buy Premium Code",
    linkTo: "/customer/buy-premium-code",
  },
  {
    itemIcon: BiImageAdd,
    name: "Upload Status",
    linkTo: "/customer/upload-status",
  },
  {
    itemIcon: BsWhatsapp,
    name: "Whatsapp Records",
    linkTo: "/customer/whatsapp-records",
  },
  {
    itemIcon: LuDownload,
    name: "Download Product",
    linkTo: "/customer/download-product",
  },
  { itemIcon: CgProfile, name: "Profile", linkTo: "/customer/profile" },
  { itemIcon: BiMoneyWithdraw, name: "Withdraw", linkTo: "/customer/withdraw" },
  {
    itemIcon: WiSunrise,
    name: "Early Payment",
    linkTo: "/customer/early-payment",
  },
  {
    itemIcon: GoLink,
    name: "Referrals",
    linkTo: "/customer/referrals",
  },
];

const MainNavbar = ({ isOpen, onClose }: MainNavbarProps) => {
  const pathname = usePathname();
  const { username } = useAuth();

  return (
    <div
      className={
        isOpen
          ? "fixed top-0 left-0 right-0 bottom-0 z-[60] bg-black/50"
          : "hidden"
      }
    >
      <div className="relative bg-white w-fit pl-6 pr-28 h-[100vh] pb-6">
        <IoMdClose
          size={25}
          className="absolute top-3 right-3 cursor-pointer hover:scale-110 transition-all duration-500"
          onClick={onClose}
        />
        <div className="vertical-start gap-12 h-full">
          <div className="vertical-start gap-1 text-sm my-6">
            {mainNavbarItems.map((item) => (
              <Link
                key={item.name}
                href={item.linkTo}
                className={`relative group horizontal-start w-full gap-2 cursor-pointer transition-all duration-500 px-2 py-3
                } ${
                  pathname === item.linkTo
                    ? "text-green-500"
                    : "hover:text-green-500"
                }`}
              >
                <item.itemIcon size={20} />
                <p className="text-sm">{item.name}</p>
                <span
                  className={`absolute h-full w-[0.35rem] bg-green-500 -left-5 rounded-3xl ${
                    pathname === item.linkTo
                      ? "block"
                      : "hidden group-hover:block"
                  }`}
                ></span>
              </Link>
            ))}
          </div>
          <div className="vertical-start gap-6">
            <p>
              Username:{" "}
              <span className="text-blue-600 font-semibold">{username}</span>
            </p>
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
//
