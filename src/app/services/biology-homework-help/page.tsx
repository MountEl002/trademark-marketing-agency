import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import BiologyHomeworkImage from "@/assests/BiologyHomework.png";
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
import OrderedList from "@/components/services/detailedServiceDescription/OrderedList";

const faqData: FAQItem[] = [
  {
    id: 1,
    question:
      "How do you ensure the safety of personal information when I hire a biology tutor?",
    answer:
      "Every biology helper on our team abides by a strict Privacy Policy. This means they handle your personal info with care and precision. Plus, all the data you share with us is stored securely on our fully encrypted platform. At High-Quality Essay, we utilize bank-level encryption to ensure every transaction you take is safe and smooth. Offload your papers confidently, knowing your privacy is bulletproof with us.",
  },
  {
    id: 2,
    question: "How much does your biology help cost?",
    answer:
      "Since our customers are often on a limited budget, we keep our rates fair and transparent. A flexible pricing model allows us to maintain a consistently high quality of services, too. Our prices start from just $2.50 per page and can vary depending on your biology assignment's specs. Your deadline, request type, paper topic, and page count can affect the final cost of your order.",
  },
  {
    id: 3,
    question: "What types of biology assignments can you assist me with?",
    answer:
      "High-Quality Essay offers versatile assistance with biology assignments of any type, academic level, and complexity. Our carefully vetted pros can work with any request, including basic essays, lab reports, homework papers, PowerPoint presentations, research papers, case studies, and even term papers. They don't just write these academic works but also help you understand the topic and speed up the process. Rely on your tutor to break down complex biology concepts into simple terms and enhance your writing skills.",
  },
  {
    id: 4,
    question: "What payment options do you offer?",
    answer:
      "You can pay for your order via Visa, MasterCard, American Express, Maestro, Discover, JCB, or Diners Club International. All transactions are backed by our industry-level encryption and trusted payment processors and gateways. Plus, your funds stay in your account until you approve your expert's final work. Make secure, seamless payments, and rest assured your work will be exactly what you need.",
  },
  {
    id: 5,
    question: "How quickly can you write my biology homework?",
    answer:
      "If you place an order with us, you get to choose when you'd like your paper to be completed - the soonest possible date being 3 hours. Nevertheless, factors such as the complexity and size of the task can affect the completion date. If you are not pressed for time, our team is available to provide an estimate of how long the paper would take to complete. Moreover, by giving yourself a larger window of time, you can enjoy significant discounts on our biology essay services, creating an optimal and economical experience.",
  },
  {
    id: 6,
    question: "Can I message my expert while they are working on my paper?",
    answer:
      "Absolutely! We believe that close communication with your tutor is crucial. This helps you get the biology homework help you need and eliminates the unnecessary corrections at the final stages. Chat with your in our secure one-to-one messenger, track their progress on our intuitive platform, and stay in sync throughout the whole process. Feel free to text your helper anytime, asking for edits, early drafts, or writing advice.",
  },
];

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my biology homework with high quality?",
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
    question: "Will a real professional work on my biology homework?",
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
  src: BiologyHomeworkImage,
  alt: "Biology homework writing",
};

