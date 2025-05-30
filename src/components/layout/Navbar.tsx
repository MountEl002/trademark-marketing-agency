import Link from "next/link";
import LightLogo from "../common/LightLogo";
import { TbMenuDeep } from "react-icons/tb";
import MainNavbar from "../MainNavbar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MainNavbar isOpen={isOpen} onClose={closeNavbar} />
      <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-gray-50">
        <div className="relative max-w-6xl mx-auto px-3">
          <div className="horizontal-space-between h-16">
            {/* Left section */}
            <div
              className="vertical bg-white rounded-[50%] p-2 cursor-pointer hover:scale-110 transition-all duration-500"
              onClick={toggleNavbar}
            >
              <TbMenuDeep size={23} className="rotate-180" />
            </div>
            {/* Center section for admin */}
            <Link
              href={"/admin"}
              className={
                isAdmin
                  ? "flex items-center justify-center animate-bounce bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-white font-semibold transition-all duration-500"
                  : "hidden"
              }
            >
              Admin Dashboard
            </Link>
            {/* Right Section */}
            <div className="horizontal gap-2">
              <LightLogo />
              <Link href="/customer/upload-status">
                <div className="rounded-md border-2 border-green-500 hover:bg-green-500 hover:text-white transition-all duration-500 cursor-pointer px-4 py-1 text-sm font-semibold">
                  <p>Upload</p>
                  <p>Views</p>
                </div>
              </Link>
            </div>
            {/* Furthest right for mobile menu */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
