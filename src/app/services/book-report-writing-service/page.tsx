import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import BookReportWritingImage from "@/assests/BookReportWriting.png";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import AssuranceSection from "@/components/services/AssuranceSection";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import OrderingSteps from "@/components/services/OrderingSteps";
import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import OrderedList from "@/components/services/detailedServiceDescription/OrderedList";

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Who will write my book report?",
    answer:
      "You don’t have to worry about your paper anymore. Our team of experienced writers are proficient in many genres and subjects. You will see the writers’ qualifications before you choose them. This way, you can select an expert who specializes in your topic.",
  },
  {
    id: 2,
    question: "Can I text my writer to specify order details?",
    answer:
      "Absolutely! You get to chat with us even before you make a decision. This way, you can truly see if this is the best fit for you. After that, you can talk to your chosen professional as well. Share ideas, offer your feedback, or ask questions for the best result!",
  },
  {
    id: 3,
    question: "Will writer create custom paper following my requirements?",
    answer:
      "Of course! This is exactly why we ask you to communicate to us. Together, we can find a balance in the writing style and make your book report sound as natural as possible. You can also send samples of your previous papers just to make sure.",
  },
  {
    id: 4,
    question:
      "After I pay someone to write my book report, when will it be ready?",
    answer:
      "You will receive your paper by your deadline so you can review it. As soon as you receive the final product, you can approve it or request edits. You will have 60 days to request additional revisions for your paper, completely free of charge.",
  },
];

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my book report with high quality?",
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
    question: "Will a real professional work on my book report?",
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
  src: BookReportWritingImage,
  alt: "Biology homework writing",
};

const BookReportWritingService = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Hire write my book report for me services: Don’t like book reports? We've got your back!"
        openningStatement="High-Quality Essay experts will help you with your book report from only $2.5/page."
        getServiceButtonText="Get book report writing help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Check out our book report writing service guarantees"
        benefitsDescription="As you choose us for your homework assignments, we can guarantee you the following:"
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my book report"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Feeling uncertain? Time to confront those hesitations directly!"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Check out the testimonials from our satisfied clients"
        reviewsSectionDescription="We put customer satisfaction above all else! So we are always happy to receive positive reviews."
        serviceToTry="book report writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our book report writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our book report writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Hiring online book report writer has never been easier"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your book report and sit back knowing the best and most qualified writer is working on your book report."
        stepOneTitle="Sign up and place an order"
        stepOneDescription="Sign in or register to place your order. Give us your instructions and attach relevant files."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="After receiving an email notification, read your paper and confirm reception. Ask for revisions if necessary. Approve the order and download the file."
      />
      <FAQ faqArray={faqData} serviceTitle="book report writing service" />
      <OtherServicesSection
        servicesToExclude={[37]}
        currentServicePage="book report writing service"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our book report writing service">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Why is our custom book report writing service special?" />
            <p>
              Are you still worried that your writer won’t complete all the
              requirements? Let’s see if we can do something about that! Our
              custom academic help service offers book reports crafted by top
              industry experts. Each report will be tailored to your specific
              requirements! Here is what you will get from our writers:
            </p>
            <UnorderedList>
              <li>Detailed summary of each book;</li>
              <li>In-depth analysis of characters and events;</li>
              <li>Critical insights into hidden meanings.</li>
            </UnorderedList>
            <p>
              We will meet your deadlines every time to you have time to get
              familiar with the report.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Why choose our services?" />
            <p>
              Our custom book report writing services definitely stand out from
              the rest of the competition thanks to our experienced writers,
              on-time delivery, and commitment to client satisfaction. We are
              proud to say that we offer original papers every time, and you can
              check them yourself through any scanning service. You can also
              choose your preferred writer for future collaborations. This way,
              you will get maximum understanding and connection for the best
              results!
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="What’s the secret to a good book report?" />
            <p>
              To create an insightful book report, you need to have a deep
              understanding of several things:
            </p>
            <OrderedList>
              <li>The overall text</li>
              <li>Analysis techniques</li>
              <li>Strong writing skills</li>
              <li>Book report structure</li>
            </OrderedList>
            <p>
              As you receive a perfect paper, you can use it in the future as an
              example for your next projects. We can guarantee that when you ask
              us, “write me a book report,” our writers will prove they are the
              best at dissecting themes, characters, and literary elements. If
              you want, you can hire editing or proofreading services in the
              future for your next papers. We can take a look at them and offer
              our critiques.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="What is a classic book report structure?" />
            <p>
              Traditionally, a book report is different from an essay or an
              academic paper. It has the following sections:
            </p>
            <UnorderedList>
              <li>Introduction, where you present your initial thoughts;</li>
              <li>Summary of the book;</li>
              <li>Analysis of the themes or characters;</li>
              <li>Conclusion with your final thoughts;</li>
              <li>Bibliography in a correct formatting style.</li>
            </UnorderedList>
            <p>
              With this structure, you can present the best context to the
              reader and offer the most relevant information. Creating a
              bibliography is not an easy task, and our expert writers will
              gladly assist you in this challenge!
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default BookReportWritingService;
