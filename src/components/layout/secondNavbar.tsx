import React from "react";
import LightLogo from "../common/lightLogo";
import UserAccessControl from "../common/login/userAccessControl";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const SecondNavbar = () => {
  const serviceItems = [
    { href: "/services/college-essay", label: "College Essay Writing" },
    { href: "/services/coursework", label: "Coursework Writing" },
    {
      href: "/services/research-paper",
      label: "Research Paper Writing",
    },
    { href: "/services/dissertation", label: "Dissertation Writing" },
    {
      href: "/services/college-paper",
      label: "College Paper Writing",
    },
    { href: "/services/case-study", label: "Case Study Writing" },
    { href: "/services/nursing-paper", label: "Nursing Paper Writing" },
    { href: "/services/scholarship-essay", label: "Scholarship Essay Writing" },
    {
      href: "/services/powerPoint-presentation",
      label: "PowerPoint Presentation",
    },
  ];

  const serviceItemscol2 = [
    {
      href: "/services/college-essay",
      label: "College Essay Writing",
    },
    {
      href: "/services/personal-statement",
      label: "Personal Statement Writing",
    },
    { href: "/services/term-paper", label: "Write my Term Paper" },
    {
      href: "/services/dissertation",
      label: "Write My Dissertation",
    },
    { href: "/services/research-paper", label: "Buy Research Paper" },
    { href: "/services/college-paper", label: "Buy Collage Essays" },
    { href: "/services/essay", label: "Essay For Sale" },
    { href: "/services/homework", label: "Do My Homework" },
    { href: "/services/urgent-paper", label: "Urgent Paper Writing" },
  ];

  const resourceItems = [
    { href: "/resources/free-papers", label: "Free Papers and Essays" },
    { href: "/resources/blog", label: "Blog" },
    {
      href: "/resources/writing-resources",
      label: "Writing Resources",
    },
  ];

  const offerItems = [
    { href: "/offers/get-discount", label: "Get Amazing Discouts" },
    { href: "/offers/referral-program", label: "Join Our Referral program" },
  ];

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-md">
      <div className="relative max-w-6xl mx-auto px-3">
        <div className="horizontal-space-between h-16">
          {/* Left section */}
          <LightLogo />
          {/* Middle Section */}
          <div className="hidden md:flex flex-row items-center justify-center; gap-2 xl:gap-3 2xl:gap-5 transition-all">
            {/* How to Order */}
            <Link
              href="/how-to-order"
              className="text-base text-gray-600 transition-all duration-500 hover:text-blue-500"
            >
              How to order
            </Link>
            {/* Services */}
            <Link href="/services" className="relative group transition-all">
              <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
                <span>Services</span>
                <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
              </p>
              {/* Services Dropdown Menu */}
              <div className="absolute w-[450px] top-12 hidden group-hover:block rounded-lg bg-white shadow-xl">
                <Link href="/services" className="">
                  <h3 className="transition-colors duration-300 hover:text-blue-500">
                    View All Our Writing Services
                  </h3>
                </Link>
                <div className="horizontal-start gap-2">
                  <div>
                    {serviceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm transition-colors duration-200 relative group"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div>
                    {serviceItemscol2.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm transition-colors duration-200 relative group"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            {/* Offers */}
            <Link href="#" className="relative group transition-all">
              <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
                <span>Offers</span>
                <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
              </p>
              {/* Offers Dropdown Menu */}
              <div className="absolute w-[200px] top-12 hidden group-hover:block rounded-lg bg-white shadow-xl">
                <div>
                  <div className="pt-2">
                    {offerItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 pb-2 text-sm transition-colors duration-200 relative group"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            {/* Prices */}
            <Link
              href="/prices"
              className="text-base text-gray-600 transition-all duration-500 hover:text-blue-500"
            >
              Prices
            </Link>
            {/* Reviews */}
            <Link
              href="/reviews"
              className="text-base text-gray-600 transition-all duration-500 hover:text-blue-500"
            >
              Reviews
            </Link>
            {/* Resources */}
            <Link
              href="/resources"
              className="relative hidden lg:inline-block group transition-all"
            >
              <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
                <span>Resources</span>
                <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
              </p>
              {/* Resources Dropdown Menu */}
              <div className="absolute w-[200px] top-12 hidden group-hover:block rounded-lg bg-white shadow-xl">
                <div>
                  <div className="pt-2">
                    {resourceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 pb-2 text-sm transition-colors duration-200 relative group"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* Right Section */}
          <UserAccessControl />
        </div>
      </div>
    </nav>
  );
};

export default SecondNavbar;
