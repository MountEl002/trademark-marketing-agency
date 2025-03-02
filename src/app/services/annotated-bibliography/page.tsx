import FAQ from "@/components/common/FAQ";
import AssuranceSection from "@/components/services/AssuranceSection";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import OrderingSteps from "@/components/services/OrderingSteps";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import AnnotatedBibliographyImage from "@/assests/AnnotatedBibliography.jpg";

const faqData: FAQItem[] = [
  {
    id: 1,
    question:
      "Why should I buy an annotated bibliography from High-Quality Essay?",
    answer:
      "We are a market-leading service, helping students with their assignments for over three years. In our years of experience, we’ve learned how to deliver tailored papers in the shortest time. We get that you may feel overwhelmed by your workload or forget about a deadline. Whatever your case is, we’ve got you covered. Let our experienced professional writers handle your request. Buy annotated bibliography online and forget about any school-related stress.",
  },
  {
    id: 2,
    question: "How do I make sure my order is not plagiarized?",
    styledAnswer: (
      <>
        <p className="mb-2">
          In our over three years of work, we understand how important paper
          originality is to students. That’s why we ensure that our skilled
          experts create every essay from scratch.
        </p>
        <p>
          Whenever a writer uses an external source, they must cite it properly.
          On top of that, our team runs each paper through two plagiarism
          checkers. You can request a plagiarism report verifying a high
          originality score of at least 96%.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question: "What does your service guarantee me?",
    answer:
      "Our top-tier service works non-stop to spare you from hassle when studying. When you ask for our help, you get assistance from the mostin-demand writers with round-the-clock support. With a 98% satisfaction rate, we know how to make even the pickiest customer happy. If, however, any misunderstandings occur, we handle them efficiently too. Our stellar QA team offers free edits. And if you’re still not satisfied, you can request for a refund, subject to our refund policy.",
  },
  {
    id: 4,
    question: "Who delivers the annotated bibliography writing service?",
    answer:
      "We maintain high standards by partnering only with experienced writers. All our experts are native speakers with extensive writing experience. Each writer we cooperate with must pass a rigorous screening process and a 1-month trial period before working on students’ papers. So, whatever academic help you need, you can be confident your task will be handled by a verified professional writer.",
  },
  {
    id: 5,
    question: "How fast can you write an annotated bibliography for me?",
    answer:
      "You can set your own deadline for your order. If you need our help ASAP, we can deliver your paper in 3 hours. But the exact due date depends on many factors, such as essay length and topic, study level, and the complexity of the task. You can always consult us to find out when’ll you get your paper. And if you have time to wait, we’ll offer you a lucrative discount.",
  },
  {
    id: 6,
    question: "What features are included in my order?",
    styledAnswer: (
      <>
        <p className="mb-2">
          High-Quality Essay knows how to combine impeccable paper quality with
          budget-friendly prices. On top of that, all our services come with a
          bunch of free features, such as:
        </p>
        <UnorderedList>
          <li>Plagiarism reports</li>
          <li>Formatting and outline</li>
          <li>Title page</li>
          <li>Reference</li>
          <li>Unlimited edits within 60 days of order completion</li>
          <li>24/7 One-on-one chat with us</li>
        </UnorderedList>
        <p>That’s why many students trust their difficult assignments to us.</p>
      </>
    ),
  },
];

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my annotated bibliography with high quality?",
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
    question: "Will a real professional work on my annotated bibliography?",
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
  src: AnnotatedBibliographyImage,
  alt: "Annotated bibliography writing in progress",
};

