import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import APAPaperImage from "@/assests/APAPaper.jpg";
import AssuranceSection from "@/components/services/AssuranceSection";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import OrderingSteps from "@/components/services/OrderingSteps";
import FAQ from "@/components/common/FAQ";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import HeadingFourTitle from "@/components/services/detailedServiceDescription/HeadingFourTitle";
import ServiceBonuses from "@/components/services/ServiceBonuses";

const serviceRepImage = {
  src: APAPaperImage,
  alt: "APA paper writing format",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my APA paper with high quality?",
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
    question: "Will a real professional work on my APA paper?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the APA paper?",
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
    question: "What sets High-Quality Essay apart?",
    answer:
      "Our vast experience and strong reputation are what make High-Quality Essay the perfect solution when college assignments pile up or deadlines loom. Our comprehensive service caters to various needs, from essays to theses, college papers, and copywriting. We employ a dedicated team of expert writers, ensuring prompt and professional assistance when you need it most. Using the High-Quality Essay website, you can find a writer to guide you through any assignment with expertise and efficiency.",
  },
  {
    id: 2,
    question: "Do you adhere to my specific instructions?",
    answer:
      "Absolutely! Upon signing up, you’ll receive a personal order form where you can outline your exact requirements. You can even specify any sources you'd like to be used. Our dedicated writers strive to fulfill your wishes and are eager to communicate via chat. Through this chat, you can request drafts and progress updates or ask your expert any questions about the writing process. If all goes well, we might even complete your assignment ahead of schedule!",
  },
  {
    id: 3,
    question: "How can I make changes if needed?",
    answer:
      "In our pursuit of delivering the highest quality, we pledge to provide unlimited revisions to our customers, even 60 days after paper completion. It all depends on your request type. To request modifications, simply engage in a conversation with us and we will promptly and efficiently make the necessary adjustments, demonstrating our unwavering commitment to customer satisfaction. This approach enables a seamless, collaborative experience, ensuring the final product meets your unique requirements and academic guidelines.",
  },
  {
    id: 4,
    question: "Do you offer original APA paper writing?",
    answer:
      'Our expert writers adhere to strict originality policies, avoiding pre-made templates or pre-written texts. We believe in crafting each assignment from scratch, tailored to your specific needs. Our service follows your requirements and guidelines, ensuring a unique result. To bolster your confidence, we include a free originality report with every completed "write my research paper" order upon request, utilizing top-notch plagiarism detectors. Trust our service for high originality!',
  },
  {
    id: 5,
    question: "How fast can you write an APA paper for me?",
    answer:
      "When ordering, you determine the deadline for completion. The shortest available timeframe is 3 hours, but our writers often strive to finish your order sooner. Remember that the paper’s length and complexity can impact the delivery time. Additionally, if you’re not pressed for time, you can enjoy a substantial discount on our writing services - the longer the deadline, the less you pay.",
  },
  {
    id: 6,
    question: "What free features does High-Quality Essay offer?",
    answer:
      "Along with expert writers and quality guarantees, High-Quality Essay provides a range of free features. These include reference and title pages, formatting, originality reports upon request, direct chat with experts, and unlimited amendments within 60 days of paper completion. These exceptional free features are just some of the many reasons clients choose us for their APA format writing needs. We strive to deliver a comprehensive and valuable experience, allowing you to focus on your studies without unnecessary stress or hassle.",
  },
];

