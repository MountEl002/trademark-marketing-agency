import Link from "next/link";
import { IconType } from "react-icons";
import { RiHome6Line } from "react-icons/ri";
import { TfiWallet } from "react-icons/tfi";
import { BsWhatsapp } from "react-icons/bs";
import { LuDownload } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { BiMoneyWithdraw } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

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
  { itemIcon: RiHome6Line, name: "Dashboards", linkTo: "/" },
  { itemIcon: TfiWallet, name: "Deposit Funds", linkTo: "deposit-funds" },
  {
    itemIcon: RiHome6Line,
    name: "Activate Account",
    linkTo: "activate-account",
  },
  { itemIcon: BsWhatsapp, name: "Whatsapp", linkTo: "whatsapp" },
  {
    itemIcon: LuDownload,
    name: "Download Product",
    linkTo: "download-product",
  },
  { itemIcon: CgProfile, name: "Profile", linkTo: "profile" },
  { itemIcon: BiMoneyWithdraw, name: "Withdraw", linkTo: "withdraw" },
];

const MainNavbar = ({ isOpen, onClose }: MainNavbarProps) => {
  return (
    <div
      className={
        isOpen
          ? "fixed top-0 left-0 right-0 bottom-0 z-[60] bg-black/50"
          : "hidden"
      }
    >
      <div className="relative bg-white w-fit pl-6 pr-28 min-h-screen">
        <IoMdClose
          size={25}
          className="absolute top-3 right-3 cursor-pointer hover:scale-110 transition-all duration-500"
          onClick={onClose}
        />
        <p className="text-xs">MAIN MENU</p>
        <div className="vertical-start gap-1 text-sm my-6">
          {mainNavbarItems.map((item) => (
            <Link
              key={item.name}
              href={item.linkTo}
              className="relative  group horizontal-start w-full gap-2 cursor-pointer hover:text-green-500 transition-all duration-500 px-2 py-3"
            >
              <item.itemIcon size={20} />
              <p className="text-sm">{item.name}</p>
              <span className="absolute hidden group-hover:block h-full w-[0.35rem] bg-green-500 -left-5 rounded-3xl"></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
//
