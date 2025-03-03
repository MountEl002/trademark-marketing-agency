import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import CapstoneProjectImage from "@/assests/CapstoneProject3.png";
import { AssuranceItem, FAQItem } from "@/types/servicesPages";
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
  src: CapstoneProjectImage,
  alt: "Capstone project writing",
};

const assuranceItmes: AssuranceItem[] = [
  {
    id: 1,
    question: "Can you write my capstone project with high quality?",
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
    question: "Will a real professional work on my capstone project?",
    description:
      "All papers are written by experienced human writers with real qualifications. No AI tools here. Your writer will carefully follow your instructions, use reliable sources, and create something tailored just for you. You can even request a plagiarism or AI check for extra peace of mind - it’ll show at least 96% originality.",
  },
  {
    id: 4,
    question: "What if I’m not happy with the capstone project?",
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
    question: "Why should I choose your capstone paper writing service?",
    styledAnswer: (
      <>
        <p>
          Choosing the right service for capstone project help means finding one
          that offers not only quality but also the convenience you need during
          busy semesters.
        </p>
        <p>
          Why choose us? For years, we’ve stood by students, helping to make
          academic life a little easier. From handpicked experts to
          student-focused guarantees, we understand exactly what our customers
          need when they turn to us for help. Over the years, we’ve refined our
          services to include everything necessary to ensure students feel
          satisfied after working with us.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "How do I ensure my papers are without plagiarism?",
    styledAnswer: (
      <>
        <p>
          When you request our capstone project writing services, paper
          originality shouldn’t be among your concerns. We ensure that all our
          papers are highly unique, with originality scores of 96% or higher.
          How do we do that? First, we have a strict no-plagiarism policy. So,
          each text we deliver is written from scratch. When an expert uses an
          external source, they are required to cite it.
        </p>
        <p>
          On top of that, our quality assurance specialists check the
          originality of each text using relevant tool. Before sending a
          complete essay, they ensure the work is of the highest quality. You
          can also ask for a free plagiarism report just to make sure.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question:
      "What guarantees do you provide when you write my capstone project?",
    styledAnswer: (
      <>
        <p>Here are the key guarantees we know matter most to our customers:</p>
        <UnorderedList>
          <li>
            <span className="font-bold">On-time delivery: </span>We understand
            how crucial deadlines are in academics. Our service is designed to
            handle even the tightest timelines, ensuring high-quality work is
            delivered on time.
          </li>
          <li>
            <span className="font-bold">Data security you can trust: </span>
            Your personal and payment information is protected with advanced
            encryption, so you can request help with capstone project with
            confidence.
          </li>
          <li>
            <span className="font-bold">Satisfaction guaranteed: </span>If your
            work isn’t exactly what you requested, we’ll make it right. You can:
            <UnorderedList>
              <li>
                Collaborate with your writer to adjust your capstone projects.
              </li>
              <li>Request a new writer through our support team.</li>
              <li>Opt for a refund under our Refund Policy.</li>
            </UnorderedList>
          </li>
        </UnorderedList>
        <p>
          Your capstone project will be in the hands of someone who not only
          knows your subject but also knows how to deliver high-quality,
          tailored work.
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: "What qualifications will my capstone project writer have?",
    styledAnswer: (
      <>
        <p>
          Our partner writers are carefully selected to ensure they have the
          expertise needed to handle your capstone project. Here’s what you can
          expect with High-Quality Essay:
        </p>
        <UnorderedList>
          <li>
            <span className="font-bold">Higher degrees: </span>Every writer
            holds educational degrees, giving them a deep understanding of the
            subject matter.
          </li>
          <li>
            <span className="font-bold">Specialized expertise: </span> We match
            your project with a writer who has experience in your specific
            discipline.
          </li>
          <li>
            <span className="font-bold">Proven skills: </span>Writers undergo a
            rigorous screening process, including academic tests and
            assessments, to ensure they can handle the complexity of capstone
            projects.
          </li>
        </UnorderedList>
        <p>
          Your capstone project will be in the hands of someone who not only
          knows your subject but also knows how to deliver high-quality,
          tailored work.
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: "What is the minimum deadline for my order?",
    styledAnswer: (
      <>
        <p>
          When you buy capstone project, you’re in control of the deadline. Our
          writing team works hard to complete your order as quickly as possible.
          While the fastest turnaround time is just 3 hours, the exact delivery
          depends on factors like the length, topic, and complexity of your
          project.
        </p>
        <p>
          If you’d like to know the precise timeline for your order, feel free
          to reach out to our customer support team - they’ll be happy to assist
          you. Plus, if the deadline for your capstone paper isn’t too tight,
          you can take advantage of our discounts for early orders.
        </p>
      </>
    ),
  },
  {
    id: 6,
    question: "Do I get any free services with my order?",
    styledAnswer: (
      <>
        <p>
          Along with your capstone project, here’s what we include for free:
        </p>
        <UnorderedList>
          <li>
            <span className="font-bold">Plagiarism reports: </span>Request a
            detailed plagiarism report confirming the high originality score of
            your paper - completely free of charge.
          </li>
          <li>
            <span className="font-bold">Unlimited revisions: </span> After
            getting your paper, you have 60 days to request as unlimited free
            revisions as you need.
          </li>
          <li>
            <span className="font-bold">Professional formatting: </span>Whether
            your program requires APA, MLA, Chicago, or another style, we’ll
            make sure it’s done perfectly, so your capstone project is ready to
            go.
          </li>
          <li>
            <span className="font-bold">A polished title page: </span>Every
            paper includes a custom title page designed to match your program’s
            requirements.
          </li>
        </UnorderedList>
        <p>
          Request &ldquo;write my capstone project&rdquo; now! We’ve got your
          back every step of the way.
        </p>
      </>
    ),
  },
];

const CapstoneProject = () => {
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle="Capstone project writing service: Get your perfect capstone project from real professionals"
        openningStatement="Receive fast, reliable help from professional capstone project writers, completely free of AI!"
        getServiceButtonText="Order a capstone project now"
      />
      {/* Essay Writing service Benefits summary */}
      <ServiceBenefits
        benefitsSectionTitle="Why choose our professional service"
        benefitsDescription="Whatever academic help you need, High-Quality Essay got you! Check out the free benefits that comes with each capstone project order:"
        serviceRepImage={serviceRepImage}
        serviceButtonText={"Write my capstone project"}
      />
      {/* Assurance Section */}
      <AssuranceSection
        assuranceSectionTitle="Doubting our pledge to provide students with top-tier writing assistance when they need it? Check this out:"
        assuranceItems={assuranceItmes}
      />
      <ServiceReviewsSection
        reviewsSectionTitle="Reviews about our capstone project writing service"
        reviewsSectionDescription="Find out what other students think about our capstone project writers, their speed, and quality of their work."
        serviceToTry="Capstone project writing service"
      />
      <ServiceBonuses
        bonusSectionTitle="Bonuses and free features that come with our capstone project writing service"
        bonusSectionDescription="Many students frequently struggle to make ends meet, that’s why we keep costs reasonable without compromising quality. Besides, we offer lot of discounts, special offers, and bonuses to make our capstone project writing service even more affordable!"
      />
      {/* Creating an order Steps */}
      <OrderingSteps
        orderingStepsTitle="3 steps to use our capstone writing service"
        orderingStepsDescription="At High-Quality Essay, we don't give you the burden of choosing a writer wondering wether they will deliver a high quality capstone project. All you need to do is submit the details of your capstone project and sit back knowing the best and most qualified writer is working on your capstone project."
        stepOneTitle="Share paper guidelines"
        stepOneDescription="Create an account and complete the order form with your project information to connect with our qualified experts."
        stepThreeTitle="Receive your order"
        stepThreeDescription="Once your capstone project is ready, you will get an email notification. Check the results, ask for edits if needed, and pay your writer."
      />
      <FAQ
        faqArray={faqData}
        serviceTitle="Everything you need to know about case study writing service"
      />
      <OtherServicesSection
        servicesToExclude={["Capstone Project Writing"]}
        currentServicePage="capstone project writing"
      />
      <ServiceDescriptionContainer serviceDescriptionTitle="More details about our custom case study writing services">
        <div className="pr-4">
          <div>
            <HeadingThreeTitle text="Why do students turn to our service?" />
            <p>
              There are many reasons why students turn to a paper writing
              service online for help with their capstone project. Here’s how we
              make the process easier for you:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Tight deadlines: </span> If you are
                racing against the clock to finish your capstone project, our
                team delivers high-quality, custom work on time, so you never
                have to stress about missing a deadline.
              </li>
              <li>
                <span className="font-bold">Tackling complex projects: </span>
                Capstone projects can be challenging, whether they require
                in-depth research, data analysis, or creative problem-solving.
                Our experienced writers are equipped to handle even the most
                demanding tasks with precision and expertise.
              </li>
              <li>
                <span className="font-bold">
                  Balancing life and academics:{" "}
                </span>
                Between classes, work, and personal commitments, time is often
                in short supply. Let us take the load off so you can focus on
                other priorities while we handle your project.
              </li>
              <p>
                We specialize in providing a custom capstone project writing
                service that’s tailored to your unique needs. So, if you’re
                thinking, “can I really trust someone to do my project for me?”
                - the answer is a resounding yes.
              </p>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="Capstone project writing services with a personal approach" />
            <p>
              We understand that students need more than just a completed paper
              but also confidence in its authenticity. That’s why originality is
              at the heart of everything we do. Each paper is crafted from
              scratch, ensuring a high originality score of 96% or higher. To
              back this up, our quality assurance team rigorously checks every
              capstone project for plagiarism. For added peace of mind, we
              provide a free originality report upon your request.
            </p>
            <p>
              We also believe that great results come from collaboration. From
              the moment you place your order, the process is personalized to
              fit your needs. You can share detailed instructions, upload
              relevant materials, and specify exactly what you’re looking for.
              This helps our writers approach your project with a clear
              understanding of your goals while providing you with capstone
              project help.
            </p>
            <p>
              What really sets us apart is our direct communication feature.
              Through our convenient chat system, you can stay in touch with
              your writer throughout the process.
            </p>
            <p>
              Authenticity, customization, and teamwork - these are what make
              our capstone writing services different.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Balance your studies and Downtime with Ease" />
            <p>
              Juggling classes, assignments, and personal life can feel
              overwhelming. Many students struggle to find the right balance
              when faced with tight schedules and challenging subjects. That’s
              why High-Quality Essay is here - to take some of that weight off
              your shoulders.
            </p>
            <p>
              Our team of experts has helped countless students with their
              toughest capstone papers. Each custom essay writer goes through a
              careful selection process to ensure only experienced, top-tier
              professionals work on your tasks. Whatever your field of study,
              we’ll pair you with a writer who knows the subject inside out and
              is ready to help you excel.
            </p>
            <p>
              We believe that quality academic help should be accessible to
              everyone. That’s why our services are designed with customers in
              mind - offering high-quality work at a price you can afford.
            </p>
            <p>
              Take a step toward less stress and better results with our
              capstone project writing service.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="How to order your custom capstone paper" />
            <p>
              Getting your custom capstone projects done with EssayPro is
              straightforward and hassle-free. Here’s how it works:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Sign up: </span>Create an account on
                our easy-to-use platform to order capstone project.
              </li>
              <li>
                <span className="font-bold">Provide your details: </span>
                Fill out the order form with key information like your project
                topic, length, deadline, and specific requirements.
              </li>
              <li>
                <span className="font-bold">Collaborate: </span>
                Chat directly with us to discuss project details, share
                additional instructions, and ask questions.
              </li>
              <li>
                <span className="font-bold">Receive your project: </span>
                Once the work is completed, you’ll receive it promptly for
                review. If adjustments are needed, revisions are always an
                option.
              </li>
              <li>
                <span className="font-bold">Approve and download: </span>
                Once you’re satisfied with the final version, approve it and
                download your polished work with ease.
              </li>
            </UnorderedList>
            <p>
              With our capstone writing services, you’ll experience a seamless
              process from start to finish.
            </p>
          </div>
        </div>
        <div className="pr-3">
          <div>
            <HeadingThreeTitle text="High-Quality Essay – your go-to study assistant" />
            <p>
              If you want to hire a professional capstone project writer,
              High-Quality Essay is your one-stop shop. Our team of highly
              erudite experts is at your service. Just make a request, and we’ll
              go out of our way to meet your needs.
            </p>
            <p>
              Students trust us with all types of school papers, from term
              papers to capstone projects. As we partner with experts from
              different fields of study, our writers can find just the approach
              for your task. Whether you need help with a business paper,
              chemistry project, or marketing essay, we have your back!
            </p>
            <p>
              With a massive database of writers, you can easily choose an ideal
              expert to ace your task. We made all profiles, ratings, and
              reviews public, so you know who is working on your paper. But
              whichever writer you pick, rest assured they will deliver an
              custom paper in the shortest time. Moreover, all our experts are
              native speakers.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Diverse capstone project types we cover" />
            <p>
              Capstone projects can look very different depending on your area
              of study, and we’re here to meet those unique challenges. Our
              experienced writers are ready to tackle custom capstone papers
              across a wide variety of disciplines. Here’s a glimpse of what we
              can help with:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Business & Finance: </span>From
                crafting detailed market analyses to building comprehensive
                business plans or financial forecasts, we’ve got you covered.
              </li>
              <li>
                <span className="font-bold">Computer science: </span>Need help
                with coding, software development, or system design? Our tech
                experts can handle it all, including cybersecurity capstone
                project writing.
              </li>
              <li>
                <span className="font-bold">Health sciences & Nursing: </span>
                Whether it’s clinical assessments, research projects, or
                healthcare management studies, we’ll help you do your capstone
                project that stands out.
              </li>
              <li>
                <span className="font-bold">
                  Humanities & Social sciences:{" "}
                </span>
                Dive into literature reviews, sociological studies, or
                historical research with the support of our dedicated writers.
              </li>
              <li>
                <span className="font-bold">Natural sciences: </span>Tackle
                complex topics like biological research, environmental studies,
                or chemistry experiments with confidence.
              </li>
            </UnorderedList>
          </div>
          <div>
            <HeadingThreeTitle text="High-Quality Essay - custom capstone project writing service" />
            <p>
              High-Quality Essay gets how important it is for you to get a
              capstone project writing service tailored to your needs. Here’s
              how we ensure it:
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">
                  Real writers, real expertise:{" "}
                </span>
                Our team is made up of professionals who’ve been in your shoes.
                They understand academic requirements inside and out and know
                how to create highly original, thoughtful capstone projects.
              </li>
              <li>
                <span className="font-bold">Built-in originality checks: </span>
                Every capstone project we deliver is checked for originality
                before it’s sent to you. If you want proof, just ask - we’ll
                provide a detailed plagiarism report showing your project’s high
                originality score.
              </li>
              <li>
                <span className="font-bold">No cookie-cutter work: </span>We
                never recycle work or take shortcuts. Instead, we collaborate
                with you to ensure the project matches your instructions and
                academic standards.
              </li>
              <li>
                <span className="font-bold">Double-checked for quality: </span>
                Before your project lands in your inbox, our quality assurance
                team goes over it.
              </li>
            </UnorderedList>
            <p>
              So, if you’re ready for a capstone paper that’s tailored to you,
              we’re ready to make it happen.
            </p>
          </div>
          <div>
            <HeadingThreeTitle text="Data security guaranteed with every order" />
            <p>
              If you’re thinking, “can I pay someone to do my capstone project
              and keep my data safe?” The answer is yes - with High-Quality
              Essay, your safety is guaranteed.
            </p>
            <UnorderedList>
              <li>
                <span className="font-bold">Bank-level encryption: </span>We use
                advanced encryption technology to protect your personal and
                payment details. You can confidently place your order, knowing
                your data is secure.
              </li>
              <li>
                <span className="font-bold">Minimal data collection: </span>The
                only information we require is your email address, which we use
                to send your completed capstone project and notify you of
                promotions. Nothing more, nothing less.
              </li>
              <li>
                <span className="font-bold">No resell/reuse: </span>We don’t
                publish or share any essays or papers crafted for students.
              </li>
            </UnorderedList>
            <p>
              From start to finish, we employ stringent security measures to
              ensure your personal information is fully protected at all times.
            </p>
            <p>
              Choose High-Quality Essay for a secure and reliable capstone paper
              writing service you can trust.
            </p>
          </div>
        </div>
      </ServiceDescriptionContainer>
    </>
  );
};

export default CapstoneProject;
