import UnorderedList from "@/components/services/detailedServiceDescription/UnorderedList";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
import ArticleReviewImage from "@/assests/ArticleReview.jpg";
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

const serviceRepImage = {
  src: ArticleReviewImage,
  alt: "Article review writing",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my article review with high quality?",
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
    question: "Will a real professional work on my article review?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the article review?",
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
    question: "Can you write my article for cheap?",
    answer:
      "If you decide to order an article review from our essay service, you can count on quality work at an affordable price. We aim to cater to a variety of budgets and offer competitive rates for our services. Plus, you can get free bonuses with your order. These include an outline, title page writing, formatting, unlimited edits, and an originality report upon your request. Also, don't forget about our handy 24/7 customer support.",
  },
  {
    id: 2,
    question: "What payment option does your service offer?",
    styledAnswer: (
      <>
        <p className="mb-2">
          Our service cares about customer satisfaction. That’s why we’ve done
          everything possible to make the payment process as simple as we could.
          We accept all major credit cards, including Mastercard, Maestro, Visa,
          American Express, Discover, JCB, and Diners Club International, for
          all types of article reviews.
        </p>
        <p>
          On top of that, we thought through the security of your payments. All
          of them are protected with the bank-level security measures to ensure
          safety of your financial information.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question: "Do you have a refund and review policy?",
    answer:
      "In addition to the many perks offered at High-Quality Essay, you can pay someone to write your college essay with the confidence of a 60-day revision policy and a money-back guarantee. That means you can request multiple changes to your assignment or even request to get help from another writer. However, if none of our efforts fix your issue, you can check our Refund Policy.",
  },
  {
    id: 4,
    question: "How muach time do you need to create an article review?",
    answer:
      "The time required to create an article review is not set in stone. It depends on a number of variables. However, we do have a 3-hour deadline option available for those who need a quick turnaround. It ensures that our team will prioritize your article review and complete it ASAP. Before placing an urgent order, it's best to contact our 24/7 customer support to see whether your assignment can be finished on time.",
  },
  {
    id: 5,
    question: "an I specify the format of my article review?",
    answer:
      "When placing an order on our service, you can ask your article review writer to follow a specific format. Whether you need the APA, MLA, Chicago, or any other style, our qualified authors will tailor the article review according to your preferred format. Simply provide us with the guidelines and formatting details, and we will ensure that your article review is delivered exactly as you desire.",
  },
  {
    id: 6,
    question: "How does your article review writing service ensure quality?",
    answer:
      "Professional article review writers play a significant role in producing quality assignments. That’s why we approach the recruiting process using rigorous criteria. However, to ensure the high quality of each article review we write, we’ve also built our work process around several key steps. First, we do in-depth research and fact-checking. Following this, we analyze the article's structure and main arguments. Finally, we proofread and edit the review for grammar and clarity of expression.",
  },
];

