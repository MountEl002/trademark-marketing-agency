"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import LightLogo from "../common/lightLogo";

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
    { href: "/how_it_works", label: "How to Order" },
    { href: "/prices", label: "Prices" },
    { href: "/reviews", label: "Reviews" },
    { href: "/blog", label: "Blog" },
    { href: "/resources", label: "Resources" },
    // { href: "/blog", label: "Blog" },
  ];

  const serviceItems = [
    { href: "/college_essay_writing", label: "College Essay Writing" },
    { href: "/course_work_writing", label: "Coursework Writing" },
    { href: "/research_paper_writing", label: "Research Paper Writing" },
    { href: "/dissertation_writing", label: "Dissertation Writing" },
    { href: "/college_paper_writing", label: "College Paper Writing" },
    { href: "/case_study_writing", label: "Case Study Writing" },
    { href: "/services", label: "View All Writing Services" },
  ];

  const serviceItemscol2 = [
    { href: "/college_essay_writing", label: "Scholarship Essay Writing" },
    { href: "/course_work_writing", label: "Personal Statement Writing" },
    { href: "/research_paper_writing", label: "Write my Term Paper" },
    { href: "/services", label: "Write My Dissertation" },
    { href: "/dissertation_writing", label: "Buy Research Paper" },
    { href: "/college_paper_writing", label: "Buy Collage Essays" },
    { href: "/case_study_writing", label: "Buy Essay" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-md">
      <div className="relative max-w-5xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <LightLogo />
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <TiThMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div ref={navRef} className="flex flex-row space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-900 py-2 md:pl-0 pl-4 relative group"
                onClick={handleItemClick}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 md:block hidden"></span>
                <span className="absolute left-0 top-0 h-full w-1 bg-white transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 md:hidden block"></span>
              </Link>
            ))}

            <div className="py-2" ref={servicesRef}>
              <Link
                href="#"
                className="flex items-center px-2 space-x-1 text-gray-900 text-sm w-full md:w-auto justify-between md:justify-start relative group"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onMouseEnter={() => setIsServicesOpen(true)}
              >
                <span>Services</span>
                <FaChevronDown className="h-4 w-4" />
                {/* <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 md:block hidden"></span>
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 md:hidden block"></span> */}
              </Link>

              {isServicesOpen && (
                <div
                  className="absolute w-[500px] py-2 mt-5 right-16 rounded-lg bg-gray-100 shadow-md"
                  onMouseLeave={closeDropdown}
                >
                  <h1 className="text-gray-900 text-2xl font-bold py-2 px-4">
                    Popular Services
                  </h1>
                  <div className="flex flex-row gap-6">
                    <div>
                      {" "}
                      {serviceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-base text-gray-900 transition-colors duration-200 relative group"
                          onClick={handleItemClick}
                        >
                          {item.label}
                          <span className="absolute left-0 top-0 h-full w-1 bg-white md:bg-blue-950 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200"></span>
                        </Link>
                      ))}
                    </div>
                    <div>
                      {" "}
                      {serviceItemscol2.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-base text-gray-900 transition-colors duration-200 relative group"
                          onClick={handleItemClick}
                        >
                          {item.label}
                          <span className="absolute left-0 top-0 h-full w-1 bg-white md:bg-blue-950 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200"></span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sign Up and Log in Buttons */}
          <div className="flex flex-row gap-4">
            <Link
              href="/sign_up"
              className="w-28 text-white bg-blue-500 py-2 px-6 md:mx-0 mx-8 font-bold text-sm rounded-full hover:bg-blue-900 hover:scale-105 transition duration-500 text-center"
              onClick={handleItemClick}
            >
              Sign Up
            </Link>
            <Link
              href="/log_in"
              className="w-28 text-white bg-blue-800 py-2 px-6 md:mx-0 mx-8 font-bold text-sm rounded-full hover:bg-blue-950 hover:scale-105 transition duration-500 text-center"
              onClick={handleItemClick}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
