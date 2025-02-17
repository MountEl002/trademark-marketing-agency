import HeroSection from "@/assests/hero-section.jpg";
import HomepageFqa from "@/components/homepageSections/HomepageFqa";
import SelfProclamation from "@/components/common/SelfProclamation";
import EffortlessLearning from "@/components/common/EffortlessLearning";
import PrivacyHighlight from "@/components/common/PrivacyHighlight";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import { IoShieldCheckmark, IoSparklesSharp } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { IoIosUnlock } from "react-icons/io";
import { TbTargetArrow } from "react-icons/tb";
import { FaPhoneVolume } from "react-icons/fa";
import { IconType } from "react-icons";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import AssuranceSection from "@/components/services/AssuranceSection";
import OrderingSteps from "@/components/services/OrderingSteps";

// Benefits Section Details
const benefitsSectionTitle = "Why choose High-Quality Essay";
const benefitsDescription =
  'High-Quality Essay is all about Premium Essay Writing Services.Transform your academic journey with our professional essay writing service. Simply tell us "Write my paper" and let our experts handle the rest.';
const serviceRepImage = {
  src: HeroSection,
  alt: "Essay writing in progress",
};
interface Benefit {
  id: number;
  repIcon: IconType;
  name: string;
  description: string;
}

const BenefitItems: Benefit[] = [
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

// Bonuses Section Details
const bonusSectionTitle = "Smart students choose smarter writing solutions!";
const bonusSectionDescription =
  "Smart students choose smarter writing solutions! Turn ‘I need help writing my essay’ into ‘I got everything I needed—and more!’ ";
const bonusSectionDescription2 =
  "Experience top-tier academic writing with our signature collection of free additional benefits:";

// Reviews section details
const reviewsSectionTitle = "What our Clients Say About Us";
const reviewsSectionDescription = (
  <span>
    Join 23K+ successful students who trust High-
    <span className="text-blue-700">Quality</span> Essay for their academic
    needs. With 392 qualified writers, We build lasting partnerships with our
    clients through exceptional service and affordable rates, making academic
    excellence accessible to all.
  </span>
);

interface ClientReview {
  id: number;
  clientDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
}

const clientReviews: ClientReview[] = [
  {
    id: 0,
    daysAgo: "2024-12-28",
    numOfStars: "9/10",
    clientDetails: "CLIENT #19844",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed. Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 1,
    daysAgo: "2024-12-06",
    numOfStars: "10/10",
    clientDetails: "CLIENT #2438",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 2,
    daysAgo: "2024-12-04",
    numOfStars: "10/10",
    clientDetails: "CLIENT #719844",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 3,
    daysAgo: "2024-12-02",
    numOfStars: "10/10",
    clientDetails: "CLIENT #5674",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 4,
    daysAgo: "2024-12-05",
    numOfStars: "10/10",
    clientDetails: "CLIENT #39807",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 5,
    daysAgo: "2024-12-04",
    numOfStars: "10/10",
    clientDetails: "CLIENT #87645",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 6,
    daysAgo: "2024-12-02",
    numOfStars: "10/10",
    clientDetails: "CLIENT #210897",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 7,
    daysAgo: "2024-12-05",
    numOfStars: "10/10",
    clientDetails: "CLIENT #56729",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 8,
    daysAgo: "2024-11-03",
    numOfStars: "9/10",
    clientDetails: "CLIENT #67945",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 9,
    daysAgo: "2024-12-01",
    numOfStars: "10/10",
    clientDetails: "CLIENT #567453",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 10,
    daysAgo: "2024-12-05",
    numOfStars: "9/10",
    clientDetails: "CLIENT #67543",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 11,
    daysAgo: "2024-12-02",
    numOfStars: "10/10",
    clientDetails: "CLIENT #100547",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 12,
    daysAgo: "2024-12-05",
    numOfStars: "10/10",
    clientDetails: "CLIENT #29887",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 13,
    daysAgo: "2024-12-04",
    numOfStars: "9/10",
    clientDetails: "CLIENT #454647",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 14,
    daysAgo: "2024-12-02",
    numOfStars: "10/10",
    clientDetails: "CLIENT #77902",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 15,
    daysAgo: "2024-12-06",
    numOfStars: "10/10",
    clientDetails: "CLIENT #110089",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 16,
    daysAgo: "2024-12-01",
    numOfStars: "9/10",
    clientDetails: "CLIENT #562100",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 17,
    daysAgo: "2024-11-29",
    numOfStars: "10/10",
    clientDetails: "CLIENT #90889",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
  {
    id: 18,
    daysAgo: "2024-11-30",
    numOfStars: "9/10",
    clientDetails: "CLIENT #40982",
    statement:
      "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
  },
];

const serviceToTry = "Essay Writing Service";

// Assurance Section Details
interface AssuranceItem {
  id: number;
  question: string;
  description: string;
  bulletPoints?: string[];
}

const assuranceSectionTitle = "Need extra peace of mind? We’ve got you covered";

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my essay with high quality?",
    description:
      "Our writers are carefully chosen for their expertise and education in specific fields. They handle everything - research, formatting, and following your instructions carefully and strictly. We’re all about quality, so you can feel confident in the work you receive.",
  },
  {
    id: 2,
    question: "Is it safe to place an order on your website?",
    description:
      "We only ask for basic details, and your information is safe with High-Quality Essay. Payments are handled through secure platforms, so you don’t have to worry. Your funds stay in your account until you’re happy with the final paper and approve it.",
  },
  {
    id: 3,
    question: "Will a real professional work on my order?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the paper?",
    description:
      "If your requirements aren’t fully met, here are solutions we offer: ",
    bulletPoints: [
      "Request revisions from your writer.",
      "If needed, ask support to assign a new writer.",
      "As a last resort, refer to our Refund Policy.",
    ],
  },
];

