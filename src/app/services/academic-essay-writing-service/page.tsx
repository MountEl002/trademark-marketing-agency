import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import AcademicEssayWritingImage from "@/assests/AcademicEssayWriting.jpg";
import AssuranceSection from "@/components/services/AssuranceSection";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import OrderingSteps from "@/components/services/OrderingSteps";
import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Is it legal use academic writing services?",
    answer:
      "There’s nothing illegal about using an essay writing service just like there isn’t anything wrong with using a planner app. Both are just tools to help you manage assignments. We recommend that you use our papers as samples for your own work and read the terms and conditions carefully before using the service, but that’s true for virtually any service online. We always keep your data safe and abide by a strict Privacy Policy. Our service is 100% confidential, and we never share your personal information with third parties.",
  },
  {
    id: 2,
    question: "Does High-Quality Essay provide original work?",
    answer:
      "Yes, of course. High-Quality Essay stands for originality and academic integrity. Each paper you receive goes through numerous examinations. Our Quality Assurance team and customer support work 24/7 to review each paper, ensuring they adhere to order instructions, and rigorously checking for plagiarism. We use a plagiarism detector to ensure the best results. Upon completion, you can also request an originality report for every order at no additional charge. Just ask the support team, and they will send it over.",
  },
  {
    id: 3,
    question: "What exactly can you help me with?",
    answer:
      "We screen thousands of writers to be able to help you with any kind of homework. Whether you need help with dissertation, a standard essay, research, or even coding - we have an expert for that. If you have a very unique assignment that you don’t know how to approach, we recommend contacting our support team and asking if they can find an expert for you. They can help you place your order with the right professional writer!",
  },
  {
    id: 4,
    question: "Is there a way to constantly communicate with my writer?",
    answer:
      "Direct communication between you and us is one of the main determinants of success. At High-Quality Essay, we offer safe, encrypted chats between you and your expert. If you’ve forgotten to specify something in the instructions or need to stress the importance of using a certain source - drop a line to your writer in the appropriate field. You’ll get an email notification when they reply.",
  },
];

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my academic essay with high quality?",
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
    question: "Will a real professional work on my academic essay?",
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

const serviceRepImage = {
  src: AcademicEssayWritingImage,
  alt: "Academic essay writing",
};

const AcademicEssayWritingService = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Academic writing service that has your back: High-Quality Essay helps with any assignment, at any time."
        openningStatement="Our professional team knows what you need and how to help you manage your workload. Trust your assignments to us today."
        getServiceButtonText="Get academic essay writing help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="A time-tested academic writing service"
        benefitsDescription="We know what you need and are here for you. Let us make you feel safe."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my academic essay"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Wondering whether High-Quality Essay will deliver what is promises? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Read customers’ testimonials to see why they choose us"
        reviewsSectionDescription="There are many academic writing services to choose from. Here’s why people choose ours:"
        serviceToTry="academic essay writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our aademic essay writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our academic essay writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="How High-Quality Essay works: 3 easy steps"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your academic essay and sit back knowing the best and most qualified writer is working on your academic essay."
        stepOneTitle="Sign up and place an order"
        stepOneDescription="Sign in or register to place your order. Give us your instructions and attach relevant files."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="After receiving an email notification, read your paper and confirm reception. Ask for revisions if necessary. Approve the order and download the file."
      />
      <FAQ faqArray={faqData} serviceTitle="Academic essay writing service" />
      <OtherServicesSection
        servicesToExclude={[51]}
        currentServicePage="academic essay writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our custom academic essay writing services">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="What makes academic writing so complicated?" />
            <p>
              Academic writing is not supposed to be easy. It’s a way of
              assessing a person’s knowledge, skills, and comprehension of a
              topic, so it’s meant to be challenging. However, for many, it’s
              more than what they can handle. This is why getting academic
              writing help is not just for emergency situations. For many, it’s
              a lifeline that allows them to have a full life.
            </p>
            <p>
              Finding a reputable academic writing company that is on standby to
              help you solve your troubles is a great way to get through your
              assignments. Whether you need research papers writing help or
              assistance with essay writing, finding a team of experts is
              paramount. To ensure that the company is trustworthy, read their
              reviews on third-party websites, look at what payment options they
              offer, and see if they have a refund option. A good, reputable
              service will always work with trusted, well-known payment services
              and take accountability for their actions. If anything goes wrong,
              you need to know you will be able to get a refund. This is your
              safety net. And that’s exactly what High-Quality Essay offers.
            </p>
            <p>
              Studying is never easy, but with a reliable academic help service
              by your side, it can be more than doable.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Why use High-Quality Essay for help with studying" />
            <p>
              There are countless companies that provide academic writing
              services these days. But, unfortunately, you can’t trust them all.
              Some companies will overcharge you for a mediocre product, and
              some will just take your money never to be seen again. Luckily for
              you, though, High-Quality Essay is one of the best service
              providers out there. And we will tell you why in just a moment.
            </p>
            <p>
              Professional academic writers are the backbone of our exceptional
              team. Each of our writers is a native English speaker with
              extensive and proven experience in academic writing. Furthermore,
              they are always online to cater to your every need.
            </p>
            <p>
              Our prices might look too low compared to other services, but that
              doesn’t mean we sacrifice on quality. We’ve come up with a system
              that allows us to keep our prices competitive while providing
              exceptional quality of service.
            </p>
            <p>
              At High-Quality Essay, you can get premium experience for an
              economy price. We provide lots of features, like Plagiarism
              report, premium writers and formatting for free of charge.
            </p>
            <p>
              We follow a customer-first approach in every detail of our
              operation. Our refund policies are written with you in mind. These
              are just some of the numerous reasons why you should choose
              High-Quality Essay for your next writing project.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default AcademicEssayWritingService;
