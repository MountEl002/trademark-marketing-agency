"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import LightLogo from "../common/LightLogo";
import UserAccessControl from "../common/login/UserAccessControl";
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
    href: "/services/capstone-project",
    label: "Capstone Project Writing",
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
  { href: "/resources/essay-writing-tools", label: "Essay Writing Tools" },
];

const offerItems = [
  { href: "/discounts", label: "Get Amazing Discouts" },
  { href: "/referral-program", label: "Join Our Referral Program" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(true);
  const [offersMenuOpen, setOffersMenuOpen] = useState(true);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(true);
  const [animationParent] = useAutoAnimate();
  const pathname = usePathname();

  const closeServicesMenu = () => {
    setServicesMenuOpen(false);

    setTimeout(() => {
      setServicesMenuOpen(true);
    }, 1000);
  };

  const closeOffersMenu = () => {
    setOffersMenuOpen(false);

    setTimeout(() => {
      setOffersMenuOpen(true);
    }, 1000);
  };

  const closeResourcesMenu = () => {
    setResourcesMenuOpen(false);

    setTimeout(() => {
      setResourcesMenuOpen(true);
    }, 1000);
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const howToOrderLinkStyles = `text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname === "/how-to-order"
      ? "font-semibold text-blue-700 hover:text-blue-900"
      : "text-gray-600 hover:text-blue-500"
  }`;

  const pricesLinkStyles = `text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname === "/prices"
      ? "font-semibold text-blue-700 hover:text-blue-900"
      : "text-gray-600 hover:text-blue-500"
  }`;

  const reviewsLinkStyles = `text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname === "/reviews"
      ? "font-semibold text-blue-700 hover:text-blue-900"
      : "text-gray-600 hover:text-blue-500"
  }`;

  const servicesLinkStyles = `horizontal gap-1 text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname.startsWith("/services")
      ? "font-semibold text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const offersLinkStyles = `horizontal gap-1 text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname.startsWith("/discounts") ||
    pathname.startsWith("/referral-program")
      ? "font-semibold text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const resourcesLinkStyles = `horizontal gap-1 text-sm min-[810px]:text-base transition-all duration-500 ${
    pathname.startsWith("/resources")
      ? "font-semibold text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const servicesChevronLinkStyles = `transition-all duration-500 group-hover:rotate-180 ${
    pathname.startsWith("/service")
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const offersChevronLinkStyles = `transition-all duration-500 group-hover:rotate-180 ${
    pathname.startsWith("/discounts") ||
    pathname.startsWith("/referral-program")
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const resourcesChevronLinkStyles = `transition-all duration-500 group-hover:rotate-180 ${
    pathname.startsWith("/resources")
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-md">
      <div ref={animationParent} className="relative max-w-6xl mx-auto px-3">
        <div className="horizontal-space-between h-16">
          {/* Left section */}
          <LightLogo />
          {/* Middle Section */}
          <div className="hidden md:flex flex-row items-center justify-center h-full gap-2 xl:gap-3 2xl:gap-5 transition-all">
            {/* How to Order */}
            <Link href="/how-to-order" className={howToOrderLinkStyles}>
              How to order
            </Link>
            {/* Services */}
            <div className="relative vertical group transition-all h-full cursor-pointer">
              <p className={servicesLinkStyles}>
                <span>Services</span>
                <FaChevronDown className={servicesChevronLinkStyles} />
              </p>
              {/* Services Dropdown Menu */}
              {servicesMenuOpen && (
                <div className="absolute w-[450px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
                  <Link
                    onClick={closeServicesMenu}
                    href="/services"
                    className={servicesLinkStyles}
                  >
                    <h3>View All Our Writing Services</h3>
                  </Link>
                  <div className="horizontal-start gap-2">
                    <div>
                      {serviceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeServicesMenu}
                          className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                            pathname === item.href
                              ? "font-semibold text-blue-700 hover:text-blue-900"
                              : "text-gray-600 hover:text-blue-500"
                          }`}
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
                          onClick={closeServicesMenu}
                          className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                            pathname === item.href
                              ? "font-semibold text-blue-700 hover:text-blue-900"
                              : "text-gray-600 hover:text-blue-500"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Offers */}
            <div className="relative vertical group transition-all h-full cursor-pointer">
              <p className={offersLinkStyles}>
                <span>Offers</span>
                <FaChevronDown className={offersChevronLinkStyles} />
              </p>
              {/* Offers Dropdown Menu */}
              {offersMenuOpen && (
                <div className="absolute w-[200px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
                  <div>
                    <div className="pt-2">
                      {offerItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeOffersMenu}
                          className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                            pathname === item.href
                              ? "font-semibold text-blue-700 hover:text-blue-900"
                              : "text-gray-600 hover:text-blue-500"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prices */}
            <Link href="/prices" className={pricesLinkStyles}>
              Prices
            </Link>
            {/* Reviews */}
            <Link href="/reviews" className={reviewsLinkStyles}>
              Reviews
            </Link>
            {/* Resources */}
            <div className="relative group transition-all h-full hidden lg:flex flex-col items-center justify-center cursor-pointer">
              <p className={resourcesLinkStyles}>
                <span>Resources</span>
                <FaChevronDown className={resourcesChevronLinkStyles} />
              </p>
              {/* Resources Dropdown Menu */}
              {resourcesMenuOpen && (
                <div className="absolute w-[200px] top-16 hidden group-hover:block rounded-lg bg-white shadow-xl">
                  <div>
                    <div className="pt-2">
                      {resourceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeResourcesMenu}
                          className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                            pathname === item.href
                              ? "font-semibold text-blue-700 hover:text-blue-900"
                              : "text-gray-600 hover:text-blue-500"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
  const pathname = usePathname();

  const howToOrderLinkStyles = `text-base transition-all duration-500 ${
    pathname === "/how-to-order"
      ? "font-semibold text-blue-700 hover:text-blue-900"
      : "text-gray-600 hover:text-blue-500"
  }`;

  const pricesLinkStyles = `text-base transition-all duration-500 ${
    pathname === "/prices"
      ? "font-semibold text-blue-700 hover:text-blue-900"
      : "text-gray-600 hover:text-blue-500"
  }`;

  const reviewsLinkStyles = `text-base transition-all duration-500 ${
    pathname === "/reviews"
      ? "font-semibold text-blue-700 hover:text-blue-900"
      : "text-gray-600 hover:text-blue-500"
  }`;

  const servicesLinkStyles = `horizontal gap-1 text-base transition-all duration-500 ${
    pathname.startsWith("/services")
      ? "font-semibold text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const offersLinkStyles = `horizontal gap-1 text-base transition-all duration-500 ${
    pathname.startsWith("/discounts") ||
    pathname.startsWith("/referral-program")
      ? "font-semibold text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const resourcesLinkStyles = `horizontal gap-1 text-base transition-all duration-500 ${
    pathname.startsWith("/resources")
      ? "font-semibold text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const servicesChevronLinkStyles = `transition-all duration-500 group-hover:rotate-180 ${
    pathname.startsWith("/service")
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const offersChevronLinkStyles = `transition-all duration-500 group-hover:rotate-180 ${
    pathname.startsWith("/discounts") ||
    pathname.startsWith("/referral-program")
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  const resourcesChevronLinkStyles = `transition-all duration-500 group-hover:rotate-180 ${
    pathname.startsWith("/resources")
      ? "text-blue-700 group-hover:text-blue-900"
      : "text-gray-600 group-hover:text-blue-500"
  }`;

  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
      <div className="w-full max-h-fit bg-gray-50 px-4 py-4">
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
            onClick={closeMobileMenu}
            className={howToOrderLinkStyles}
          >
            How to order
          </Link>
          {/*Mobile Menu --  Services */}
          <div className="w-full group transition-all cursor-pointer">
            <p className={servicesLinkStyles}>
              <span>Services</span>
              <FaChevronDown className={servicesChevronLinkStyles} />
            </p>
            {/*Mobile Menu --  Services Dropdown Menu*/}
            <div className="w-full hidden group-hover:block transition-all duration-300 ease-in-out rounded-lg bg-white shadow-xl">
              <Link
                href="/services"
                className={servicesLinkStyles}
                onClick={closeMobileMenu}
              >
                <h3>View All Our Writing Services</h3>
              </Link>
              <div className="horizontal w-full gap-2">
                <div>
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-700 hover:text-blue-900"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
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
                      onClick={closeMobileMenu}
                      className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-700 hover:text-blue-900"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*Mobile Menu --  Offers */}
          <div className="w-full relative group transition-all cursor-pointer">
            <p className={offersLinkStyles}>
              <span>Offers</span>
              <FaChevronDown className={offersChevronLinkStyles} />
            </p>
            {/* Mobile Menu --  Offers Dropdown Menu */}
            <div className="w-full hidden group-hover:flex flex-col items-center justify-center gap-5 text-center transition-all duration-300 ease-in-out">
              <div>
                <div className="pt-2">
                  {offerItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-700 hover:text-blue-900"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*Mobile Menu --  Prices */}
          <Link
            href="/prices"
            onClick={closeMobileMenu}
            className={pricesLinkStyles}
          >
            Prices
          </Link>
          {/* Reviews */}
          <Link
            href="/reviews"
            onClick={closeMobileMenu}
            className={reviewsLinkStyles}
          >
            Reviews
          </Link>
          {/*Mobile Menu --  Resources */}
          <div className="w-full relative group transition-all cursor-pointer">
            <p className={resourcesLinkStyles}>
              <span>Resources</span>
              <FaChevronDown className={resourcesChevronLinkStyles} />
            </p>
            {/*Mobile Menu -- Resources Dropdown Menu */}
            <div className="w-full hidden group-hover:flex flex-col items-center justify-center gap-5 text-center transition-all duration-300 ease-in-out">
              <div>
                <div className="pt-2">
                  {resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 pb-2 text-sm py-2 transition-all duration-300 ${
                        pathname === item.href
                          ? "text-blue-700 hover:text-blue-900"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