// Ordering steps Details
const orderingStepsTitle = "Work with the best essay writers online";
const orderingStepsDescription =
  "At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details or your orders and sit back knowing the best and most qualified writer is working on the order.";
const stepOneTitle = "Give us your essay writing instructions";
const stepOneDescription =
  "To complete your write my essay request, our team needs a few details concerning your order. Fill out a short form to specify what kind of essay writing help you need and place your order";
const stepThreeTitle = "Get your paper writing done";
const stepThreeDescription =
  "Once your order is ready, download the paper to check if it meets your needs. Then, pay for essay using your personal account at EssayPro.";

export default function Home() {
  const sercviceTitle =
    "Best Essay Writing Services with Professional Writers at Affordable Prices";
  const openningStatement =
    "Get a high-quality essay writing service that guarantees you the best grades for only $2.5/page. Our professional writers are ready to help you with your essay writing needs. Get started today!";
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle={sercviceTitle}
        openningStatement={openningStatement}
        getServiceButtonText="Order a paper now"
      />

      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle={orderingStepsTitle}
        orderingStepsDescription={orderingStepsDescription}
        stepOneTitle={stepOneTitle}
        stepOneDescription={stepOneDescription}
        stepThreeTitle={stepThreeTitle}
        stepThreeDescription={stepThreeDescription}
      />

      {/* Essay Writing services summary */}
      <ServiceBenefits
        benefitsSectionTitle={benefitsSectionTitle}
        benefitsDescription={benefitsDescription}
        serviceRepImage={serviceRepImage}
        benefitItems={BenefitItems}
      />

      {/* Bonuses Section */}
      <ServiceBonuses
        bonusSectionTitle={bonusSectionTitle}
        bonusSectionDescription={bonusSectionDescription}
        bonusSectionDescription2={bonusSectionDescription2}
      />

      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle={assuranceSectionTitle}
        assuranceItems={assuranceItmes}
      />

      {/* Customer Reviws Section */}
      <ServiceReviewsSection
        reviewsSectionTitle={reviewsSectionTitle}
        reviewsSectionDescription={reviewsSectionDescription}
        clientReviews={clientReviews}
        serviceToTry={serviceToTry}
      />
      {/* Frequently Asked Questions Section */}
      <section id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center">
            Frequently Asked Questions about our services
          </h2>
          <HomepageFqa />
        </div>
      </section>
      {/* Self-Procalamation Section */}
      <section className="bg-blue-50">
        <SelfProclamation />
      </section>

      {/* Description of services and processes section */}
      <section className="bg-blue-100">
        <EffortlessLearning />
      </section>

      {/* Privacy Highlight Section */}
      <section className="bg-blue-600">
        <PrivacyHighlight />
      </section>
    </>
  );
}
