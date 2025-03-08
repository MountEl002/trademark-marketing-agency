import { AssuranceItem, FAQItem, TableRow } from "@/types/servicesPages";
import BiologyEssayWritingImage from "@/assests/BiologyEssayWriting.png";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import AssuranceSection from "@/components/services/AssuranceSection";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import OrderingSteps from "@/components/services/OrderingSteps";
import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import { RiTrophyFill } from "react-icons/ri";
import { MdDashboardCustomize, MdVerified } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { SiBookstack } from "react-icons/si";
import { IoAlarm } from "react-icons/io5";
import ServiceDescriptionTable from "@/components/services/detailedServiceDescription/ServiceDescriptiontable";

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Why should I buy biology essay from High-Quality Essay?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Choosing High-Quality Essay as your go-to service is a decision you
          won’t regret. With over a decade of experience in the industry, we
          have not only honed our skills but also built a strong reputation as a
          reliable and respectful service provider. Our vast experience has
          taught us how to cater to our clients’ unique needs and deliver work
          that is quick, efficient, and highly original.
        </p>
        <p>
          At High-Quality Essay, we go above and beyond to make your custom
          biology essay flawless. Our diverse team of expert writers can tackle
          any assignment, from essays and thesis papers to discussion posts and
          dissertations. Gain instant access to a wealth of knowledge and
          expertise right at your fingertips!
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "Can I trust that your papers are original?",
    styledAnswer: (
      <>
        <p className="mb-2">
          We recognize that when seeking academic support, you expect the final
          product to be plagiarism-free. To meet your expectations, we take the
          following measures:
        </p>
        <UnorderedList>
          <li>
            Our writers create each text from scratch. They meticulously avoid
            copying others’ ideas and appropriately cite all sources consulted
            during the creation of their papers.
          </li>
          <li>
            Our quality control team reviews completed orders using an
            originality checker before delivery. This ensures that the work you
            receive is genuinely unique.
          </li>
        </UnorderedList>
        <p>
          Furthermore, you can request a complimentary originality report, which
          we will gladly include with your paper, verifying a minimum
          originality score of 96% or higher. By employing these types of
          quality control methods, we consistently deliver high-quality,
          plagiarism-free work to our valued customers.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question:
      "Are there any assurance that come with your biology essay writing service?",
    answer:
      "At our professional service, we strive to provide exceptional expertise and outstanding customer support, boasting a 98% satisfaction rate. However, in rare instances of misunderstandings, customers may feel their expectations were unmet. In such cases, we diligently work to rectify the situation through revisions and evaluations by our QA team. If concerns persist, you can also check our Refund Policy. For inquiries regarding this or any other aspect of our writing process, don't hesitate to contact a helpful customer support representative via the chat feature. We are here to ensure your experience is top-notch.",
  },
  {
    id: 4,
    question: "What qualifications do High-Quality Essay writers possess?",
    styledAnswer: (
      <>
        <p className="mb-2">
          At High-Quality Essay, we understand that when it comes to biology
          essay help, you deserve nothing short of the best. That’s why our
          top-tier service is committed to providing you with a team of highly
          skilled professionals, handpicked for their expertise and experience.
        </p>
        <p>
          Every writer we collaborate with is a native speaker, each boasting
          extensive experience in the relevant industry. This ensures that when
          you trust us with your biology essay needs, you’re placing your
          academic success in the hands of true experts.
        </p>
        <p>
          When you choose High-Quality Essay, you’re choosing a team of
          dedicated individuals who prioritize your satisfaction.
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: "How quickly can you write my biology paper?",
    answer:
      "If you place an order with us, you get to choose when you'd like your paper to be completed - the soonest possible date being 3 hours. Nevertheless, factors such as the complexity and size of the task can affect the completion date. If you are not pressed for time, our team is available to provide an estimate of how long the paper would take to complete. Moreover, by giving yourself a larger window of time, you can enjoy significant discounts on our biology essay services, creating an optimal and economical experience.",
  },
  {
    id: 6,
    question: "How do you handle my biology essay formatting and style?",
    answer:
      "We, as an essay service, follow your instructions to the detail. Please let us know which format and style you need your paper to adhere to, and we'll do it for you!",
  },
];

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my biology essay with high quality?",
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
    question: "Will a real professional work on my biology essay?",
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
  src: BiologyEssayWritingImage,
  alt: "Biology essay writing",
};