const APAPaper = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Stress-free APA mastery: your ultimate paper solution"
        openningStatement="Only $2.50 per page for premium quality and customer-approved excellence. Transform your work with our proven expertise!"
        getServiceButtonText="Get APA paper now"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle='6 key benefits of getting your "Write my paper in APA format"service from High-Quality Essay'
        benefitsDescription="Enjoy many useful features and benefits when you buy an APA paper from us."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my APA paper"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Wondering whether High-Quality Essay will deliver what is promises? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="APA paper writing service online - Customer satisfaction"
        reviewsSectionDescription="See how customer feedback reveals an effortless experience with our unmatched service."
        serviceToTry="APA paper writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our APA paper writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our annotated APA paper writing service even more affordable!"
      />

      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Order our APA paper writing service effortlessly"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your APA paper and sit back knowing the best and most qualified writer is working on your paper."
        stepOneTitle="Let’s get started! Share details"
        stepOneDescription='Fill out a quick form with the specifics of your essay needs, and hit the "submit" button to place your order.'
        stepThreeTitle="Your APA paper masterpiece arrives"
        stepThreeDescription="You’ll receive an email notification when your essay is ready. Carefully review it to ensure everything is in order and release payment."
      />
      <FAQ
        faqArray={faqData}
        serviceTitle="annotated bibliography writing service"
      />
      <OtherServicesSection
        servicesToExclude={["APA Paper Writing"]}
        currentServicePage="APA paper writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="Buy APA papers to alleviate your stress">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Reclaim your time with our academic service" />
            <p>
              Writing demands time, perseverance, and thorough research. Often,
              students need assistance when faced with tight deadlines. We
              provide top-notch writers to help you save time and avoid stress.
              No assignment is too challenging for our skilled team to tackle.
              Loyal customers continue to return to High-Quality Essay due to
              the exceptional quality and value we offer. Our primary goal is to
              facilitate a successful academic journey for students. Browse our
              customer reviews to discover how other students have found
              satisfaction with ease using our platform.
            </p>
            <p>
              We cater to a diverse range of subjects and courses, from an
              economics essay writing service to APA papers. Our expert writers
              will supply original content you can confidently use, ultimately
              helping deepen your knowledge and alleviate your stress.
              Regardless of the class or subject, we are committed to delivering
              outstanding essays tailored to your specific needs.
            </p>
            <p>
              By offering specialized services, we aim to address each student’s
              unique demands. Our dedicated team of experts is equipped to
              handle various topics and deliver high-quality content that
              exceeds expectations. Choose High-Quality Essay for all your
              writing needs and experience the difference exceptional quality
              and value can make in managing your assignments.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="I need someone to do my APA paper for me" />
            <p>
              When seeking assistance with an assignment for the first time,
              ensuring originality is a primary concern. On our website, we
              prioritize unique content and strictly prohibit the use of AI. We
              create all papers from scratch and meticulously examine them for
              distinctiveness before delivery. Furthermore, we provide a
              complimentary plagiarism report with every completed essay upon
              request, allowing you to verify your paper’s 96-98% originality
              score.
            </p>
            <p>
              Upon placing an order with our service, you can outline specific
              requirements for the assignment and even attach supplementary
              materials if necessary. Our specialists will diligently review
              your instructions and craft your paper accordingly. In addition to
              this, you can always communicate with us derectly via a
              user-friendly live chat feature. This approach guarantees that we
              have a clear understanding of the orders expectations, ensuring we
              can fulfill your &ldquo;write me an essay&rdquo; request in the
              most effective manner.
            </p>
            <p>
              Our emphasis on originality and the ability to customize your
              order with specific guidelines highlights our comprehensive
              service. By combining our focus on producing highly unique content
              with the ability to communicate and collaborate with
              professionals, we strive to deliver an unparalleled writing
              experience tailored to your needs. This fusion of originality,
              communication, and personalized guidance ensures that we can
              address your essay requests in the best possible way.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Get the perfect APA style paper while keeping your privacy intact" />
            <p>
              At the heart of our brand’s mission is our commitment to providing
              exceptional writing support to learners whenever they need it. We
              prioritize privacy and security as fundamental aspects of our
              service, ensuring that every customer feels confident when
              entrusting us with their writing needs. This includes assignments
              such as writing an APA style paper or any other academic
              requirement.
            </p>
            <p>
              By valuing your trust, we guarantee data security, the highest
              quality of work, and high originality. High-Quality Essay operates
              with the utmost discretion, follows a rigorous Privacy Policy, and
              utilizes bank-level encryption. Plus, we email you drafts, final
              versions of your papers, and occasional notifications about
              exclusive promotions and discounts, allowing you to save even
              more.
            </p>
            <p>
              We keep your personal information safe, including payment details.
              When hiring experts at High-Quality Essay, you can be confident
              that your safety, privacy, and satisfaction are our top
              priorities. Allow us to take on the burden of APA style papers or
              other assignments so you can simplify your life and focus on other
              parts of your academic journey. Our dedication to your trust,
              safety, and the quality of work we deliver ensures a seamless and
              positive experience with our writing services.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Who will be handling my order?" />
            <p>
              Seeking academic assistance on High-Quality Essay guarantees
              collaboration with top-tier writers. We excel at identifying
              exceptional talent. Securing a place on our team is challenging.
              Only the most qualified applicants are trusted with your papers.
            </p>
            <p>
              Our screening process involves choosing native speakers with
              relevant experience and university qualifications. Before joining
              our team, candidates must pass a series of tests to demonstrate
              their abilities. We also familiarize newcomers with our service
              policies and standards. Once we are confident in their expertise,
              efficiency, precision, and professionalism, they are authorized to
              create content for our clients.
            </p>
            <HeadingFourTitle text="Identity verification" />
            <p>
              We begin by requesting the candidate’s ID to ensure a secure and
              reliable service for our customers.
            </p>
            <HeadingFourTitle text="Diploma authentication" />
            <p>
              Upon validating the writer’s ID, we confirm the legitimacy of
              their diploma, which includes degrees complete with stamps and
              signatures from their educational institution(s).
            </p>
            <HeadingFourTitle text="Writing sample submission" />
            <p>
              We ask for writing samples that our QA department thoroughly
              examines to assess the applicant’s adaptability and comprehensive
              knowledge of handling diverse client requests.
            </p>
            <HeadingFourTitle text="Test assignment" />
            <p>
              Following an interview, candidates are tasked with composing a
              paper to evaluate their ability to keep pace with our team.
            </p>
            <HeadingFourTitle text="Probationary period" />
            <p>
              The final step involves a 1-month probationary period. If the
              candidate demonstrates satisfactory performance, we extend an
              official invitation to join our team.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default APAPaper;