const ArticleReview = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Article review writing service: 100% human-written article reviews from verified professionals"
        openningStatement="Make the most of your time with professional academic writing support."
        getServiceButtonText="Order a review"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Why use our article review writing services"
        benefitsDescription="Discover the top 6 benefits of High-Quality Essay services that will transform your academic journey."
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my article review"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Doubting our pledge to provide students with top-tier writing assistance when they need it? Check this out:"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="What customers say about us"
        reviewsSectionDescription="Read real comments and reviews about EssayPro writing solutions left by our customers."
        serviceToTry="Article review writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our article review writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our article review writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="You're only 3 steps away from a quality review"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver a high quality article review. All you need to do is submit the details of your article review and sit back knowing the best and most qualified writer is working on your article review."
        stepOneTitle="Describe your order"
        stepOneDescription="Provide details on the type of paper, topic, academic style, word count, and due date."
        stepThreeTitle="Receive the review"
        stepThreeDescription="Receive your completed task and make sure it meets your instructions. Make a payment and leave your feedback."
      />
      <FAQ faqArray={faqData} serviceTitle="article review writing service" />
      <OtherServicesSection
        servicesToExclude={["Article Review Writing"]}
        currentServicePage="article review writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our custom case study writing services">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Who can benefit from our article review services" />
            <p>
              If you have stumbled upon the High-Quality Essay service, you are
              in luck! Our services are designed to help students and
              professionals alike. Whether you are a busy student who needs
              assistance with an assignment or a researcher who wants a second
              opinion on your work, our team of experienced writers can provide
              the help you are searching for. We cater to a wide range of
              customers in need of a professional service.
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Students </span>are sure to use our
                article review support for academic purposes. For example, to
                analyze the content or structure of a scientific article they
                need to review for a class or for another assignment.
              </li>
              <li>
                <span className="font-bold">Researchers </span>can take
                advantage of High-Quality Essay by evaluating the significance
                and quality of research in their field of study. Plus, they can
                gain perspective on their own work if necessary.
              </li>
              <li>
                <span className="font-bold">Industry experts </span>can keep up
                with the newest studies, technology, and trends in the field
                they work in. In addition, they can use the article review
                support to compare different approaches or methodologies used by
                experts in their industry.
              </li>
              <li>
                <span className="font-bold">Large companies and SMEs </span>can
                stay up-to-date on technological advancements that might affect
                their market position, product offerings, or business strategy.
              </li>
              <li>
                <span className="font-bold">Publishers and journalists </span>
                can utilize article review support to ensure the accuracy and
                credibility of the information they publish. All to maintain
                their reputation as reliable sources of information.
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Discover the power of our writing process" />
            <p>
              Despite the high-quality article reviews we deliver, we keep our
              writing process simple and straightforward. Once we receive your
              article and detailed format instructions, we’ll assign the task to
              our most qualified writer. We can bounce ideas off each other to
              ensure that your vision is fully understood. After that, our
              writer will start working on your article to provide you with an
              all-encompassing article review. It will include:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">‍Captivating introduction. </span>
                The introductions we compose are sure to grab the reader’s
                attention and set the right tone for the rest of the review.
              </li>
              <li>
                <span className="font-bold">
                  ‍Comprehensive analysis of the article’s main points.{" "}
                </span>
                Our pro writer will delve deep into the article’s main arguments
                and provide a thorough evaluation of their validity.
              </li>
              <li>
                <span className="font-bold">
                  ‍Critical examination of the author’s arguments and supporting
                  evidence.{" "}
                </span>
                With High-Quality Essay’s article review services, you are bound
                to receive a work that lists all flaws or inconsistencies of the
                research while offering a balanced perspective on its
                argumentation.
              </li>
              <li>
                <span className="font-bold">‍Clear conclusion. </span>To sum up
                all your findings and analysis, our pro writer will provide a
                clear and concise conclusion that highlights the strengths and
                weaknesses of the article. In addition, we will evaluate the
                overall quality and relevance of the research.
              </li>
            </UnorderedList>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="Reasons to order an article review from High-Quality Essay" />
            <p>
              Students often attempt to write their own reviews based on
              examples they found online. Nonetheless, our service will save you
              time and ensure that everything is done right. High-Quality Essay
              is a go-to choice when it comes to quality and cheap academic
              writing support.
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">
                  Smooth-running ordering process.{" "}
                </span>
                We’ve made our website user-friendly and our ordering process
                hassle-free, so anyone can hire a professional writer fast and
                with confidence.
              </li>
              <li>
                <span className="font-bold">Time-tested writers. </span> All of
                our talented wordsmiths have been writing high-quality academic
                papers for years. They combine the expertise and knowledge
                necessary to deliver outstanding results.
              </li>
              <li>
                <span className="font-bold">Easy on your wallet. </span>Forget
                overpaying for essential academic assistance. With our review
                article writing service, you can save money without sacrificing
                quality.
              </li>
              <li>
                <span className="font-bold">
                  Content-specific article reviews.{" "}
                </span>
                Our highly experienced professional writers possess the
                necessary skills to expertly analyze the content of any type of
                academic work - be it a research paper, scientific article, or
                literature review.
              </li>
              <li>
                <span className="font-bold">
                  Advanced anti-plagiarism checks.{" "}
                </span>
                We’re confident that every piece of work we deliver is written
                from scratch and has high originality score. To ensure that, we
                double-check every assignment using advanced anti-plagiarism
                software.
              </li>
            </UnorderedList>
            <p>
              We’ll do an excellent job, regardless of the article review type.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="High-Quality Essay's article review guarantees" />
            <p>
              Our article review writing service offers a student-focused
              approach to every single order of our article reviews. To make
              this happen, High-Quality Essay keeps a few policies in place.
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">High originality score. </span>We do
                not tolerate plagiarism or copied content. Therefore, all our
                reviews are written from scratch, ensuring that we deliver
                personalized and unique work to our customers. We also run a
                plagiarism check to be confident that the originality score is
                at least 96%. Request a free originality report to see for
                yourself.
              </li>
              <li>
                <span className="font-bold">Revision policy. </span>Request as
                many edits as you need after receiving the final draft of your
                review at no additional cost. Implement feedback you got on
                paper, make changes according to your preferences, and ensure
                that the final version meets all your requirements.
              </li>
              <li>
                <span className="font-bold">Money-back policy. </span>If after
                all the changes your instuctions are not met, you can check our
                Refund Policy. Refund requests are allowed within 60 days of
                receiving the final draft.
              </li>
            </UnorderedList>
            <p></p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default ArticleReview;
