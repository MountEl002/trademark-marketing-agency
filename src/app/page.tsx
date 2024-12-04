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
import FAQ from "@/components/common/faq";
import TryNow from "@/components/common/order/tryNow";
import SocialMedia from "@/components/common/socialMedia";

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

interface FAQItem {
  id: number;
  question: string;
  answer: string;
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

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Who writes my essays?",
      answer:
        "At High-Quality Essay, we believe in matching you with the absolute best writer for your specific assignment. Unlike services where you choose from multiple writers, our expert team carefully selects the most qualified professional based on your subject matter and academic requirements. All our writers hold advanced degrees and undergo rigorous vetting to ensure exceptional quality. You can communicate directly with your assigned writer throughout the process at no additional cost.",
    },
    {
      id: 2,
      question: "How quickly can you complete my essay?",
      answer:
        "We pride ourselves on delivering high-quality work within your specified timeframe. When placing your order, simply indicate your desired deadline in the order form. We recommend allowing extra time for potential revisions to ensure complete satisfaction with the final product. Our experienced writers excel at meeting tight deadlines while maintaining superior quality. For urgent needs, we can complete single-page assignments in as little as 2 hours.",
    },
    {
      id: 3,
      question: "Do you provide original essays?",
      answer:
        "Absolutely. Our commitment to quality means every essay is written completely from scratch. Our experienced writers take pride in creating 100% original content tailored to your specific requirements. To ensure your complete confidence, we provide access to plagiarism detection software so you can verify the uniqueness of your essay. We stand firmly behind the originality of our work.",
    },
    {
      id: 4,
      question: "What is your pricing structure?",
      answer:
        "We believe in transparent, straightforward pricing. Our service charges a flat rate of $3 per page, making quality academic writing accessible to all students. This competitive rate covers all aspects of our service - there are no hidden fees or surcharges. We've simplified pricing to focus on what matters most: delivering exceptional quality at an affordable price.",
    },
    {
      id: 5,
      question: "Why should I trust your essay writing service?",
      answer:
        "High-Quality Essay has built its reputation on delivering superior academic writing at affordable prices. We offer several guarantees to ensure your confidence: free revisions until you're completely satisfied, a secure payment system, and 24/7 customer support. Rather than using a bidding system, we carefully match you with the most qualified writer for your subject matter. Our focus is on quality and reliability, providing you with the best possible academic support.",
    },
    {
      id: 6,
      question: "Can I remain anonymous while using your service?",
      answer:
        "We take your privacy seriously. Our strict confidentiality policy ensures your information remains completely protected. When creating an account, you'll be assigned a unique identifier - there's no need to provide your real name. We advise against sharing personal details or institutional information with anyone. Your use of our service remains completely confidential.",
    },
    {
      id: 7,
      question: "What types of papers do you offer?",
      answer:
        "Our service covers all academic writing needs, including, essays (argumentative, descriptive, narrative, application), reviews (book, movie, article), complex academic projects (coursework, term papers), and thesis and dissertation chapters among other academic services you might need. Each assignment is handled by a writer specifically qualified in your subject area, ensuring expert-level work that meets academic standards.",
    },
    {
      id: 8,
      question: "How do you select your writers?",
      answer:
        "Our rigorous selection process ensures only top-tier academic writers join our team. Each candidate must provide proof of advanced degrees, pass comprehensive English proficiency tests, and successfully complete a trial period. Our quality control team continuously monitors performance, maintaining our high standards. Writers who don't consistently meet our quality benchmarks are immediately removed from our team.",
    },
    {
      id: 9,
      question: "Is your service legitimate?",
      answer:
        "Yes. We operate as a legitimate academic assistance service, providing reference materials and guidance to help students improve their writing skills. Our work serves as a learning tool to enhance your academic capabilities.",
    },
    {
      id: 10,
      question:
        "How can a money-back guarantee help me use your service effectively?",
      answer:
        "According to our money-back guarantee, you can get a full or partial refund when using our online essay writing service. For instance, when you decide to cancel your order, you can get a 100% refund if your writer has not started working on your assignment. Otherwise, the refund amount will depend on the expert’s progress. On top of that, you can count on getting your money back if your order is delivered late and we are at fault. Even though our writers do everything they can to meet the most challenging deadlines, it's impossible to guarantee on-time delivery in 100% of cases. As you can see, getting custom essay help here is risk-free because you can rely on multiple guarantees. We aim to meet our clients' expectations no matter what.",
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
          <h2 className="text-center">
            Frequently Asked Questions about our services
          </h2>
          <FAQ faqArray={faqData} />
        </div>
      </section>

      {/* Social Media Section */}
      <section>
        <div className="max-w-3xl mx-auto">
          <SocialMedia />
        </div>
      </section>
    </>
  );
}
