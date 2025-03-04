import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import ArgumentativeEssayImage from "@/assests/ArgumentativeEssay.jpg";
import AssuranceSection from "@/components/services/AssuranceSection";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";
import ServiceBonuses from "@/components/services/ServiceBonuses";
import OrderingSteps from "@/components/services/OrderingSteps";
import FAQ from "@/components/common/FAQ";
import OrderedList from "@/components/services/detailedServiceDescription/OrderedList";
import OtherServicesSection from "@/components/services/OtherServicesSection";
import ServiceDescriptionContainer from "@/components/services/detailedServiceDescription/ServiceDescriptionContainer";
import HeadingThreeTitle from "@/components/services/detailedServiceDescription/HeadingThreeTitle";
import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";

const serviceRepImage = {
  src: ArgumentativeEssayImage,
  alt: "argumentative essay",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my argumentaive essay with high quality?",
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
    question: "Will a real professional work on my argumentaive essay?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the argumentative essay?",
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
    question: "What formatting style do you use?",
    styledAnswer: (
      <>
        <p className="mb-2">
          When customers order from us, they’re often focused on what is stated
          in the body of their paper. But in higher education, formatting is
          also extremely important. Having a consistent paper that conforms to
          academic standards can be the difference between an assignment that
          does well and one that doesn’t.
        </p>
        <p>
          With our service, you don’t have to worry about formatting — we take
          the exact requirements you send to us and format your assignment
          accordingly. If you have a task with an unusual formatting style,
          contact our customer service team and they’ll make sure you get
          someone experienced in that area.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "Can I add some details after I made order?",
    styledAnswer: (
      <>
        <p className="mb-2">
          After having ordered, your order’s status will change to &ldquo;in
          progress.&rdquo; That means we have already started working on your
          assignment. If you have some other requirements, you can still request
          them in the one-on-one chat with us.
        </p>
        <p className="mb-2">
          Sometimes, you may have a file or two that you would like to upload.
          You can also add them to your order by following the steps below in
          your account:
        </p>
        <OrderedList>
          <li>Orders</li>
          <li>Active orders</li>
          <li>Click the order you want to add files to</li>
          <li>Clik the add files button</li>
        </OrderedList>
        <p>
          Please be mindful that having to take into account extra requirements
          or last-minute changes may result in your final price changing, which
          is why it is best if you give as much information as possible at the
          very start — it also makes our job much easier.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question:
      "What are the benefits when I pay for argumentative essay at High-Quality Essay?",
    styledAnswer: (
      <>
        <p className="mb-2">
          We want to give you the biggest bang for your buck, which is why we
          include a range of free features, such as a title page, reference
          page, and outline of your order.
        </p>
        <p className="mb-2">
          But that’s not all! On request, we can also attach an originality
          report to your order, demonstrating that we have crafted your essay
          from scratch based on the ideas in your text, formatting requirements,
          and list of sources to be used.
        </p>
        <p className="mb-2">
          Lastly, once you have downloaded and checked your argumentative essay,
          you can still request as many changes as needed.
        </p>
        <p>
          All these features are why we have so many repeat customers — they
          really appreciate everything we include in their orders.
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: "How do I ge the final copy of my argumentaive essay?",
    styledAnswer: (
      <>
        <p className="mb-2">
          When you’ve completed the order form, our writers will get to work
          straight away, diligently taking all the information you gave and
          producing an original and high-quality task.
        </p>
        <p>
          As our pressional writers have put the final touches on your essay,
          you’ll receive an email notification telling you that your essay is
          ready. All you have to do is go to your account, download your paper,
          and make sure it is exactly as you requested. Review it in terms of
          content, formatting, and referencing. If something needs to be edited,
          simply message us, and if not, that’s it! Transfer your funds, and we
          would be grateful if you leave a review.
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: "Can you ensure the safety of my information?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Absolutely! Keeping your data safe is our top priority. Everything on
          our site, is fully secure. Plus, we only work with trusted payment
          partners to make sure all your transactions are safe. We continuously
          monitor our systems to prevent any security breaches and ensure your
          information remains protected.
        </p>
        <p>
          If you have any questions about how we protect your information, just
          give our customer service team a shout, they’re always happy to help!
        </p>
      </>
    ),
  },
];

const ArgumentativeEssay = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Argumentative essay writing service: Get a knockout task in an instant!"
        openningStatement="Our experts are here to craft outstanding argumentative essays, helping you reduce your workload in minutes."
        getServiceButtonText="Get an argumentative essay now"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Top-6 reasons to make order at our service"
        benefitsDescription="Trust your argumentative essay to experts who are saving thousands of students from writing hell each year at very affordable prices"
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my argumentaive essay"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Wondering whether High-Quality Essay will deliver what is promises? We’ve got you covered"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Latest customer feedback"
        reviewsSectionDescription="Want to see why we are rated so highly by our customers? Check out the latest reviews of our service from learners just like you."
        serviceToTry="argumentative essay writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our argumentative essay writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our argumentative essay writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="Get an argumentative essay in 3 easy steps"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver high quality work. All you need to do is submit the details of your argumentaive essay and sit back knowing the best and most qualified writer is working on your paper."
        stepOneTitle="Tell us your requirements"
        stepOneDescription="Share your assignment’s instructions with us, including any sources, formatting requirements, or even your previous work samples, and start browsing proposals from writers."
        stepThreeTitle="Download and get your order"
        stepThreeDescription="As soon as your argumentative essay is complete, you will get an email notification. Check that everything is exactly as requested, and then transfer payment to your expert."
      />
      <FAQ
        faqArray={faqData}
        serviceTitle="argumentaive essay writing service"
      />
      <OtherServicesSection
        servicesToExclude={[4]}
        currentServicePage="argumentative essay writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our custom annotated bibliography writing services">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Why should I choose High-Quality Essay to write my argumentative essay?" />
            <p>
              We put our customers’ experience front and center in our work.
              Here’s how we protect students’ interests when they choose our
              service:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">
                  We have a dedicated editing team to ensure order quality.
                </span>{" "}
                This team is in charge of double-checking our writers’ drafts,
                polishing them, and ensuring they’re highly unique and
                error-free.
              </li>
              <li>
                <span className="font-bold">We have a refund guarantee.</span>{" "}
                If we fall short of your requirements and even revisions don’t
                meet your needs, we’ll offer you a refund according to our
                Refund Policy.
              </li>
              <li>
                <span className="font-bold">
                  We ask you to provide as little personal information as
                  possible.
                </span>{" "}
                You can get started with just your email address — argumentative
                essay writing services don’t need to know anything about you.
              </li>
              <li>
                <span className="font-bold">
                  We’ve secured our payment process.
                </span>{" "}
                Thanks to our partner, the checkout process is 100% our security
                meets bank-level standards.
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Key features of our custom argumentative essay writing service" />
            <p>
              We started this service because we wanted to make it as easy as
              possible for customers to handle their assignments, no matter
              their circumstances. If you’ve got a workload that’s getting you
              down, you can turn to us 24/7 with requests for a quality
              argumentative essay writer or a research paper writer service,
              even if your completion date is drawing nearer.
            </p>
            <p>
              What you’ll get from working with us is an experienced
              professional who is there to assist you with your task and answer
              any of your questions through a one-on-one chat. The final piece
              of work will be without any grammatical errors and expertly
              formatted according to your instructions.
            </p>
            <p>
              Students come back to us for the simple reason that we are
              extremely reliable while offering the following great benefits:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">‍On-time delivery.</span> Our
                professional writer always works as hard as possible to ensure
                that your order is finalized as soon as possible, giving you
                time to check everything before the due date.
              </li>
              <li>
                <span className="font-bold">Affordable prices.</span> Learners
                are often on a budget, which is why we make our prices as
                affordable as possible. Our service also has discounts, sales,
                and free features!
              </li>
              <li>
                <span className="font-bold">Originality.</span> Every task, no
                matter how small, is done from scratch. We provide proof of
                originality upon your request.
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="How we vet every argumentative essay writers" />
            <p>
              You expect your order to be handled by a knowledgeable, skillful
              writer. We understand this desire to make your investment as
              efficient and rewarding as possible. So, our argumentative essay
              writing service makes sure we only assign your order to the most
              proficient writers. Here’s how we do it:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">
                  We conduct preliminary screening.
                </span>{" "}
                If an applicant isn’t a native English speaker, doesn’t hold a
                degree, or lacks a background in academic writing, we
                immediately decline them.
              </li>
              <li>
                <span className="font-bold">
                  We ask to see the applicant’s writing samples.
                </span>{" "}
                If they’re on par with our standards, we proceed with a test
                assignment that’s similar to a real request to write my
                argumentative essay.
              </li>
              <li>
                <span className="font-bold">
                  We sign the applicant up for a trial period.
                </span>{" "}
                Their performance in real-world conditions determines whether
                they’re worthy to be in our permanent talent pool. Even once a
                writer successfully completes their trial period, we keep a
                close eye on their performance to make sure they don’t slip up!
              </li>
            </UnorderedList>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Reasons to choose our argumentative essay writing service" />
            <p>
              If this is your first time considering hiring a professional to
              take care of an assignment, you may hesitate — understandably so.
              Here’s what we often hear from our grateful customers when it
              comes to why they sought out our argumentative essay writing
              services:
            </p>
            <UnorderedList>
              <li>
                “A professional essay writer can ace any assignment, allowing me
                to handle challenging assignments in a hassle-free manner.”
              </li>
              <li>
                “I got an argumentative essay and It helped me avoid pulling an
                all-nighter because I had tons of other assignments due.”
              </li>
              <li>
                “I couldn’t do it myself because I work and study at the same
                time.” “I needed a break because I had too much on my plate.”
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Be sure that we will make your argumentative essay of high quality" />
            <p>
              It can be overwhelming to have a few assignments due at once,
              especially if one is an argumentative essay.
            </p>
            <p>
              This type of task requires lots of planning, critical thinking,
              and often, research to properly convince the reader of the point
              you are putting forward.
            </p>
            <p>
              By choosing the option to use a custom argumentative essay writing
              service, you can get a work produced by an expert without having
              to spend hours doing painstaking research.
            </p>
            <p>
              This will free you up to finish your other assignments, work more,
              or simply enjoy some free time — something everyone deserves.
            </p>
            <p>
              To ensure you get some of the best assistance around, we put all
              our experts through tests and mock tasks, authenticate their
              degrees, and interview them to make sure they have the
              communication and planning skills required to get you high-quality
              results.
            </p>
            <p>
              Simply place your order, reach out to our customer support team,
              who will make sure you get argumentative essay help on your
              subject field quality.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default ArgumentativeEssay;
