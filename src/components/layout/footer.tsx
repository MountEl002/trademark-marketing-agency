import React from "react";
import SocialMedia from "../common/socialMedia";
import DarkLogo from "../common/darkLogo";
import PaymentMethods from "../common/paymentMethods";

interface Resource {
  id: number;
  name: string;
  LinkTo: string;
}
interface Service {
  id: number;
  name: string;
  LinkTo: string;
}

interface Policy {
  id: number;
  name: string;
  LinkTo: string;
}
interface CompanyDetail {
  id: number;
  name: string;
  LinkTo: string;
}

interface AllServices {
  id: number;
  name: string;
  LinkTo: string;
}

const Footer = () => {
  const resources: Resource[] = [
    { id: 1, name: "Blog", LinkTo: "/" },
    { id: 2, name: "PlagCheck Tool", LinkTo: "/about_us" },
    { id: 3, name: "Samples", LinkTo: "/contact_us" },
    {
      id: 4,
      name: "Free Essay Writing Tools",
      LinkTo: "/terms_and_conditions",
    },
    { id: 5, name: "Questions and Answers", LinkTo: "/privacy_policy" },
  ];

  const policies: Policy[] = [
    { id: 1, name: "Terms & Conditions", LinkTo: "/" },
    { id: 2, name: "Privacy Policy", LinkTo: "/about_us" },
    { id: 3, name: "Cookie Policy", LinkTo: "/contact_us" },
    {
      id: 4,
      name: "Confidentiality Policy",
      LinkTo: "/terms_and_conditions",
    },
    { id: 5, name: "Refund Policy", LinkTo: "/privacy_policy" },
    { id: 6, name: "Discount Policy", LinkTo: "/privacy_policy" },
    { id: 7, name: "Money Back Guarantee", LinkTo: "/privacy_policy" },
  ];
  const companyDeatails: CompanyDetail[] = [
    { id: 1, name: "FAQ", LinkTo: "/" },
    { id: 2, name: "About Us", LinkTo: "/about_us" },
    { id: 3, name: "High-Qulity Essay Reviews", LinkTo: "/contact_us" },
    {
      id: 4,
      name: "Why Choose Us",
      LinkTo: "/terms_and_conditions",
    },
  ];

  const ourServices: Service[] = [
    {
      id: 1,
      name: "Write My Coursework",
      LinkTo: "/sampling_and_data_collection",
    },
    { id: 2, name: "Write My Assignment", LinkTo: "/survey_solutions" },
    {
      id: 3,
      name: "Buy Dissertation",
      LinkTo: "/panel_build_management",
    },
    { id: 4, name: "Term Paper Help", LinkTo: "/cati_research" },
    { id: 5, name: "Coursework Help", LinkTo: "/project_management" },
    { id: 6, name: "Essay for Sale", LinkTo: "/lead_generation" },
    { id: 7, name: "Write My research Paper", LinkTo: "/affiliate_marketing" },
    { id: 8, name: "Fast Essay Writing", LinkTo: "/qualitative_research" },
    { id: 9, name: "Dissertation Help", LinkTo: "/quantitative_research" },
    {
      id: 10,
      name: "Write My College Essay",
      LinkTo: "/quantitative_research",
    },
  ];

  const allServices: AllServices[] = [
    {
      id: 1,
      name: "Analytical Essay Writing",
      LinkTo: "/services/analytical-paper",
    },
    {
      id: 2,
      name: "Annotated Bibliography",
      LinkTo: "/services/annotated-bibliography",
    },
    {
      id: 3,
      name: "APA Paper Writing",
      LinkTo: "/services/apa-paper",
    },
    {
      id: 4,
      name: "Argumentative Essay Writing",
      LinkTo: "/services/argumentative-essay",
    },
    {
      id: 5,
      name: "Case Study Paper Writing",
      LinkTo: "/services/case-study",
    },
    {
      id: 6,
      name: "Capstone Project Writing",
      LinkTo: "/services/capstone-project",
    },
    {
      id: 7,
      name: "Article Review Writing",
      LinkTo: "/services/article-review",
    },
    {
      id: 8,
      name: "Do My Assignment",
      LinkTo: "/services/assignment",
    },
    {
      id: 9,
      name: "Chicago paper Writing",
      LinkTo: "/services/chicago-paper",
    },
    {
      id: 10,
      name: "College Essay Writing",
      LinkTo: "/services/college-essay",
    },
    {
      id: 11,
      name: "College Paper Writing",
      LinkTo: "/services/college-paper",
    },
    {
      id: 12,
      name: "Coursework Writing",
      LinkTo: "/services/coursework",
    },
    {
      id: 13,
      name: "Dissertation Writing",
      LinkTo: "/services/dissertation",
    },
    {
      id: 14,
      name: "English Assignment Writing",
      LinkTo: "/services/english-assignment",
    },
    {
      id: 15,
      name: "Essay Writing",
      LinkTo: "/services/essay",
    },
    {
      id: 16,
      name: "Fast Essay Writing",
      LinkTo: "/services/fast-essay",
    },
    {
      id: 17,
      name: "Finance Paper Writing",
      LinkTo: "/services/finance-paper",
    },
    {
      id: 18,
      name: "Harvard Paper Writing",
      LinkTo: "/services/harvard-paper",
    },
    {
      id: 19,
      name: "Do My Homework",
      LinkTo: "/services/homework",
    },
    {
      id: 20,
      name: "Lab Report Writing",
      LinkTo: "/services/lab-report",
    },
    {
      id: 21,
      name: "Literature Review Writing",
      LinkTo: "/services/literature-review",
    },
    {
      id: 22,
      name: "MBA Paper Writing",
      LinkTo: "/services/mba-paper",
    },
    {
      id: 23,
      name: "Literature Paper Writing",
      LinkTo: "/services/literature-paper",
    },
    {
      id: 24,
      name: "MLA Paper Writing",
      LinkTo: "/services/mla-paper",
    },
    {
      id: 25,
      name: "Nursing Paper Writing",
      LinkTo: "/services/nurse-paper",
    },
    {
      id: 26,
      name: "Personal Statement Writing",
      LinkTo: "/services/personal-statement",
    },
    {
      id: 27,
      name: "Philosophy Paper Writing",
      LinkTo: "/services/philosophy-paper",
    },
    {
      id: 28,
      name: "PowerPoint Presentation",
      LinkTo: "/services/powerPoint-presentation",
    },
    {
      id: 29,
      name: "Research Paper Writing",
      LinkTo: "/services/research-paper",
    },
    {
      id: 30,
      name: "Scholarship Essay Writing",
      LinkTo: "/services/scholarship-essay",
    },
    {
      id: 31,
      name: "Term Paper Writing",
      LinkTo: "/services/term-paper",
    },
    {
      id: 32,
      name: "Urgent Paper Writing",
      LinkTo: "/services/urgent-paper",
    },
  ];

  return (
    <div className="mx-auto pt-8 bg-indigo-950 text-gray-300 text-sm">
      {/* Row 1: Company Logo and Social Media Handles */}
      <div className="max-w-6xl mx-auto w-full mb-10 px-3">
        <div className="flex justify-between border-b-[1px] border-gray-500">
          <DarkLogo />
          <SocialMedia />
        </div>
      </div>

      {/* Row 2: Services, Resources, Policies, and Company Details*/}
      <div className="footer-grids gap-y-6 mb-10">
        {/* Column 1 - Our Services */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Our Services</h3>
          {ourServices.map((service) => (
            <ul key={service.id} className="">
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={service.LinkTo}>{service.name}</a>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 2 Resources */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Resources</h3>
          {resources.map((item) => (
            <ul key={item.id}>
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={item.LinkTo}>{item.name}</a>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 3 Policies */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Policies</h3>
          {policies.map((item) => (
            <ul key={item.id}>
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={item.LinkTo}>{item.name}</a>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 2 Company Details */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Company</h3>
          {companyDeatails.map((item) => (
            <ul key={item.id}>
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={item.LinkTo}>{item.name}</a>
              </li>
            </ul>
          ))}
        </div>
      </div>

      {/* Row 3: AllServices */}
      <div className="bg-[#0B1221] py-8">
        <div className="max-w-6xl mx-auto">
          <div className="footer-grids">
            {allServices.map((service) => (
              <ul key={service.id} className="">
                <li className="mb-2 hover:text-blue-600 cursor-pointer">
                  <a href={service.LinkTo}>{service.name}</a>
                </li>
              </ul>
            ))}
          </div>
        </div>{" "}
      </div>

      {/* Row 4: Disclaimer and paymentMethods */}
      <div className="max-w-xl mx-auto w-full py-8 text-justify">
        <h3 className="font-bold text-center text-lg text-gray-100 mb-4">
          Disclaimer
        </h3>
        <p>
          High-Quality Essay offers writing and research services for limited
          use only. All the materials from our website and affiliates should be
          used with proper references and in accordance with our{" "}
          <a href="#">Terms & Conditions.</a>
        </p>
      </div>
      <div className="flex justify-center items-center max-w-xl mx-auto ">
        <PaymentMethods />
      </div>
      {/* Row 5 Copyright */}
      <div className="text-center mt-8 py-5">
        © | 2024 Copyright <strong>High-Quality Essay</strong>. All Rights
        Reserved
      </div>
    </div>
  );
};

export default Footer;
