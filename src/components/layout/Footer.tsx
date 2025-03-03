import { usePathname } from "next/navigation";
import SocialMedia from "../common/SocialMedia";
import DarkLogo from "../common/DarkLogo";
import PaymentMethods from "../common/PaymentMethods";
import Link from "next/link";

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

function getCurrentYear(): number {
  return new Date().getFullYear();
}

const year = getCurrentYear();

const Footer = () => {
  const resources: Resource[] = [
    { id: 1, name: "Blog", LinkTo: "/resources/blog" },
    { id: 2, name: "Free papers and Essays", LinkTo: "/resources/free-papers" },
    {
      id: 3,
      name: "Writing Resources",
      LinkTo: "/resources/writing-resources",
    },
    {
      id: 4,
      name: "Free Writing Tools",
      LinkTo: "/writing-tools",
    },
  ];

  const policies: Policy[] = [
    { id: 1, name: "Terms & Conditions", LinkTo: "/terms-and-conditions" },
    { id: 2, name: "Privacy Policy", LinkTo: "/privacy-policy" },
    { id: 3, name: "Cookie Policy", LinkTo: "/cookie-policy" },
    {
      id: 4,
      name: "Confidentiality Policy",
      LinkTo: "/confidentiality-policy",
    },
    { id: 5, name: "Refund Policy", LinkTo: "/refund-policy" },
    { id: 6, name: "Discount Policy", LinkTo: "/dicount-policy" },
    { id: 7, name: "Money Back Guarantee", LinkTo: "/money-back-guarantee" },
  ];
  const companyDeatails: CompanyDetail[] = [
    { id: 1, name: "FAQ", LinkTo: "/#faq" },
    { id: 2, name: "About Us", LinkTo: "/about-us" },
    { id: 3, name: "High-Qulity Essay Reviews", LinkTo: "/reviews" },
    {
      id: 4,
      name: "Why Choose Us",
      LinkTo: "/why-choose-us",
    },
  ];

  const ourServices: Service[] = [
    {
      id: 1,
      name: "Write My Coursework",
      LinkTo: "/services/coursework",
    },
    { id: 2, name: "Write My Assignment", LinkTo: "/services/assignment" },
    {
      id: 3,
      name: "Buy Dissertation",
      LinkTo: "/services/dissertation",
    },
    { id: 4, name: "Term Paper Help", LinkTo: "/services/term-paper" },
    { id: 5, name: "Coursework Help", LinkTo: "/services/coursework" },
    { id: 6, name: "Essay for Sale", LinkTo: "/services/essay" },
    {
      id: 7,
      name: "Write My research Paper",
      LinkTo: "/services/research-paper",
    },
    { id: 8, name: "Fast Essay Writing", LinkTo: "/services/fast-essay" },
    { id: 9, name: "Dissertation Help", LinkTo: "/services/dissertation" },
    {
      id: 10,
      name: "Write My College Essay",
      LinkTo: "/services/college-paper",
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

  const pathname = usePathname();

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
              <li
                className={`mb-2 cursor-pointer w-fit px-4 ${
                  pathname === service.LinkTo
                    ? "font-semibold text-blue-500 hover:text-blue-700"
                    : "hover:text-blue-600"
                }`}
              >
                <Link href={service.LinkTo}>{service.name}</Link>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 2 Resources */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Resources</h3>
          {resources.map((item) => (
            <ul key={item.id}>
              <li
                className={`mb-2 cursor-pointer w-fit px-4 ${
                  pathname === item.LinkTo
                    ? "font-semibold text-blue-500 hover:text-blue-700"
                    : "hover:text-blue-600"
                }`}
              >
                <Link href={item.LinkTo}>{item.name}</Link>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 3 Policies */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Policies</h3>
          {policies.map((item) => (
            <ul key={item.id}>
              <li
                className={`mb-2 cursor-pointer w-fit px-4 ${
                  pathname === item.LinkTo
                    ? "font-semibold text-blue-500 hover:text-blue-700"
                    : "hover:text-blue-600"
                }`}
              >
                <Link href={item.LinkTo}>{item.name}</Link>
              </li>
            </ul>
          ))}
        </div>

        {/* Column 4 Company Details */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Company</h3>
          {companyDeatails.map((item) => (
            <ul key={item.id}>
              <li
                className={`mb-2 cursor-pointer w-fit px-4 ${
                  pathname === item.LinkTo
                    ? "font-semibold text-blue-500 hover:text-blue-700"
                    : "hover:text-blue-600"
                }`}
              >
                <Link href={item.LinkTo}>{item.name}</Link>
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
                <li
                  className={`mb-2 cursor-pointer w-fit px-4 ${
                    pathname === service.LinkTo
                      ? "font-semibold text-blue-500 hover:text-blue-700"
                      : "hover:text-blue-600"
                  }`}
                >
                  <Link href={service.LinkTo}>{service.name}</Link>
                </li>
              </ul>
            ))}
          </div>
        </div>{" "}
      </div>

      {/* Row 4: Disclaimer and paymentMethods */}
      <div className="max-w-xl mx-auto w-full py-8 text-justify px-3">
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
        © | {year} Copyright <strong>High-Quality Essay</strong>. All Rights
        Reserved
      </div>
    </div>
  );
};

export default Footer;