const AnnotatedBibliography = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Let our professional writers craft your annotated bibliography"
        openningStatement="Get a high-quality annotated bibliography written by our well-versed professional-writers for just $2.50/page."
        getServiceButtonText="Get annotated bibliography writing help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="6 compelling reasons to pick our annotated bibliography writing service"
        benefitsDescription="Enjoy many useful features and benefits when you buy annotated bibliography paper here."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my annotated bibliography"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Wondering whether High-Quality Essay will deliver what is promises? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Customer feedback"
        reviewsSectionDescription="See what other students have to say about every our annotated bibliography writer, low prices and impeccable quality."
        serviceToTry="annotated bibliography writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our annotated bibliography writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our annotated bibliography writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="How to use our annotated bibliography service"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your annotated bibliography assignment and sit back knowing the best and most qualified writer is working on your annotated bibliography."
        stepOneTitle="Share the instructions for your task"
        stepOneDescription="Fill out a brief form to create a new order. Remember to attach the instructions from your professor for our writers to master your task."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="You’ll receive the final product via email. Add some edits if needed and pay your expert once your instuctions are met."
      />
      <FAQ
        faqArray={faqData}
        serviceTitle="annotated bibliography writing service"
      />
      <OtherServicesSection
        servicesToExclude={["Annotated Bibliography"]}
        currentServicePage="annotated bibliography writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our custom annotated bibliography writing services">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Keep your data secure while working with High-Quality Essay" />
            <p>
              Our team’s primary goal is to provide top-class academic
              assistance to every student in need. Our writers ensure that all
              work is tailored to your specific requirements. They strive to
              deliver high-quality papers, all while safeguarding your personal
              data.
            </p>
            <p>
              Your trust is our top priority. When you request &ldquo;write an
              annotated bibliography for me&rdquo; at High-Quality Essay, you
              can be 100% sure your data is protected with industry-level
              standards. We do not collect any unnecessary personal data. We
              only ask for your email address and the details needed to complete
              your assignment.
            </p>
            <p>
              To further enhance the safety of our collaboration, we offer
              payments only through trusted companies. Rest assured that all
              transactions are transparent and protected by our partners:
              Mastercard, Maestro, Visa, American Express, Discover, JCB, and
              Diners Club International. So, when you ask for our help, you
              won’t have concerns about the security of your personal data or
              transactions. We prioritize your peace of mind and strive to
              provide a seamless experience.
            </p>
            <p>
              Let us handle your most mundane or complicated tasks, like
              crafting an annotated bibliography. Enjoy a stress-free life
              knowing that we value your trust.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Authentic papers with a personal touch" />
            <p>
              As one of the market-leading custom annotated bibliography writing
              services, we understand that paper originality is a vital concern
              for many students seeking our help. We don’t tolerate any
              plagiarism, and our papers are written from scratch to maintain a
              high originality score. You can trust us with your assignments
              without worrying about the uniqueness of your work.
            </p>
            <p>
              Our first-rate writers create every text from scratch, and the QA
              team thoroughly reviews the authenticity of each paper. We also
              offer a complimentary plagiarism report, guaranteeing a minimum
              96% originality score. Just ask us for a detailed originality
              check, and we’ll send it along with your paper.
            </p>
            <p>
              We also strive to always deliver papers of the highest quality,
              tailored to each student’s needs. That’s why we kindly ask you to
              attach all your requirements and instructions with your order. Our
              writing experts will carefully review all your guidelines and
              craft a paper accordingly. And that’s not all. If you want to add
              something to your task, notify us in our convenient one-on-one
              chat. Request all the edits you like within 60 days of the paper’s
              completion. We want to ensure you’re completely satisfied with our
              service.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Will annotated bibliography writer add changes to my paper?" />
            <p>
              In our three years of experience with students, we’ve learned to
              cater to their every need. We understand that creating a quality
              paper is a lengthy process. You may receive new requirements or
              edits from your tutor at the last minute or even need to add
              changes to your task after submitting it. Our annotated
              bibliography writer will help you with any edits you have.
            </p>
            <p>
              You’ll have a one-on-one chat with us, where you can request paper
              drafts and edits or raise any questions you like. Our highly
              skilled experts will edit your assignment until all your
              requirements are met. Let us know about any changes you’d like to
              make. Then, just sit back and relax. Allow our writing
              professionals to polish your paper.
            </p>
            <p>
              What’s more, you can request unlimited edits even after you’ve
              received the final version of your task. Feel free to contact us
              at any time within 60 days of receiving the paper.
            </p>
            <p>
              Just ask, &ldquo;write my annotated bibliography for me,&rdquo;
              and rest easy knowing a professional will handle it. Our writers
              are experienced and committed to delivering top-notch work.
              They’ll keep working on it until your instuctions are met.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Buy annotated bibliography paper from professionals" />
            <p>
              Many young people feel anxious and burnt out from how much
              schoolwork they have to handle. If this feeling is familiar to
              you, you’ve come to the right place. High-Quality Essay helps
              students just like you lead a stress-free life. Hire a qualified
              online essay writer, and get professional support every step of
              the way.
            </p>
            <p>
              The order process at High-Quality Essay is very straightforward.
              Simply submit the details and instructions of your annotated
              bibliography assignment and sit back knowing a high quality paper
              will be delivered in time
            </p>
            <p>
              When you write to us &ldquo;do my annotated bibliography&rdquo;,
              we guarantee a tailored paper with a high originality score,
              typically from 96%. We run all texts through plagiarism software
              to ensure the paper’s authenticity. You can ask us for a free copy
              of the originality report, and we will send it along with your
              order.
            </p>
            <p>
              Overwhelmed students trust us with their school tasks, as our
              services are completely safe. Not to mention, our professional
              help comes at a budget-friendly price.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="What is special about our annotated bibliography writing service" />
            <p>
              High-Qulity Essay is a trusted service, connecting students with
              top-notch academic writers for over a three years. Students trust
              us with their schoolwork because they know we’ll help them meet
              deadlines without the stress.
            </p>
            <p>
              We’re committed to helping students with any task or school
              subject they want. Whether you’re seeking annotated bibliography
              writing service or need custom dissertation writing service, we’ve
              got you covered. Our skilled experts are proficient in many
              topics, from nursing to business, and can craft a tailored paper
              of any academic level. When customers come to us for help, they
              get to enjoy these perks free of charge:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">24/7/365 support</span> - We
                understand that you may have changes or new requirements at the
                last minute. So you can chat with us at all times. 100% data
                security. All information you share with us stays safe. We use
                bank-level security protocols to protect your personal
                information and transactions.
              </li>
              <li>
                <span className="font-bold">Highly unique papers</span> - We do
                not tolerate the use of templates or pre-written papers. Our
                well-versed writers craft all papers from scratch. On top of
                that, our QA team runs every paper through separate originality
                checks.
              </li>
              <li>
                <span className="font-bold">Prompt delivery</span> - We pride
                ourselves on our impeccable timing. Order content from us and
                never miss another deadline.
              </li>
            </UnorderedList>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default AnnotatedBibliography;
