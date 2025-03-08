import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import CollegeAdmissionEssayImage from "@/assests/CollegeAdmissionEssay.png";
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

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Can I communicate directly with the admission essay writer?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Absolutely! When you use our college admission essay writing service,
          you’re not just handed an essay, you’re given the chance to work
          closely with the writer.
        </p>
        <p>
          This direct communication lets you share your ideas, preferences, and
          any special requirements you might have. You can ask questions and
          provide feedback to help the writer capture your voice.
        </p>
        <p></p>
      </>
    ),
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
    question: "Can you write my admission essay with high quality?",
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
    question: "Will a real professional work on my admission essay?",
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
  src: CollegeAdmissionEssayImage,
  alt: "Admission essay writing",
};

const page = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Admission essay writing service: Get a quality essay for your admission"
        openningStatement="Our admission essay service is top-notch and available starting at the affordable price of just $2.50 per page."
        getServiceButtonText="Get admission essay help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="6 key reasons to pick our admission essay writing service"
        benefitsDescription="We know what you need and are here for you. Let us make you feel safe."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my admission essay"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Second guessing? Let's tackle those doubts head-on!"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Check out what our customers say"
        reviewsSectionDescription="Here's what our customers had to say after getting their essays from High-Quality Essay."
        serviceToTry="admission essay writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our admission essay writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our admission essay writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Get admission essay writing service in 3 steps"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your admission essay and sit back knowing the best and most qualified writer is working on your admission essay."
        stepOneTitle="Sign up and place an order"
        stepOneDescription="Sign in or register to place your order. Give us your instructions and attach relevant files."
        stepThreeTitle="Get the complete paper and pay"
        stepThreeDescription="After receiving an email notification, read your paper and confirm reception. Ask for revisions if necessary. Approve the order and download the file."
      />
      <FAQ faqArray={faqData} serviceTitle="admission essay writing service" />
      <OtherServicesSection
        servicesToExclude={[50]}
        currentServicePage="admission essay writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our admission essay writing">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Why choose our college application essay writing service" />
            <p>
              Getting into college can be tough, but with the right essay, your
              chances get better! Here’s why our service is the go-to choice for
              students:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">‍Outstanding essays: </span>We don’t
                just write. We listen to your story and create an essay that
                feels like YOU. Our admission essay writing service guarantees
                that your paper is unique, just like your journey.
              </li>
              <li>
                <span className="font-bold">Top-notch writers: </span>We’re
                proud of our team. They’re not just any writers – they’re
                experts in college applications. They’ve got the experience and
                know exactly what colleges want.
              </li>
              <li>
                <span className="font-bold">Punctuality is key: </span>We always
                make sure that you get your essay right when you need it. This
                way, you have plenty of time to review and get it ready for
                submission.
              </li>
              <li>
                <span className="font-bold">‍Affordable excellence: </span>We
                believe that every student deserves the best. And that shouldn’t
                be expensive. So, we offer amazing writing that suits your
                budget.
              </li>
              <li>
                <span className="font-bold">‍Always here for you: </span>College
                applications can get confusing. But don’t worry – we’re here to
                help! Whether you have questions about our service or just need
                some advice, our team is ready to chat.
              </li>
              <li>
                <span className="font-bold">‍Feedback and revisions: </span>Does
                your essay need some revisions? No problem! We’re open to
                feedback. If you think your essay needs a little tweaking, we’re
                on it.
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Our quality assurance process and revision policy" />
            <p>
              Going to college and getting higher degrees is a big step. And you
              want everything, from your essay to your dissertation, to be
              perfect. That’s where our services come in. Let me explain how we
              ensure top-quality admission essay writing help for you.
            </p>
            <p>
              When you use our admission or college essay writing service,
              you’re not just getting a writer. You’re getting a promise of
              top-notch quality. Here’s how we keep that promise when you
              request us to “write my admission essay:”
            </p>
            <UnorderedList>
              <li>
                First, every service we provide starts with understanding your
                needs. Our writers take the time to get all the details right.
                They talk to you, ask questions, and make sure they know exactly
                what you want.
              </li>
              <li>
                Once they write the essay or dissertation, it doesn’t go
                straight to you. It goes through a quality check. We have a team
                of experts who review every piece of work. They look for errors,
                check facts, and ensure the writing meets high standards.
              </li>
              <li>
                Now, let’s say you get your college application or dissertation
                and feel there’s something we missed, or you want to change.
                Just let us know.
              </li>
            </UnorderedList>
            <p>
              Remember, we want you to be happy with our work. So, you can ask
              for changes within 14 or 30 days after getting your work,
              depending on your assignment’s specs. Our writers will make the
              revisions you want, and they’ll do it quickly.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Admission essay: Why is it important?" />
            <p>
              Going to college is exciting! One of the crucial elements of your
              college application is the admission essay. Let’s discuss its
              importance.
            </p>
            <p>
              The admission essay serves as your introduction. It offers a
              platform for you to introduce yourself to the college. While
              grades are vital, colleges are keen to know more about you than
              just your academic performance.
            </p>
            <p>
              Imagine your essay being read by hundreds. A well-written essay
              can make you stand out and be memorable. It provides an
              opportunity to connect with the reader and share your personal
              story.
            </p>
            <p>
              An impressive essay can significantly boost your chances of
              securing a seat in your desired college. It’s often said that a
              compelling essay can tip the scales in your favor. Hence, it’s
              essential to put your best foot forward. Our top application essay
              writing service focuses on genuine stories and authentic emotions,
              highlighting the true you.
            </p>
            <p>
              Whether you’re penning it yourself or seeking assistance from an
              application essay writing service, ensure that your essay
              genuinely represents you. A heartfelt essay can expedite your
              college admission journey.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Collaborating with professional admission essay writers pays off" />
            <p>
              An admission essay isn’t just a list of what you’ve done. It’s a
              story about you. It tells colleges who you are, what you think,
              and how you see the world. Writing this essay is tricky.
            </p>
            <p>
              That’s where a professional touch comes in. Our team is not just
              any group of writers. They are experts in creating stories that
              stand out. They know how colleges think and what they’re looking
              for in students. By using our admission essay writing service, you
              get that expertise on your side.
            </p>
            <p>Here’s what you gain:</p>
            <UnorderedList>
              <li>
                <span className="font-bold">Expert touch: </span>Every our
                writer knows how to show your best side. They craft stories that
                are both true to you and interesting to colleges.
              </li>
              <li>
                <span className="font-bold">Save time: </span>Writing takes
                time, especially when it’s about yourself. Choosing our team for
                admission essay writing help means you’ll have more time for
                other important activities, like preparing for interviews or
                visiting campuses.
              </li>
              <li>
                <span className="font-bold">Better chances: </span>A
                well-written essay can make you stand out from other students.
                It can be the difference between getting an acceptance letter
                and missing out.
              </li>
            </UnorderedList>
            <p>
              Grades and test scores show what you can do, but an essay shows
              who you are. It’s your voice, your heart, and your soul on paper.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default page;