const tableData: TableRow[] = [
  {
    icon: <RiTrophyFill size={20} color="#ca8a04" className="inline" />,
    primaryText: "Expert writers",
    secondaryText: "Highly competent team",
  },
  {
    icon: <MdVerified size={20} color="green" className="inline" />,
    primaryText: "Original content",
    secondaryText: "High uniqueness score",
  },
  {
    icon: <FaSackDollar size={20} color="#ca8a04" className="inline" />,
    primaryText: "Affordable rates",
    secondaryText: "Price match guarantee",
  },
  {
    icon: <SiBookstack size={20} color="green" className="inline" />,
    primaryText: "Wide range of biology help",
    secondaryText: "Diverse selection available",
  },
  {
    icon: <IoAlarm size={20} color="#14532d" className="inline" />,
    primaryText: "Prompt delivery",
    secondaryText: "Early bird discounts",
  },
  {
    icon: <MdDashboardCustomize size={20} color="green" className="inline" />,
    primaryText: "Customized support",
    secondaryText: "24/7 assistance",
  },
];

const BiologyEssayWritingService = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Biology essay writing service: Get my biology essay request by pros"
        openningStatement="Turn biology challenges into triumphs at just $2.50/page, ensuring first-rate quality and ease."
        getServiceButtonText="Get biology essay help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Top-6 reasons to contact to our biology essay writing service"
        benefitsDescription="We help you beyond writing. Take a look at all the advantages of using our biology essay writing services."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my biology essay"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Doubting your decision? Let's address those concerns straightaway!"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Custom biology essay writing service - Client's feedback"
        reviewsSectionDescription="Clients value our exceptional service, delivering great custom biology essay effortlessly."
        serviceToTry="biology essay writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our biology essay writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our biology essay writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Your path to quality: easy order steps"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your biology essay and sit back knowing the best and most qualified writer is working on your biology essay."
        stepOneTitle="Sign up and place an order"
        stepOneDescription="Sign in or register to place your order. Give us your instructions and attach relevant files."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="After receiving an email notification, read your paper and confirm reception. Ask for revisions if necessary. Approve the order and download the file."
      />
      <FAQ faqArray={faqData} serviceTitle="biology essay writing service" />
      <OtherServicesSection
        servicesToExclude={[35]}
        currentServicePage="biology essay writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our biology essay writing service">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Keep your data safe when utilizing our biology essay writing service!" />
            <p>
              At our essay writers service, our foremost goal is to offer
              top-notch writing support to learners whenever it’s needed while
              making your trust our top priority. High-Quality Essay guarantees
              that your private information remains secure. We only use your
              email address to send drafts and completed papers and keep you
              informed about unique promotions and discounts, enabling you to
              increase your savings with our service.
            </p>
            <p>
              We take immense pride in not gathering or storing any additional
              data, such as payment information. When you collaborate with
              experts at High-Quality Essay, you can entrust your safety
              concerns to us without hesitation. By delegating your tedious
              assignments to our team, you can experience a hassle-free academic
              journey.
            </p>
            <p>
              Our dedicated and secure services are tailored to meet your needs,
              ensuring that you receive personalized assistance from skilled
              professionals. Choose High-Quality Essay to transform your
              academic life and achieve the success you deserve while
              maintaining the security you value.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Write my biology essay with an individualized perspective!" />
            <p>
              Seeking a biology paper writing service for the first time can be
              daunting, especially when originality is a major concern. Our
              platform offers academic assistance in various subjects, including
              biology, and guarantees highly unique content. We meticulously
              craft each paper from scratch and thoroughly verify its
              originality score before delivery.
            </p>
            <p>
              As part of our commitment to quality, we provide a complimentary
              originality report for each order. You can request this detailed
              report to confirm your paper’s authenticity.
            </p>
            <p>
              When placing an order, specify your requirements and upload any
              supplementary materials if needed. Our expert writers will
              diligently follow your guidelines to complete your paper.
              Moreover, you can directly communicate with your chosen expert via
              a user-friendly live chat feature. This ensures both parties are
              on the same wavelength, enabling us to effectively fulfill your
              request.
            </p>
            <p>
              Choose High-Quality Essay and experience a seamless, secure, and
              tailored academic writing process that caters to your needs.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="What if I’m not entirely pleased with my purchase?" />
            <p>
              As we consistently pursue excellence, dissatisfaction is extremely
              uncommon and is always promptly addressed by our team.
              Nevertheless, you may wish to make further alterations or
              revisions to your paper, which is entirely acceptable!
            </p>
            <p>
              Occasionally, particularly when dealing with a complex order that
              has a wide range of requirements, additional edits may be
              necessary. Our team is always receptive to this need. As a result,
              we offer an unlimited revision policy within 60 days of your
              order’s delivery, allowing you to request as many amendments as
              needed at no extra cost.
            </p>
            <p>
              To request modifications, simply reach out to us who throughh the
              chat feature and discuss your concerns. If you’re concerned about
              meeting your deadline and want to guarantee the prompt submission
              of your order, we highly recommend placing your order ahead of
              time.
            </p>
            <p>
              If, after all the requested revisions, you remain unsatisfied with
              the work, a refund is always an option. Should you ask us to
              “write my biology paper for me” through our platform and find the
              quality lacking, you can request a refund following our Refund
              Policy guidelines.
            </p>
            <p>
              These policies ensure the highest level of customer satisfaction,
              making the entire process as seamless as possible for you.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Biology essay writing help from real proffesional writers" />
            <p>
              Looking for top-notch biology help? At High-Quality Essay, you’re
              in capable hands! Our team comprises qualified writers from
              diverse fields, enabling us to handle orders on subjects such as
              business, literature, chemistry, biology, marketing, and more.
            </p>
            <p>
              Selecting your ideal writer is a breeze with our transparent
              expert profiles and ratings. Quickly find the perfect professional
              for your task, and rest assured that with our biology essay
              writing service, your paper is in expert hands. Our writers, who
              are native English speakers, excel in:
            </p>
            <UnorderedList>
              <li>
                Conducting in-depth research and identifying credible sources
              </li>
              <li>Completing even the most intricate assignments on time</li>
              <li>Collaborating effectively with clients</li>
              <li>Adhering to customer requirements and feedback</li>
              <li>Tackling any topic within their area of expertise</li>
            </UnorderedList>
            <p>
              Regardless of the assistance you require, High-Quality Essay
              guarantees custom work tailored to your needs.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Leave a “write my biology paper” request and unlock endless advantages" />
            <p>
              Our team of experts employs a personalized approach for each
              customer, meticulously recreating and enhancing your writing style
              to produce highly original work. Our specialists are skilled in
              all aspects of formatting and referencing to ensure that your
              order is in pristine condition.
            </p>
            <p>
              At High-Quality Essay, we pride ourselves on providing more than
              just originality. Our services come with consistent pricing
              promotions, making them affordable and accessible to a wide range
              of clients. Additionally, we are committed to punctual deliveries,
              ensuring that your work is completed within the specified
              timeframe. Our round-the-clock support services guarantee that any
              concerns or inquiries you may have are addressed promptly and
              effectively.
            </p>
            <p>
              Experience exceptional treatment and buy a biology essay at
              High-Quality Essay now to enjoy our comprehensive suite of
              services.
            </p>
          </div>
          <ServiceDescriptionTable tableData={tableData} />
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default BiologyEssayWritingService;