const BiologyHomeworkHelp = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Expert biology homework help: Manage your biology assignments with our expert support"
        openningStatement="Get professional biology help online from seasoned tutors with academic degrees."
        getServiceButtonText="Get biology homework help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Why choose us for homework assistance"
        benefitsDescription="Find out why students delegate their biology assignments to High-Quality Essay and keep coming back."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my biology homework"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Questioning yourself? Let's face those uncertainties together!"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Students are talking about us"
        reviewsSectionDescription="See what our customers think about our personalized care, expertly crafted content, and student-oriented policies."
        serviceToTry="biology homework help service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our biology homework help service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our biology homework help service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="How to get our expert assistance"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your biology homework and sit back knowing the best and most qualified writer is working on your biology homework."
        stepOneTitle="Sign up and place an order"
        stepOneDescription="Sign in or register to place your order. Give us your instructions and attach relevant files."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="After receiving an email notification, read your paper and confirm reception. Ask for revisions if necessary. Approve the order and download the file."
      />
      <FAQ faqArray={faqData} serviceTitle="biology homework help service" />
      <OtherServicesSection
        servicesToExclude={[28]}
        currentServicePage="biology homework help"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our biology homework help service">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Why students need our biology homework help" />
            <p>
              Being a biology student can be tough. An endless stream of
              assignments, tight deadlines, lab work, and complex concepts can
              drive anyone crazy. At High-Quality Essay, we get the hustle and
              do everything to make your life a bit easier. Our custom biology
              essay writing service offers the personalized support you need. We
              save you time, energy, and money, ensuring you actually learn in
              the process.
            </p>
            <p>
              Here’s why you might consider getting our biology homework help:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">
                  ‍You struggle to understand complex concepts and terms.{" "}
                </span>
                Don’t know what a genetic drift is? Can’t differentiate
                mitochondria from vacuole? Memorizing boring terms can be tiring
                and time-consuming. We get it. That’s where our seasoned tutors
                come in. They can break down complex terms into bite-size pieces
                and help you understand them.
              </li>
              <li>
                <span className="font-bold">
                  ‍You have trouble with practical experiments.{" "}
                </span>
                Does your biology assignment involve lab work? Spending hours at
                your school’s research center and crafting a paper afterward
                sounds like a nightmare. Let our time-tested pros handle every
                part of your project, ensuring you get accurate results and a
                properly formatted report.
              </li>
              <li>
                <span className="font-bold">
                  ‍You’ve got too much on your plate.{" "}
                </span>
                Juggling school, work, and extracurriculars? Allow us to lighten
                your load. Offload your biology assignments to us and find at
                least a few hours for yourself.
              </li>
              <li>
                <span className="font-bold">
                  ‍Math isn’t your strong suit.{" "}
                </span>
                Some biological projects require high proficiency in math, which
                only adds to the complexity of this subject. If you’re having
                trouble understanding mathematical formulas, allow our expert to
                assist. They are proficient in math and biology and can easily
                help you.
              </li>
              <li>
                <span className="font-bold">
                  You need a personalized approach.{" "}
                </span>
                Everyone learns differently. Hire a professional tutor and enjoy
                customized assistance that helps you grasp complex concepts
                without extra stress.
              </li>
            </UnorderedList>
            <p>
              Whatever your motivation is, we’re here to make your academic
              journey easier.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="How our biology help makes a difference" />
            <p>
              Dealing with complex biology projects can be overwhelming, even
              for the smartest, most diligent students. That’s where
              High-Quality Essay comes in. We offer professional biology
              assignment help, saving you from endless stress and easing your
              schedule.
            </p>
            <p>
              Here’s why biology students trust us with their homework papers:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Expert tutors. </span>We’ve gathered
                a large team of real-life experts who eat, breathe, and sleep
                biology. They know all about mitochondria and genomes and have
                valid academic degrees to prove it. Plus, every expert in our
                network has great communication and writing skills to handle
                even the toughest assignments.
              </li>
              <li>
                <span className="font-bold">‍Personalized assistance. </span>
                Your trust and progress mean the world to us. That’s why we
                treat each biology homework help order differently, catering to
                your unique needs and learning style. Your experts will ensure
                your paper is an original academic piece tailored to your prof’s
                requirements and academic standards.
              </li>
              <li>
                <span className="font-bold">‍Guaranteed quality. </span>Our
                rigorously vetted biology experts will ensure your work is
                picture-perfect. First, your helper carefully proofreads the
                final paper, eliminating all errors, typos, formatting mistakes,
                and grammar inaccuracies. Then, each work gets checked for
                plagiarism. You can get a copy of this report to verify the
                originality of your work.
              </li>
              <li>
                <span className="font-bold">On-time delivery. </span>We take
                your deadlines seriously and ensure prompt submission for every
                order. Whether your paper is due in three or twenty-three hours,
                our stellar team will deliver it with time to spare.
              </li>
              <li>
                <span className="font-bold">‍Round-the-clock support. </span>Our
                friendly support team is here for you 24/7/365. Ask them
                anything and get a prompt, helpful response within minutes.
                Keeping you informed and happy is our key goal.
              </li>
            </UnorderedList>
            <p>
              Pay for homework at our service and enjoy stress-free learning!
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="How High-Quality Essay completes your orders" />
            <p>
              At High-Quality Essay, we don’t just complete biology assignments.
              Each expert on our team provides personalized care, guiding you
              through all the hurdles of crafting a high-quality paper that
              meets your school’s academic requirements. The best part? This
              expert assistance requires minimum effort from you and ensures you
              learn the necessary information.
            </p>
            <p>
              Our team follows a strict five-step process to guarantee top-tier
              quality for every order. Here’s how they handle your biology or
              history homework help:
            </p>
            <OrderedList>
              <li>
                <span className="font-bold">
                  Matching you with a professional writer.{" "}
                </span>
                Once you place your order, we will assign the order to the most
                qualified writer in our team. They will have a degree in biology
                and experience in writing academic papers.
              </li>
              <li>
                <span className="font-bold">‍In-depth research. </span>Your
                helper will carefully review your requirements and ask for
                clarifications if necessary. Once they’re familiar with your
                instructions, your expert will thoroughly study the topic of
                your biology paper. Our writers use only credible sources, often
                consulting limited-access databases.
              </li>
              <li>
                <span className="font-bold">
                  ‍Outlining a coherent structure.{" "}
                </span>
                The next step is diligently crafting the paper itself. First,
                the writer outlines a clear, logical structure and then writes
                compelling arguments backed by solid evidence. Every paper is
                completed from scratch without the use of AI tools or
                copy-paste.
              </li>
              <li>
                <span className="font-bold">
                  ‍Meticulous formatting and proofreading.{" "}
                </span>
                Your expert formats the work following your prof’s requirements.
                Then, the helper triple-checks the final paper, ensuring there
                are no typos, factual errors, or grammar mistakes. Our pros also
                scan all papers on robust plagiarism checkers to verify a 96-98%
                originality score. Feel free to request a copy of this report.
              </li>
              <li>
                <span className="font-bold">Sending the paper to you. </span>
                When the final biology paper is ready, your expert hands it over
                to you. Rest assured, you’ll receive high-quality academic work
                that meets your expectations and your school’s academic
                standards. Your helper is also ready to implement any changes,
                even 60 days after paper completion.
              </li>
            </OrderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Hire seasoned biology writers to simplify your studies" />
            <p>
              At High-Quality Essay, we handpick the most qualified tutors to
              join our team. We don’t settle for decent or barely qualified
              experts, we only partner with the best. This diligent approach
              allows us to provide professional writing services that actually
              make a difference in students’ lives.
            </p>
            <p>Here’s what sets our biology tutors apart:</p>
            <UnorderedList>
              <li>
                <span className="font-bold">
                  ‍Academic degrees and rich expertise.{" "}
                </span>
                We work only with seasoned writers who hold either a Bachelor’s,
                Master’s, or Ph.D. degree in various biological fields. Each
                High-Quality Essay tutor also has extensive practical
                experience, allowing them to confidently tackle your requests.
              </li>
              <li>
                <span className="font-bold">A diverse pool of experts. </span>{" "}
                Our tutors are proficient in various fields of biology - from
                ecology and biochemistry to genetics and microbiology. Whatever
                your request, we have just the expert to handle it.
              </li>
              <li>
                <span className="font-bold">
                  ‍Sharp writing and research skills.{" "}
                </span>
                Before joining our team, each expert undergoes a multi-step
                testing process to verify their professional skills. We check
                their proficiency in writing, proofreading, research, and even
                communication with customers. Only the most qualified candidates
                get to work on your biology homework.
              </li>
              <li>
                <span className="font-bold">
                  ‍Ability to explain the toughest concept.{" "}
                </span>
                Every expert in our network can break down complex terms and
                concepts into simple sentences, helping you understand the
                topic.
              </li>
              <li>
                <span className="font-bold">Personalized care. </span>We offer
                caring assistance tailored to your specific needs and wants.
                Your expert will consider your learning style, uni’s academic
                requirements, and professor’s guidelines.
              </li>
              <li>
                <span className="font-bold">
                  Commitment to personal growth.{" "}
                </span>
                Our experts are dedicated to perfecting their skills, never
                stopping to learn. They study the most up-to-date biological
                publications and scientific developments to ensure you get
                top-tier assistance.
              </li>
            </UnorderedList>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default BiologyHomeworkHelp;
