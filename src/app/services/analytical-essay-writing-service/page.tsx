import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import React from "react";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import OrderedList from "@/components/services/detailedServiceDescription/OrderedList";
import OrderingSteps from "@/components/services/OrderingSteps";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import AnalyticalEssayImage from "@/assests/AnalyticalEssayWriting.png";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import AssuranceSection from "@/components/services/AssuranceSection";

const serviceRepImage = {
  src: AnalyticalEssayImage,
  alt: "Analytical essay writing in progress",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my analytical essay with high quality?",
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
          as the paper’s complexity and length. The longer the deadline, the
          lower the price. Therefore, we advise you to chat with our support
          reps and ask how much time it’ll take to complete your paper and what
          will be the final price.
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
          means that you don’t have to worry about anything when you use
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
          Our team’s main goal is to make sure that every student will receive
          high-quality assistance whenever they need it. And we always make your
          privacy our top priority.
        </p>
        <p>
          As a result, you can be sure that High-Quality Essay treats your
          personal data with care and precision. Your email information will
          only be used by us to communicate with you regarding your order,
          including to send you drafts and final versions of your analytical
          essay. We store all your data securely, including your payment
          information. You don’t have to worry about your safety or privacy when
          you place an order with High-Quality Essay since we abide by a
          rigorous Privacy Policy and use industry-level encryption.
        </p>
      </>
    ),
  },
];

const AnalyticalEssayWritingService = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Analytical essay writing service"
        openningStatement="Use our analytical essay writing service to get quick help. Help from our writers will save you from failing."
        getServiceButtonText="Get analytical essay writing help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Why you should you get analytical essay help from us"
        benefitsDescription="Our professional analytical essay writing service will do work entirely from scratch to ensure the analytical essay is 100% original. Additionally, we have a flexible pricing system, our services are budget friendly, and we always deliver on time."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my analytical essay"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Need extra peace of mind? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />

      <ServiceReviewsSection
        reviewsSectionTitle="Hear the feedback from our clients"
        reviewsSectionDescription="Check out what clients are saying about our help! You can also write your own review if you want to share your thoughts about teaming up with us."
        serviceToTry="analytical essay writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our analytical essay writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our analytical essays even more affordable!"
      />

      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="How our analytical essay writing service works"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your orders and sit back knowing the best and most qualified writer is working on the order."
        stepOneTitle="Give us your analytical essay instructions"
        stepOneDescription="No matter the complexity of your project, it only takes a few simple steps to get help from our experts. To begin, provide us with detailed information about your assignment. Give us the topic, academic level, and scope of your work. Provide any specific requirements or instructions and include a deadline."
        stepThreeTitle="Check your paper and pay"
        stepThreeDescription="You’ll get an email notification once our professionals have completed writing your analytical essay. You’re free to chat and ask for as many revisions as necessary even 60 days after paper completion. Make sure to go over the paper thoroughly. Pay only once you approve the results."
      />
      <FAQ faqArray={faqData} serviceTitle="analytical essay writing service" />
      <OtherServicesSection
        servicesToExclude={[1]}
        currentServicePage="analytical essay writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More about our analytical essay writing service">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Get analytical essay writing assistance risk-free" />
            <p>
              Entrusting your personal data to an online service can be taxing.
              That’s why we’ve implemented a strict privacy policy to allay all
              your fears. At High-Quality Essay, we guarantee that all your
              personal information and academic details are kept secure. You can
              be sure that protecting your privacy is one of our top priorities.
              All your interactions will remain between you and us and will be
              protected by bank-level encryption. Rest assured, our professional
              writers are fully aware of the sensitivity of the information they
              handle and adhere to a strict Privacy Policy.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Analytical essay with lots of freebies" />
            <p>
              Although there are several of these websites, students always
              return to ours. This is not by chance. It is due to the fact that
              you can contact us and know that you will receive good work and
              all the assistance you want for a reasonable price. Here are just
              some things you can expect:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Professional helpers</span> - We
                have a large pool of experts in a wide range of disciplines who
                are ready and willing to take on your project and complete it to
                the highest standards.
              </li>
              <li>
                <span className="font-bold">Original help</span> - Ask for a
                free originality report with your order to ensure that your
                paper is highly unique.
              </li>
            </UnorderedList>
            <p>
              To see more about what we can offer you, reach out to our customer
              support team!
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Analytical essay that meets your academic needs" />
            <p>
              We are proud to say that High-Quality Essay is a reliable
              analytical essay writing service with years of experience on the
              market. What makes us stand out from other services?
            </p>
            <OrderedList>
              <li>Commitment to providing high-quality and original content</li>
              <li>A team of talented and versatile writers</li>
              <li>Years of experience and expertise in the field</li>
              <li>Dedication to meeting tight deadlines</li>
              <li>
                Affordable pricing options that cater to students’ budgets
              </li>
              <li>Strict Privacy Policy</li>
              <li>Professional customer service that can solve any problem</li>
            </OrderedList>
            <p>
              With High-Quality Essay, your academic writing needs will be met
              with the utmost professionalism and quality. Unlike other sites,
              we value your time and do not burden you with the task of choosing
              a writer. We know the writers that re best suited and qualified to
              handle specific task. Just submit the details and for your perfect
              analytical essay. You can then sit back and relax after givings us
              the details, knowing you’ll have your expertly written essay
              delivered by the deadline.
            </p>
          </div>
        </div>
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="What assignments can High-Quality Essay analytical essay writing service handle?" />
            <p>
              From business papers to literature reviews, our service is
              equipped to handle a wide range of academic papers. If you are
              ever worried about whether you have the ability to craft a
              high-quality analytical essay, our expert authors can take that
              burden off your shoulders. Our writers have expertise in different
              fields and are trained to handle any type of assignment. Be it
              sociology, psychology, history, annotated bibliography writing
              service, or math, you will receive a well-researched and
              well-written paper every time. Don’t stress over a burdensome
              assignment. Better leave it to professionals and enjoy your free
              time.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Why do students need to get quality help from analytical essay writers ?" />
            <p>
              Even if you put a lot of effort into studying, papers can still
              pile up. It is simple to get behind on duties, whether they are
              related to work, family, or social activities. This is exactly
              where our service comes in. We take your unique requirements
              before the due date that you have set. When you ask our experts
              for analytical essay writing services, you will get matched with a
              professional who is available whenever you need them. So you can
              benefit from their knowledge and use the work sample they provide
              to understand what good research, referencing, and formatting
              looks like, you can ask them any questions you like.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default AnalyticalEssayWritingService;
