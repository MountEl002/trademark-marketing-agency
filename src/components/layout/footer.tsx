import React from "react";
import { ChevronRight } from "lucide-react";
import SocialMedia from "../common/socialMedia";
import Image from "next/image";
import Link from "next/link";

interface Links {
  id: number;
  name: string;
  LinkTo: string;
}
interface Services {
  id: number;
  name: string;
  LinkTo: string;
}

const Footer = () => {
  const usefulLinks: Links[] = [
    { id: 1, name: "Home", LinkTo: "/" },
    { id: 2, name: "About Us", LinkTo: "/about_us" },
    { id: 3, name: "Contact Us", LinkTo: "/contact_us" },
    { id: 4, name: "Terms and Conditions", LinkTo: "/terms_and_conditions" },
    { id: 5, name: "Privacy Policy", LinkTo: "/privacy_policy" },
  ];

  const ourServices: Services[] = [
    {
      id: 1,
      name: "Sampling and Data Collection",
      LinkTo: "/sampling_and_data_collection",
    },
    { id: 2, name: "Survey Solutions", LinkTo: "/survey_solutions" },
    {
      id: 3,
      name: "Panel Build Management",
      LinkTo: "/panel_build_management",
    },
    { id: 4, name: "CATI Research", LinkTo: "/cati_research" },
    { id: 5, name: "Project Management", LinkTo: "/project_management" },
    { id: 6, name: "Lead Generation", LinkTo: "/lead_generation" },
    { id: 7, name: "Affiliate Marketing", LinkTo: "/affiliate_marketing" },
    { id: 8, name: "Qualitative Research", LinkTo: "/qualitative_research" },
    { id: 9, name: "Quantitative Research", LinkTo: "/quantitative_research" },
  ];

  return (
    <div className="flex-col mx-auto pt-8 bg-gray-200">
      <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 - Company Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Link href="/">
              <div className="flex-shrink-0 rounded-lg">
                <Image
                  src="/images/favicon.png"
                  width={100}
                  height={50}
                  alt="Company Logo"
                />
              </div>
            </Link>

            <h2 className="font-bold text-2xl text-blue-500">
              Datasphere Research
            </h2>
            <h3>KENYA</h3>
            <p>H No 55, 4th Floor,</p>
            <p>Old Nation House Building,</p>
            <p>Tom Mboya street, Nairobi</p>
            <p>
              <span className="font-bold">Phone:</span> +254 796 595 936
            </p>
            <p>
              <span className="font-bold">Email:</span>{" "}
              info@datasphereresearch.com
            </p>
            <SocialMedia />
          </div>
        </div>

        {/* Column 2 - Useful Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Useful Links</h3>
          {usefulLinks.map((links) => (
            <ul key={links.id} className="space-y-2">
              <li className="flex items-center space-x-2 space-y-4 hover:text-blue-600 cursor-pointer">
                <ChevronRight size={16} />
                <a href={links.LinkTo}>{links.name}</a>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 3 - Our Services */}
        <div>
          <h3 className="font-bold text-lg mb-4">Our Services</h3>
          {ourServices.map((service) => (
            <ul key={service.id} className="space-y-2">
              <li className="flex items-center space-x-2 space-y-4 hover:text-blue-600 cursor-pointer">
                <ChevronRight size={16} />
                <a href={service.LinkTo}>{service.name}</a>
              </li>
            </ul>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center bg-gray-300 mt-8 py-5">
        © | 2024 Copyright <strong>Datasphere Research</strong>. All Rights
        Reserved
      </div>
    </div>
  );
};

export default Footer;
