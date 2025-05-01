import { usePathname } from "next/navigation";
import SocialMedia from "../common/SocialMedia";
import Link from "next/link";
import { ScrollToElement } from "../common/ScrollToElement";
import LightLogo from "../common/LightLogo";

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

function getCurrentYear(): number {
  return new Date().getFullYear();
}

const year = getCurrentYear();

const Footer = () => {
  const policies: Policy[] = [
    { id: 1, name: "Terms & Conditions", LinkTo: "/terms-and-conditions" },
    { id: 2, name: "Privacy Policy", LinkTo: "/privacy-policy" },
    { id: 3, name: "Cookie Policy", LinkTo: "/cookie-policy" },
  ];
  const companyDeatails: CompanyDetail[] = [
    { id: 1, name: "FAQ", LinkTo: "/#homepage-faq" },
    { id: 2, name: "About Us", LinkTo: "/about-us" },
    { id: 3, name: "Our Reviews", LinkTo: "/reviews" },
    {
      id: 4,
      name: "Why Choose Us",
      LinkTo: "/why-choose-us",
    },
  ];

  const ourServices: Service[] = [
    {
      id: 1,
      name: "Digital marketing",
      LinkTo: "/services/coursework",
    },
    { id: 2, name: "Social media marketing", LinkTo: "/services/assignment" },
    {
      id: 3,
      name: "Content marketing",
      LinkTo: "/services/dissertation",
    },
    { id: 4, name: "Emial marketing", LinkTo: "/services/term-paper" },
  ];

  const pathname = usePathname();

  return (
    <div className="mx-auto pt-8 bg-indigo-950 text-gray-300 text-sm">
      {/* Row 1: Company Logo and Social Media Handles */}
      <div className="max-w-6xl mx-auto w-full mb-10 px-3">
        <div className="flex justify-between border-b-[1px] border-gray-500">
          <LightLogo />
          <SocialMedia />
        </div>
      </div>

      {/* Row 2: Services, Resources, Policies, and Company Details*/}
      <div className="footer-first-grid gap-y-6 mb-10">
        {/* Column 1 - Our Services */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Our Services</h3>
          {ourServices.map((service) => (
            <ul key={service.id} className="">
              <li
                className={`mb-2 cursor-pointer w-fit ${
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
        {/* Column 3 Policies */}
        <div>
          <h3 className="font-bold text-lg text-gray-100 mb-4">Policies</h3>
          {policies.map((item) => (
            <ul key={item.id}>
              <li
                className={`mb-2 cursor-pointer w-fit ${
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
                className={`mb-2 cursor-pointer w-fit ${
                  pathname === item.LinkTo
                    ? "font-semibold text-blue-500 hover:text-blue-700"
                    : "hover:text-blue-600"
                }`}
              >
                {item.LinkTo === "/#homepage-faq" ? (
                  <ScrollToElement href={item.LinkTo}>
                    {item.name}
                  </ScrollToElement>
                ) : (
                  <Link href={item.LinkTo}>{item.name}</Link>
                )}
              </li>
            </ul>
          ))}
        </div>
      </div>
      {/* Row 5 Copyright */}
      <div className="text-center mt-8 py-5 w-full bg-indigo-800">
        © | {year} Copyright <strong>Trademark Marketing Agency</strong>. All
        Rights Reserved
      </div>
    </div>
  );
};

export default Footer;
