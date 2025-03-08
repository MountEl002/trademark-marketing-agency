import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import ArtEssayWritingImage from "@/assests/ArtEssayWriting.jpg";
import ServiceBenefits from "@/components/services/ServiceBenefits";
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
    question: "Is someone going to know that I used your art paper writing?",
    answer:
      "High-Quality Essay is a true resource for learning and development. If you're struggling with complex subjects, need help structuring your essays, or want to improve your time management, we're here to assist. We also protect your data and keep all customer information secure, eliminating any risk of linking your details to our services.",
  },
  {
    id: 2,
    question: "Which types of art essays do your cover?",
    answer:
      "We can help you write all forms of art essays. We cover contemporary to classical. All you need to do is specify what you need, and we will meet your requirements meticulously. We know that academic writing leaves no room for error. You can rely on us to get you there.",
  },
  {
    id: 3,
    question:
      "Do your writers cover both contemporary and historical art topics?",
    answer:
      "Yes. As we've already stated, we cover all topics and periods. All you need to do is give us clear and concise instructions, and we'll make it happen for you. We pride ourselves on being veterans in this industry. Our writers know many topics in art and art history.",
  },
  {
    id: 4,
    question: "How do I communicate with my art essay writer?",
    answer:
      "You can chat with any of our art writers directly on our platform. We will also notify you by email when your paper is finished. When writers work on your paper, you are also free to chat with them directly if you see fit.",
  },
  {
    id: 5,
    question: "How do you check the paper is original and authentic?",
    answer:
      "Our art essay writing service uses plagiarism detector software and provides you with a plagiarism report upon your request, offering evidence that your paper is highly unique, with originality scores starting at 96%.",
  },
  {
    id: 6,
    question: "How do you handle my art essay formatting and style?",
    answer:
      "We, as an essay service, follow your instructions to the detail. Please let us know which format and style you need your paper to adhere to, and we'll do it for you!",
  },
];

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my art essay with high quality?",
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
    question: "Will a real professional work on my art essay?",
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
  src: ArtEssayWritingImage,
  alt: "Art essay writing",
};

const ArtEssayWritingService = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Expert art essay writers unleash your creative vision: Your vision, our skill in art essay crafting"
        openningStatement="Unleash your artistic potential with our specialized art essays written by verified experts."
        getServiceButtonText="Get art essay help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Gain full advantage of our service's benefits"
        benefitsDescription="We help you beyond writing. Take a look at all the advantages of using our services."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my art essay"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Second guessing? Let's tackle those doubts head-on!"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Read our customers’ reviews"
        reviewsSectionDescription="We have plenty of happy customers we've helped over the years. Check out their feedback."
        serviceToTry="art essay writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our art essay writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our art essay writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Get art essay writing service in 3 steps"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your art essay and sit back knowing the best and most qualified writer is working on your art essay."
        stepOneTitle="Sign up and place an order"
        stepOneDescription="Sign in or register to place your order. Give us your instructions and attach relevant files."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="After receiving an email notification, read your paper and confirm reception. Ask for revisions if necessary. Approve the order and download the file."
      />
      <FAQ faqArray={faqData} serviceTitle="art essay writing service" />
      <OtherServicesSection
        servicesToExclude={[34]}
        currentServicePage="art essay writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our art essay writing service">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Art essay writing service: All you'll ever need" />
            <p>
              If you need art essay help and need it now, then our art essay
              writing will be your guide. High-Quality Essay has been providing
              our services to our customers online for a long time now. We’ve
              built up a good reputation and a loyal customer base over time.
              When you choose us, you choose a service that genuinely
              understands the difficulties that our customers face. We know how
              hard it can be to write lengthy papers, and we understand the
              all-nighters caused by looming deadlines. That’s why we’re here to
              help you.
            </p>
            <p>
              From art essay to literature review writers, and so much more, we
              provide you with all of these services. We are the experts at
              academic help, and you can rely on us whenever you need us. So, if
              you’re looking to save time while meeting your deadlines, it’s
              time to work together. If you want to find a balance between
              college and life, we’ve got the tools to help you. Don’t hesitate
              for too long, we’re waiting for you and can’t wait to help elevate
              your writing game.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Tailored art essays crafted by experts" />
            <p>
              Writing an art essay is no average piece of written work just
              calling for ideas’ expressions on the surface level. Our customers
              must be ready to think critically to analyze and interpret works,
              translating complex visual languages into logically argued and
              expressive prose. This does not, therefore, mean that the process
              is only about a description of what is seen, it involves adding
              value to the art with well-researched evidence and personal
              insights.
            </p>
            <p>
              And here is where you need the help of an experienced writer from
              an exceptional art essay writing service. From brainstorming to
              final proofreading, we support you at every step. More than just
              writing, we offer constructive feedback to refine your ideas and
              arguments, ensuring your essay meets your requirements. We take
              care of history essay writing service, too, amongst many more
              things. Think about it: having a writer is like having a personal
              coach for your writing.
            </p>
            <p>
              We provide extensive resources, examples, and insights to enhance
              the quality of your essay. Our feedback is specific, practical,
              and designed to improve your writing skills. Our goal is to help
              you complete your essay while ensuring you save time and reduce
              stress throughout the process.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default ArtEssayWritingService;
