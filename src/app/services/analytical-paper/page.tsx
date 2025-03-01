import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import React from "react";
import { FAQItem } from "@/types/servicesPages";

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How will I know that my analytical essay is original?",
    styledAnswer: (
      <>
        <p className="mb-2">
          When you pay for analytical essay for the first time, getting a
          plagiarized piece is probably your key concern. High-Quality Essay
          does not tolerate copying someone else&apos;s ideas. We write all
          papers directly under your requirements and carefully check them for
          uniqueness before sending them to you.
        </p>
        <p>
          But that&apos;s not all.We also offer a free originality report with
          every &ldquo;write essay for me&rdquo; order. You can request your
          detailed report to ensure your paper has a 96-98% originality score.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "How can I change something once my analytical essay is done?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Our High-Quality Essay staff makes every effort to guarantee that each
          assignment is written to fit your demands and in compliance with all
          of your requirements.
        </p>
        <p>
          However, if it happens that you need your finished analytical essay
          edited, we have you covered. Each order you place with our service
          will be met with our utmost care and attention. Therefore, within 60
          days of the completion of your order, you can request as many
          unlimited and free revisions as you like.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question: "How much time will it take?",
    styledAnswer: (
      <>
        <p className="mb-2">
          You choose the time when your order will be completed when you place
          an order on our service. The quickest delivery option is three hours.
          Of course, our writers will make every effort to finish your
          assignment even more quickly.
        </p>
        <p>
          Remember that the deadline is influenced by a variety of factors, such
          as the paper&apos;s complexity and length. The longer the deadline,
          the lower the price. Therefore, we advise you to chat with our support
          reps and ask how much time it&apos;ll take to complete your paper and
          what will be the final price.
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: "How can I pay for analytical essay?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Visa, Mastercard, American Express, Discover, Maestro, JCB, and Diners
          Club International all recognize our accreditation.
        </p>
        <p>
          Additionally, we handle everything through secure gateways when you
          place an order with us, which protects the privacy of your data. It
          means that you don&apos;t have to worry about anything when you use
          High-Quality Essay!
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: "Will anyone know that I contact to your services?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Our team&apos;s main goal is to make sure that every student will
          receive high-quality assistance whenever they need it. And we always
          make your privacy our top priority.
        </p>
        <p>
          As a result, you can be sure that High-Quality Essay treats your
          personal data with care and precision. Your email information will
          only be used by us to communicate with you regarding your order,
          including to send you drafts and final versions of your analytical
          essay. We store all your data securely, including your payment
          information. You don&apos;t have to worry about your safety or privacy
          when you place an order with High-Quality Essay since we abide by a
          rigorous Privacy Policy and use industry-level encryption.
        </p>
      </>
    ),
  },
];

const AnalyticalPaper = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Analytical essay writing service"
        openningStatement="Use our analytical essay writing service to get quick help. Help from our writers will save you from failing."
        getServiceButtonText="Get analytical essay writing help"
      />
      <OtherServicesSection
        servicesToExclude={["Analytical Essay Writing"]}
        currentServicePage="Analytical essay writing"
      />
      <FAQ
        faqArray={faqData}
        serviceTitle="analytical essay writing services"
      />
    </>
  );
};

export default AnalyticalPaper;
