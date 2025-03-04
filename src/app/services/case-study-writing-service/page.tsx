import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import CaseStudyWritingImage from "@/assests/CaseStudyWriting.png";
import AssuranceSection from "@/components/services/AssuranceSection";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import OrderedList from "@/components/services/detailedServiceDescription/OrderedList";
import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import OrderingSteps from "@/components/services/OrderingSteps";

const serviceRepImage = {
  src: CaseStudyWritingImage,
  alt: "Case study writing",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my case study with high quality?",
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
    question: "Will a real professional work on my case study?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the case study?",
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
    question: "How do you guarantee the final product's quality?",
    answer:
      "We at High-Quality Essay take quality very seriously. This is true about our case study writing service as well. Our dedicated team of experienced writers, editors, and quality control experts work together to satisfy your requirements! We check every case study to ensure the final product is unique and flawless. We also offer free revisions until your case study matches your order's instructions.",
  },
  {
    id: 2,
    question: "What qualifications do your case study writers have?",
    answer:
      "We are proud to say that every essay writer at High-Quality Essay has extensive experience in many fields. We also have a vetting system in place to collaborate with writers from diverse backgrounds and different qualifications. They bring practical knowledge and personal experiences into the projects, resulting in well-crafted and insightful case studies for our clients.",
  },
  {
    id: 3,
    question: "Can I participate and request revisions during writing?",
    answer:
      "Absolutely! We always encourage collaboration between our clients and custom essay writers. You can message us at any stage of the order process, provide your feedback, and ask for revisions if needed. Our team puts client satisfaction as our top priority, so we give you the option to stay active in the writing process!",
  },
  {
    id: 4,
    question: "What is your case study completion time?",
    answer:
      "Of course, every order is different. The time that expert writers need to complete a case study can vary, depending on your unique requirements, the complexity of your project, and your final deadline. However, you can be sure that we will deliver your case study on time or even sooner. This way, you will have more time to review it and ask for a revision if needed!",
  },
  {
    id: 5,
    question: "How much do case study writing service cost?",
    answer:
      "While our rates may vary, we definitely offer competitive pricing that starts from only $2.5 per page! This is the starting point, the rest depends on the specific requirements of your project, its deadline, and the complexity of the case study. At High-Quality Essay, you will get the final project that reflects the high standards of our writers, as well as our competitive rates.",
  },
  {
    id: 6,
    question: "What are the writer's subjects and specializations?",
    answer:
      "Our experts are proficient in a wide range of subjects and industries. With the help of these diverse areas of expertise, High-Quality Essay assigns your project to the writer with the relevant technical skills and experience. This way, you will get the highest level of accuracy and relevance for your case study.",
  },
];

