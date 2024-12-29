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

  const ResourceItems = [
    { href: "/resources/free-papers", label: "Free Papers and Essays" },
    { href: "/resources/blog", label: "Blog" },
    { href: "/resources/writing-resources", label: "Writing-resources" },
  ];

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-md">
      <div className="relative max-w-5xl mx-auto">
        <div className="horizontal-space-between h-16">
          {/* Left section */}
          <LightLogo />
          {/* Middle Section */}
          <div className="w-fit horizontal gap-3 transition-all">
            <Link href="#" className="relative group transition-all">
              <p className="horizontal gap-2 text-sm">
                <span>Services</span>
                <FaChevronDown className="transition-all duration-500 group-hover:rotate-180" />
              </p>
              {/* Services Dropdown Menu */}
              <div className="absolute w-[500px] top-12 hidden group-hover:block rounded-lg bg-gray-100 shadow-md">
                <Link href="/services" className="">
                  <h2 className="text-gray-700 text-2xl font-bold py-2 px-4 transition-colors duration-300 hover:text-blue-400">
                    View All Our Writing Services
                  </h2>
                </Link>
                <div className="horizontal gap-4">
                  <div>
                    {serviceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-900 transition-colors duration-200 relative group"
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
                        className="block px-4 py-2 text-base text-gray-900 transition-colors duration-200 relative group"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
            <Link href="#" className="relative group transition-all">
              <p className="horizontal gap-2 text-sm">
                <span>Resources</span>
                <FaChevronDown className="transition-all duration-500 group-hover:rotate-180" />
              </p>
              {/* Resources Dropdown Menu */}
              <div className="absolute w-[200px] top-12 hidden group-hover:block rounded-lg bg-gray-100 shadow-md">
                <div className="vertical gap-4">
                  <div>
                    {ResourceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-900 transition-colors duration-200 relative group"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
            <Link href="#" className="group transition-all">
              <p className="horizontal gap-2 text-sm">
                <span>Offers</span>
                <FaChevronDown className="transition-all duration-500 group-hover:rotate-180" />
              </p>
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
