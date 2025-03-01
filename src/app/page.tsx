import HeroSection from "@/assests/hero-section.jpg";
import HomepageFqa from "@/components/homepageSections/HomepageFqa";
import SelfProclamation from "@/components/common/SelfProclamation";
import EffortlessLearning from "@/components/common/EffortlessLearning";
import PrivacyHighlight from "@/components/common/PrivacyHighlight";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import AssuranceSection from "@/components/services/AssuranceSection";
import OrderingSteps from "@/components/services/OrderingSteps";
import { AssuranceItem } from "@/types/servicesPages";

// Benefits Section Details
const serviceRepImage = {
  src: HeroSection,
  alt: "Essay writing in progress",
};

// Assurance Section Details
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

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Best Essay Writing Services with Professional Writers at Affordable Prices"
        openningStatement="Get a high-quality essay writing service that guarantees you the best grades for only $2.5/page. Our professional writers are ready to help you with your essay writing needs. Get started today!"
        getServiceButtonText="Order a paper now"
      />

      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Work with the best essay writers online"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details or your orders and sit back knowing the best and most qualified writer is working on the order."
        stepOneTitle="Give us your essay writing instructions"
        stepOneDescription='To complete your "write my essay" request, our team needs a few details concerning your order. Fill out a short form to specify what kind of essay writing help you need and place your order'
        stepThreeTitle="Get your paper writing done"
        stepThreeDescription="Once your order is ready, download the paper to check if it meets your needs. Then, pay for essay using your personal account at High-Quality Essay."
      />

      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Why choose High-Quality Essay"
        benefitsDescription='High-Quality Essay is all about Premium Essay Writing Services.Transform your academic journey with our professional essay writing service. Simply tell us "Write my paper" and let our experts handle the rest.'
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my essay"}
      />

      {/* Bonuses Section */}
      <ServiceBonuses
        bonusSectionTitle="Smart students choose smarter writing solutions!"
        bonusSectionDescription="Turn ‘I need help writing my essay’ into ‘I got everything I needed—and more!’ Experience top-tier academic writing with our signature collection of free additional benefits:"
      />

      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Need extra peace of mind? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />

      {/* Customer Reviws Section */}
      <ServiceReviewsSection
        reviewsSectionTitle="What our Clients Say About Us"
        reviewsSectionDescription="Join 23K+ successful students who trust High- Quality Essay for theiracademic needs. With 392 qualified writers, We build lasting partnerships with our clients through exceptional service and affordable rates, making academic excellence accessible to all."
        serviceToTry="Essay Writing Service"
      />
      {/* Frequently Asked Questions Section */}
      <HomepageFqa />

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
