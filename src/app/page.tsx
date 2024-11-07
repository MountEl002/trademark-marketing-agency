import OrderNow from "@/components/common/order/orderNow";
import ContinueWithGoogle from "@/components/common/login/continueWithGoogle";
import Priorities from "@/components/common/priorities";
import qualityControlImage from "@/assests/qualityControl2.png";
import Image from "next/image";
import { IoSparklesSharp, IoShieldCheckmark } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoIosUnlock } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import OrderPaper from "@/components/common/order/orderPaper";
import Testimonials from "@/components/testimonials";
import CustomerReviews from "@/components/customerReviews";
import { IconType } from "react-icons";
import FAQ from "@/components/faq";
import TryNow from "@/components/common/order/tryNow";

interface Benefit {
  id: number;
  repIcon: IconType;
  name: string;
  description: string;
}

interface Bonus {
  id: number;
  name: string;
  initialPrice: string;
  currentPrice: string;
}

export default function Home() {
  const ourBenefits: Benefit[] = [
    {
      id: 1,
      repIcon: IoSparklesSharp,
      name: "Expert Academic Writers",
      description:
        "Our carefully vetted team of professional writers holds advanced degrees from leading universities. We match your assignment with the most qualified expert in your field to ensure exceptional quality.",
    },
    {
      id: 2,
      repIcon: MdAttachMoney,
      name: "Excellence at Affordable Rates",
      description:
        "Competitive pricing meets premium quality. Pay only after reviewing and approving your completed essay. Your satisfaction is our priority.",
    },
    {
      id: 3,
      repIcon: IoIosUnlock,
      name: "100% Confidentiality & Security",
      description:
        "Your privacy matters. All interactions with our service are strictly confidential, and your personal information remains completely secure.",
    },
    {
      id: 4,
      repIcon: IoShieldCheckmark,
      name: "Advanced Quality Assurance",
      description:
        "Every essay undergoes: Rigorous plagiarism checking, AI detection scanning, Professional editing, Quality control review. All quality checks are included free with your order.",
    },
    {
      id: 5,
      repIcon: TbTargetArrow,
      name: "Streamlined Ordering Process",
      description:
        "We've simplified excellence: Submit your requirements, Our team assigns the best-qualified expert, Receive your perfectly crafted essay, Review and approve, Release payment only when satisfied.",
    },
    {
      id: 6,
      repIcon: FaPhoneVolume,
      name: "24/7 Dedicated Support",
      description:
        "Our professional support team is available around the clock to assist you with any questions or concerns about your order.",
    },
  ];

  const ourBonuses: Bonus[] = [
    {
      id: 1,
      name: "Unlimited revisions",
      initialPrice: "$10.99",
      currentPrice: "free",
    },
    {
      id: 2,
      name: "A paper draft",
      initialPrice: "$5.99",
      currentPrice: "free",
    },
    {
      id: 3,
      name: "Premium writers",
      initialPrice: "$10.99",
      currentPrice: "free",
    },
    {
      id: 4,
      name: "VIP Support",
      initialPrice: "$10.99",
      currentPrice: "free",
    },
    {
      id: 5,
      name: "A plagiarism report",
      initialPrice: "$25.99",
      currentPrice: "free",
    },
    {
      id: 6,
      name: "An AI report",
      initialPrice: "$16.99",
      currentPrice: "free",
    },
  ];

  return (
    <>
      {/* Here section */}
      <section className="max-w-5xl mt-16 text-center text-gray-600">
        <h1 className="font-bold max-w-3xl">
          Exemplary Essay Writing Services with Professional Writers at
          Affordable Prices
        </h1>
        <h5 className="text-gray-500">
          Get a professional essay for only
          <span className="font-semibold">
            <strong> $3.0/page </strong>
          </span>
          and get unique paper help
        </h5>
        <div className="horizontal gap-6 my-4">
          <OrderNow />
          <ContinueWithGoogle />
        </div>
        <Priorities />
      </section>

      {/* Essay Writing services summary */}
      <section className="bg-blue-50">
        <div className="max-w-5xl text-center">
          <h2>Premium Essay Writing Services</h2>
          <h6>
            Transform your academic journey with our professional essay writing
            service. Simply tell us &quot;Write my essay&quot; and let our
            experts handle the rest.
          </h6>
          <div>
            <Image
              src={qualityControlImage}
              alt="Our Qualitity cotrol process"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 p-4">
            {ourBenefits.map((item) => (
              <div
                key={item.id}
                className="border-b-2 border-gray-400 text-justify"
              >
                <div className="flex flex-row items-center gap-4 mb-4">
                  <item.repIcon size={30} />
                  <h4 className="!mb-0">{item.name}</h4>
                </div>
                <p>{item.description}</p>
                <br />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="max-w-5xl text-center">
        <h2 className="mb-6">
          Smart students choose smarter writing solutions!
        </h2>
        <h6 className="">
          Turn &lsquo;I need help writing my essay&rsquo; into{" "}
          <strong>&lsquo;I got everything I needed—and more!&rsquo;</strong>{" "}
          <br />
          Experience top-tier academic writing with our signature collection of
          free additional benefits:
        </h6>
        <div className="grid grid-cols-3 gap-6">
          {ourBonuses.map((item) => (
            <div
              key={item.id}
              className="flex flex-row justify-between border-2 rounded-lg px-4 py-4 space-x-8"
            >
              <div className="font-semibold">{item.name}</div>
              <div className="horizontal space-x-2">
                <s className="text-red-600">{item.initialPrice}</s>
                <p className="text-green-600 font-semibold">
                  {item.currentPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <OrderPaper />
        </div>
      </section>

      {/* Testimonials Section  */}
      <section className="bg-blue-50">
        <div className="max-w-5xl">
          <Testimonials />
        </div>
        <div className="max-w-4xl w-full">
          <TryNow />
        </div>
      </section>

      {/* Customer Reviws Section */}
      <section className="max-w-5xl">
        <CustomerReviews />
        <div className="horizontal mt-8">
          <a
            href="#"
            className="text-white bg-blue-500 py-2 px-6 md:mx-0 mx-8 font-bold text-sm rounded-full hover:bg-blue-900 hover:scale-105 transition duration-500 text-center"
          >
            See More Reviews
          </a>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section>
        <div className="max-w-3xl mx-auto">
          <FAQ />
        </div>
      </section>
    </>
  );
}
