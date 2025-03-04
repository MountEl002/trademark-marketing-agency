import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import AssignmentWritingImage from "@/assests/AssignmentWriting.jpeg";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import AssuranceSection from "@/components/services/AssuranceSection";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import OrderingSteps from "@/components/services/OrderingSteps";
import FAQ from "@/components/common/FAQ";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";

const serviceRepImage = {
  src: AssignmentWritingImage,
  alt: "Article review writing",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my assignment with high quality?",
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
    question: "Will a real professional write my assigment?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the final draft of the assignment?",
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
    question: "Can I get a plagiarism report for free?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Of course. With our online assignment writing service, you can request
          a free plagiarism report. We’ll send it to you together with your
          order.
        </p>
        <p>
          However, even if you skip this step, rest assured: every order
          undergoes multiple plagiarism checks before sendoff, without
          exception. We ensure an originality level of at least 96% following
          academic standards, with properly formatted citations and no
          intentional or accidental plagiarism, whether or not you request a
          report.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "How do I describe my assignment properly?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Our assignment writing service online will guide you through the
          process with our comprehensive order form. It will require you to
          specify:
        </p>
        <UnorderedList>
          <li>Deadline;</li>
          <li>Academic level;</li>
          <li>Assignment and service type;</li>
          <li>Language;</li>
          <li>Word count/size;</li>
          <li>Subject;</li>
          <li>Citation style;</li>
          <li>Number of sources;</li>
          <li>Topic and order description.</li>
        </UnorderedList>
        <p>
          For best results, we advise you to add any unusual requirements to the
          order description. Those may concern the sources, formatting, or
          structure.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question: "Do you have a refund and review policy?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Of course. To give you peace of mind, we have developed an extensive
          Refund Policy that covers a variety of unlikely scenarios. We’ll
          refund you if:
        </p>
        <UnorderedList>
          <li>You cancel the order before we start working on it</li>
          <li>We deliver your order late;</li>
          <li>Assignment and service type;</li>
          <li>You’re dissatisfied with the order’s quality after revisions;</li>
          <li>Your order doesn’t meet the originality requirements.</li>
        </UnorderedList>
        <p>
          You can request a refund within six months after the original
          transaction date.
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: "How muach time do you need to create an assignment?",
    answer:
      "The time required to create an article review is not set in stone. It depends on a number of variables. However, we do have a 3-hour deadline option available for those who need a quick turnaround. It ensures that our team will prioritize your assignment and complete it ASAP. Before placing an urgent order, it's best to contact our 24/7 customer support to see whether your assignment can be finished on time.",
  },
];

