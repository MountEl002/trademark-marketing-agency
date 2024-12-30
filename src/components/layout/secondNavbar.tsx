"use client";

import React, { useState } from "react";
import LightLogo from "../common/lightLogo";
import UserAccessControl from "../common/login/userAccessControl";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
  { href: "/offers/referral-program", label: "Join Our Referral Program" },
];

const SecondNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animationParent] = useAutoAnimate();

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-md">
      <div ref={animationParent} className="relative max-w-6xl mx-auto px-3">
        <div className="horizontal-space-between h-16">
          {/* Left section */}
          <LightLogo />
          {/* Middle Section */}
          <div className="hidden md:flex flex-row items-center justify-center h-full gap-2 xl:gap-3 2xl:gap-5 transition-all">
            {/* How to Order */}
            <Link
              href="/how-to-order"
              className="text-base text-gray-600 transition-all duration-500 hover:text-blue-500"
            >
              How to order
            </Link>
            {/* Services */}
            <Link
              href="#"
              className="relative vertical group transition-all h-full"
            >
              <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
                <span>Services</span>
                <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
              </p>
              {/* Services Dropdown Menu */}
              <div className="absolute w-[450px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
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
                        className="block px-4 py-2 text-sm transition-all duration-300 hover:text-blue-500"
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
                        className="block px-4 py-2 text-sm transition-all duration-300 hover:text-blue-500"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>

            {/* Offers */}
            <Link
              href="#"
              className="relative vertical group transition-all h-full"
            >
              <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
                <span>Offers</span>
                <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
              </p>
              {/* Offers Dropdown Menu */}
              <div className="absolute w-[200px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
                <div>
                  <div className="pt-2">
                    {offerItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 pb-2 text-sm py-2 transition-all duration-300 hover:text-blue-500"
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
              href="#"
              className="relative group transition-all h-full hidden lg:flex flex-col items-center justify-center"
            >
              <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
                <span>Resources</span>
                <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
              </p>
              {/* Resources Dropdown Menu */}
              <div className="absolute w-[200px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
                <div>
                  <div className="pt-2">
                    {resourceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 pb-2 text-sm py-2 transition-all duration-300 hover:text-blue-500"
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
          {/* Furthest right for mobile menu */}
          <div className="inline-block md:hidden">
            <IoMenu
              onClick={openMobileMenu}
              className="cursor-pointer text-4xl text-gray-600"
            />
          </div>
        </div>
        {mobileMenuOpen && <MobileNav closeMobileMenu={closeMobileMenu} />}
      </div>
    </nav>
  );
};

function MobileNav({ closeMobileMenu }: { closeMobileMenu: () => void }) {
  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
      <div className="h-full w-[70%] bg-gray-50 px-4 py-4">
        <div className="flex justify-end">
          <IoClose
            onClick={closeMobileMenu}
            className="cursor-pointer text-4xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-5 transition-all">
          {/*Mobile Menu --  How to Order */}
          <Link
            href="/how-to-order"
            className="text-base text-gray-600 transition-all duration-500 hover:text-blue-500"
          >
            How to order
          </Link>
          {/*Mobile Menu --  Services */}
          <Link href="" className="w-full group transition-all">
            <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
              <span>Services</span>
              <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
            </p>
            {/*Mobile Menu --  Services Dropdown Menu*/}
            <div className="w-full hidden group-hover:block transition-all duration-300 ease-in-out rounded-lg bg-white shadow-xl">
              <Link href="/services" className="">
                <h3 className="transition-all duration-300 hover:text-blue-500">
                  View All Our Writing Services
                </h3>
              </Link>
              <div className="horizontal w-full gap-2">
                <div>
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm transition-all duration-300 hover:text-blue-500"
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
                      className="block px-4 py-2 text-sm transition-all duration-300 hover:text-blue-500"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/*Mobile Menu --  Offers */}
          <Link href="#" className="w-full relative group transition-all">
            <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
              <span>Offers</span>
              <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
            </p>
            {/* Mobile Menu --  Offers Dropdown Menu */}
            <div className="w-full hidden group-hover:flex flex-col items-center justify-center gap-5 text-center transition-all duration-300 ease-in-out">
              <div>
                <div className="pt-2">
                  {offerItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 pb-2 text-base transition-all duration-300 hover:text-blue-500"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/*Mobile Menu --  Prices */}
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
          {/*Mobile Menu --  Resources */}
          <Link href="#" className="w-full relative group transition-all">
            <p className="horizontal gap-1 text-base text-gray-600 transition-all duration-500 group-hover:text-blue-500">
              <span>Resources</span>
              <FaChevronDown className="text-gray-600 transition-all duration-500 group-hover:text-blue-500 group-hover:rotate-180" />
            </p>
            {/*Mobile Menu -- Resources Dropdown Menu */}
            <div className="w-full hidden group-hover:flex flex-col items-center justify-center gap-5 text-center transition-all duration-300 ease-in-out">
              <div>
                <div className="pt-2">
                  {resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 pb-2 text-base transition-all duration-300 hover:text-blue-500"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SecondNavbar;