const CaseStudy = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Case study writing service: Delegate your case study to our industry experts"
        openningStatement="Our writers will conduct research for you and compile a polished case study from $2.5/page!"
        getServiceButtonText="Order a case study now"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Six reasons why you should hire us?"
        benefitsDescription="Still undecided about trying our case study writing services? Check this out."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my case study"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Wondering whether High-Quality Essay will deliver what is promises? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Browse our customer reviews"
        reviewsSectionDescription="At High-Quality Essay, we have a transparent system where you can see customer reviews and feedback."
        serviceToTry="Case study writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our case study writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our case study writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Order case study help in 3 easy steps"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your case study and sit back knowing the best and most qualified writer is working on your case study."
        stepOneTitle="Provide your instructions"
        stepOneDescription="Share all instructions, details, and files with us when placing your case study order."
        stepThreeTitle="Download your case study and pay"
        stepThreeDescription="After the order is ready, you can download it, check it meets your requirements, and pay."
      />

      <FAQ faqArray={faqData} serviceTitle="case study writing service" />
      <OtherServicesSection
        servicesToExclude={[5]}
        currentServicePage="case study Writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our custom case study writing services">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Data security of our case study writing service" />
            <p>
              At High-Quality Essay, our Privacy Policy ensures the protection
              of your personal data! We understand that students trust us to
              protect their personal information, both during the ordering
              process and while giving out the details of their project. So,
              when you order case study writing service with us, you can be sure
              that your data will remain secure throughout the entire process!
            </p>
            <p>Here is how we achieve this level of security:</p>
            <UnorderedList>
              <li>
                We only collaborate with trusted professionals after a rigorous
                vetting process.
              </li>
              <li>
                We use the latest encryption technologies to protect all
                communication between our clients and our team.
              </li>
              <li>
                We limit access to your case study details to only those experts
                who working on the case study.
              </li>
              <li>
                We respect your desire for data security and don’t ask for any
                personal details, except your email address.
              </li>
            </UnorderedList>
            <p>
              As you can see, when you put your trust in our case study writing
              service, the security of your data is one of our top priorities!
              We will handle every step of the process with the utmost care,
              making sure that your personal and academic data remains private
              and secure.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Revision and refund policies for maximum client satisfaction" />
            <p>
              As you might have already noticed, we are committed to delivering
              client satisfaction. Even when you see our cheap case study
              writers, you can still be sure that the final project will be of
              the highest quality. On the other hand, we understand that some
              customers might not be satisfied with the final result. For this
              reason, we have designed our policies to reflect our values.
            </p>
            <p>
              <span className="font-bold">Revision policy:</span> Your case
              study isn’t ready until it meets the initial instructions of your
              order! Our very flexible revision policy allows you to ask us to
              make changes to the final product. The unlimited revision policy
              means you can request edits, offer your feedback, and refine your
              case study with us until it matches your requirements!
            </p>
            <p>
              <span className="font-bold">Refund conditions:</span> Even though
              our primary goal is to deliver projects of the highest quality, we
              understand there might be some refund requests along the way. In
              this case, refunds are available if there are any issues with
              payment processing, project cancellation, or if the case study
              writer fails to meet the agreed-upon deadlines. Of course, we will
              try to reach an agreement before you need a refund!
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Personalized case studies tailored to your needs" />
            <p>
              Every student wants the best paper from their case study writing
              service. We understand that every case study project is unique,
              just like our clients! So, our writers use their expertise to
              craft customized solutions for each of our customers. Our writers
              will address all of your requirements, preferences, and deadlines!
            </p>
            <p>
              Our collaboration starts with a consultation so we can understand
              more about your goals and the specific subject of your case study.
              We also take into account your expectations about the complexity
              of the project, the formatting style, and the needed resources.
              After that, our expert writers will start their research process
              for the most up-to-date information.
            </p>
            <p>
              We also value your input throughout the writing process. When you
              buy case study online from High-Quality Essay, you can actively
              participate in the project, share your insights, and provide your
              feedback. This way, we can make sure that the final product will
              align with your requirements! Your case study will achieve a
              minimum score of 96% content originality instead of being one of
              hundreds of similar projects.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Research excellence: the key to a polished case study" />
            <p>
              When you choose High-Quality Essay for your case study assistance,
              you can be sure that our experts will observe the highest
              standards for research quality. Every case study requires a
              different methodology, a unique approach, and rigorous research.
              Let’s take a look at how our writers deliver some of the
              highest-quality case studies!
            </p>
            <OrderedList>
              <li>
                <span className="font-bold">Source selection.</span> Gathering
                quality data starts from credible sources. Our writers are
                skilled at finding and choosing the best sources for your
                project, like peer-reviewed journals, academic publications, and
                reputable books.
              </li>
              <li>
                <span className="font-bold">Data analysis.</span> We don’t stop
                at gathering information, we analyze it thoroughly and interpret
                it in the context of your case study.
              </li>
              <li>
                <span className="font-bold">Inclusive approach.</span> Our case
                study writers leave no stone unturned when it comes to exploring
                different perspectives. They are open to all viewpoints and
                methodologies that can offer a well-rounded view of your case
                study.
              </li>
              <li>
                <span className="font-bold">Primary research.</span>If the
                deadline allows for this, we conduct our own primary research if
                needed. This means that your case study will contain some of the
                most in-depth and authentic information as a result!
              </li>
            </OrderedList>
            <p>
              As you can see, High-Quality Essay is the best choice for
              students! We deliver projects that are based on solid data and
              rigorous analysis.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default CaseStudy;