const Assignment = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Online assignment writing service: Let us worry about your assignment"
        openningStatement="Join our happy customers – and get the prompt assignment writing service you deserve. Our experts will assist you while you focus on what matters more, be it your career, an upcoming exam, or leisure."
        getServiceButtonText="Get help"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="What you get with our service"
        benefitsDescription="Over the past decade, we’ve perfected our platform and policies to make sure we leave every customer happy with our services."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my assignment"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Doubting our pledge to provide students with top-tier assignment writing assistance when they need it? Check this out:"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="What our customers think about our assignment writing servi"
        reviewsSectionDescription="Read real comments and reviews about EssayPro writing solutions left by our customers."
        serviceToTry="Assignment writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our assignment writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our assignment writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="You're only 3 steps away from a quality assignment"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver a high quality assignment. All you need to do is submit the details of your assignment and sit back knowing the best and most qualified writer is working on your assignment."
        stepOneTitle="Describe your assignment"
        stepOneDescription="Our order form will guide you through this step, from deadlines to the formatting style. You’ll see a quote for your order based on the academic level, urgency, and assignment type. Spare no detail in the order description!"
        stepThreeTitle="Receive your assigment"
        stepThreeDescription="Assignment writing service will let you know when your assignment is ready. Review it, ask for free edits to refine it if necessary, and pay us once you’re done. Don’t forget to leave a review!"
      />
      <FAQ faqArray={faqData} serviceTitle="assigmnet writing service" />
      <OtherServicesSection
        servicesToExclude={[8]}
        currentServicePage="assignment writing service"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our assignment writing service">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Reliable assignment writing service covers 150+ subjects" />
            <p>
              Our wide range of experts is what makes High-Quality Essay a
              powerhouse among similar platforms. We can be your geometry,
              physics, economics, or sociology essay writing service. And the
              list goes on!
            </p>
            <p>
              Here’s just a short list of the most popular disciplines our
              experts can get online assignment help:
            </p>
            <UnorderedList>
              <li>Algebra, geometry, statistics;</li>
              <li>English, linguistics, and literature;</li>
              <li>History;</li>
              <li>Programming and computer sciences;</li>
              <li>Economics and finance;</li>
              <li>Marketing;</li>
              <li>Accounting;</li>
              <li>Geography;</li>
            </UnorderedList>
            <p>
              But that’s not all. Our experts are well-versed in all common and
              uncommon assignment types. They can help you not just with writing
              from scratch; they can also proofread or edit your draft. And they
              don’t shy away from challenges: there’s no such thing as an order
              too complex for them!
            </p>
            <p>
              Here’s a short overview of the assignment types we can ace for you
              at High-Quality Essay:
            </p>
            <UnorderedList>
              <li>Essays;</li>
              <li>Article reviews;</li>
              <li>Case studies;</li>
              <li>Lab reports;</li>
              <li>Presentations and speeches;</li>
              <li>Multiple-choice and short-answer questions;</li>
              <li>Problem-solving and calculations.</li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Cheap assignment writing services - how to pay" />
            <p>
              We strive to ensure that every time you say “do my assignment,”
              you get an order that meets your expectations and your writer gets
              fairly remunerated for their work. That’s why we require our
              customers to add funds to their account before the writer starts
              working on the order.
            </p>
            <p>
              This deposit will remain in your account until you get your
              assignment writing help and confirm you’re happy with it. You’re
              in charge of releasing the payment to your writer.
            </p>
            <p>
              To keep your payment data safe and secure, our payment providers
              and gateways use industry-standard encryption. You can add funds
              to your account using Mastercard, Maestro, Visa, American Express,
              Discover, JCB, and Diners Club.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="How we ensure every order’s quality" />
            <p>
              Once your writer finishes working on your assignment, it doesn’t
              immediately land in your inbox. Instead, it gets transferred to
              our internal quality assurance (QA) team. Here’s how it upholds
              the quality standards of our custom assignment services:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">‍Proofreading and editing. </span>
                Our editors will be a fresh pair of eyes to proofread and edit
                the draft. They will also catch any potential issues in the
                work’s flow or logic that may have gone unnoticed otherwise.
              </li>
              <li>
                <span className="font-bold">Requirements check. </span>They will
                also compare the draft to the initial order description you’ve
                provided to make sure it meets your every requirement to the
                letter. That concerns every aspect of your order, from
                formatting to sources.
              </li>
              <li>
                <span className="font-bold">Plagiarism check. </span>We ensure
                that our assignments and essays for sale are highly original. To
                achieve this, our editors check every draft, and originality
                reports are available upon request.
              </li>
            </UnorderedList>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Who are our writers?" />
            <p>
              Our experts are the key reason why over 99% of our customers are
              happy with our services. Without them, High-Quality Essay wouldn’t
              be what it is.
            </p>
            <p>
              Here’s how we screen those who want to become High-Quality Essay’s
              assignment writers:
            </p>
            <UnorderedList>
              <li>We verify academic credentials and their relevance;</li>
              <li>We review the candidate’s writing samples;</li>
              <li>
                We ask the approved candidates to complete a test assignment;
              </li>
              <li>We select the best to join us on a trial period.</li>
            </UnorderedList>
            <p>High-Quality Essay’s writers are the cream of the crop who:</p>
            <UnorderedList>
              <li>
                Are fluent in academic writing and their chosen language of
                work;
              </li>
              <li>Are knowledgeable in their area of expertise;</li>
              <li>
                Have been providing essay writer help with a rich background of
                experience;
              </li>
              <li>Hold a degree in their field (undergraduate or higher).</li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="How our professional assignment writers ace your orders" />
            <p>
              What happens once you make a deposit and your writer starts to
              help in assignment writing? Here’s a peek behind the curtain on
              how our experts approach orders:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">‍Order review. </span>To make sure
                everyone is on the same page regarding your expectations, we may
                reach out to you to clarify certain requirements.
              </li>
              <li>
                <span className="font-bold">
                  ‍Initial research and synthesis.{" "}
                </span>
                Our expert will review the materials you might’ve supplied and
                do their own independent research that they will build on later.
              </li>
              <li>
                <span className="font-bold">‍Outline and structure. </span>
                They’ll pinpoint the thesis statement and outline the whole work
                before writing the first draft.
              </li>
              <li>
                <span className="font-bold">Writing. </span>The expert will then
                craft the first draft, let it sit for a bit for the best
                results, and proofread and edit it for cohesiveness, logical
                flow, and engaging reading.
              </li>
              <li>
                <span className="font-bold">‍Formatting. </span>All of the
                sources will be properly referenced according to the desired
                citation style. You will also receive an outline, title page,
                and references page.
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="How affordable is your professional assignment writing service?" />
            <p>
              We strive to make our services as easy on your pocket as possible.
              However, we also want our writers to get fairly compensated for
              their work.
            </p>
            <p>
              That’s why our service has a flexible pricing policy. In a
              nutshell, our per-page rate fluctuates based on:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Urgency: </span>the faster you need
                your order to be ready, the more it’ll cost you.
              </li>
              <li>
                <span className="font-bold">‍Academic level: </span>the more
                advanced it is, the higher our rate is, as well.
              </li>
              <li>
                <span className="font-bold">Assignment type: </span>some
                assignments are more complex by nature, requiring more effort
                and expertise.
              </li>
            </UnorderedList>
            <p>
              To help you save a buck, we offer discounts for multi-page orders.
              They range from 5% to 40% off the total cost and get applied
              starting with the second page you order. We also advise you to
              place your orders well in advance to get a lower rate.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Why should you use our assignment writing service with peace of mind?" />
            <p>
              We’ve designed our assignment services to give you peace of mind
              throughout the whole process. Here’s why you don’t have to worry
              about your “write my essay online” request:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">‍Internal quality assurance. </span>
                Our dedicated editors will double-check every draft to make sure
                it meets the customer’s requirements and is highly original.
              </li>
              <li>
                <span className="font-bold">
                  Unlimited edits at no extra charge.{" "}
                </span>
                Most of the time, a so-so order needs a bit of refining to be
                turned into a gem. We recognize this. So, we allow you to ask
                for as many edits as you want to – for free!
              </li>
              <li>
                <span className="font-bold">Money-back guarantee. </span>In the
                unlikely event you’re dissatisfied with our services after
                edits, we’ll refund you according to our Refund Policy.
              </li>
              <li>
                <span className="font-bold">Transparent pricing. </span>You’ll
                see our quote as you fill out the order form. We have no hidden
                or surprise fees; you can get things like a plagiarism report
                and formatting free of charge.
              </li>
            </UnorderedList>
            <p></p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default Assignment;
