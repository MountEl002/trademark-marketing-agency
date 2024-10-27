"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "../common/logo";

const Navbar: React.FC = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeDropdown = () => {
    setIsServicesOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about_us", label: "About" },
    { href: "/coverage", label: "Coverage" },
    { href: "/contact_us", label: "Contact" },
    // { href: "/blog", label: "Blog" },
  ];

  const serviceItems = [
    {
      href: "/sampling_and_data_collection",
      label: "Sampling and Data Collection",
    },
    { href: "/survey_solutions", label: "Survey Solutions" },
    { href: "/panel_build_management", label: "Panel Build Management" },
    { href: "/cati_research", label: "CATI Research" },
    { href: "/project_management", label: "Project Management" },
    { href: "/affiliate_marketing", label: "Affiliate Marketing" },
    { href: "/qualitative_research", label: "Qualitative Research" },
    { href: "/quantitative_research", label: "Quantitative Research" },
    { href: "/lead_generation", label: "Lead Generation" },
  ];

  return (
    <nav className="bg-black md:bg-opacity-50 absolute top-0 left-0 right-0 z-50 md:backdrop-blur-none backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div
            ref={navRef}
            className={`${
              isMobileMenuOpen ? "flex flex-col bg-black" : "hidden"
            } md:flex md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-8`}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white py-2 md:pl-0 pl-4 relative group"
                onClick={handleItemClick}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 md:block hidden"></span>
                <span className="absolute left-0 top-0 h-full w-1 bg-white transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 md:hidden block"></span>
              </Link>
            ))}

            <div className="relative py-2" ref={servicesRef}>
              <Link
                href="#"
                className="flex items-center px-2 space-x-1 text-white text-sm w-full md:w-auto justify-between md:justify-start relative group"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
                {/* <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 md:block hidden"></span>
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 md:hidden block"></span> */}
              </Link>

              {isServicesOpen && (
                <div
                  className="md:absolute md:top-full md:left-0 w-full md:w-72 py-2 mt-2 bg-black md:bg-transparent md:backdrop-filter-none"
                  onMouseLeave={closeDropdown}
                >
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-base text-white md:text-black md:bg-white/50 md:backdrop-blur-sm transition-colors duration-200 relative group"
                      onClick={handleItemClick}
                    >
                      {item.label}
                      <span className="absolute left-0 top-0 h-full w-1 bg-white md:bg-blue-950 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200"></span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact_us"
              className="text-white bg-blue-600 py-2 px-6 md:mx-0 mx-8 font-bold text-sm rounded-full hover:bg-blue-900 hover:scale-105 transition duration-500 text-center"
              onClick={handleItemClick}
            >
              GET A QUOTE
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
