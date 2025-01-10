import FAQ from "@/components/common/FAQ";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Who writes my essays?",
    answer:
      "At High-Quality Essay, we believe in matching you with the absolute best writer for your specific assignment. Unlike services where you choose from multiple writers, our expert team carefully selects the most qualified professional based on your subject matter and academic requirements. All our writers hold advanced degrees and undergo rigorous vetting to ensure exceptional quality. You can communicate directly with your assigned writer throughout the process at no additional cost.",
  },
  {
    id: 2,
    question: "How quickly can you complete my essay?",
    answer:
      "We pride ourselves on delivering high-quality work within your specified timeframe. When placing your order, simply indicate your desired deadline in the order form. We recommend allowing extra time for potential revisions to ensure complete satisfaction with the final product. Our experienced writers excel at meeting tight deadlines while maintaining superior quality. For urgent needs, we can complete single-page assignments in as little as 2 hours.",
  },
  {
    id: 3,
    question: "Do you provide original essays?",
    answer:
      "Absolutely. Our commitment to quality means every essay is written completely from scratch. Our experienced writers take pride in creating 100% original content tailored to your specific requirements. To ensure your complete confidence, we provide access to plagiarism detection software so you can verify the uniqueness of your essay. We stand firmly behind the originality of our work.",
  },
  {
    id: 4,
    question: "What is your pricing structure?",
    answer:
      "We believe in transparent, straightforward pricing. Our service charges a flat rate of $3 per page, making quality academic writing accessible to all students. This competitive rate covers all aspects of our service - there are no hidden fees or surcharges. We've simplified pricing to focus on what matters most: delivering exceptional quality at an affordable price.",
  },
  {
    id: 5,
    question: "Why should I trust your essay writing service?",
    answer:
      "High-Quality Essay has built its reputation on delivering superior academic writing at affordable prices. We offer several guarantees to ensure your confidence: free revisions until you're completely satisfied, a secure payment system, and 24/7 customer support. Rather than using a bidding system, we carefully match you with the most qualified writer for your subject matter. Our focus is on quality and reliability, providing you with the best possible academic support.",
  },
  {
    id: 6,
    question: "Can I remain anonymous while using your service?",
    answer:
      "We take your privacy seriously. Our strict confidentiality policy ensures your information remains completely protected. When creating an account, you'll be assigned a unique identifier - there's no need to provide your real name. We advise against sharing personal details or institutional information with anyone. Your use of our service remains completely confidential.",
  },
  {
    id: 7,
    question: "What types of papers do you offer?",
    answer:
      "Our service covers all academic writing needs, including, essays (argumentative, descriptive, narrative, application), reviews (book, movie, article), complex academic projects (coursework, term papers), and thesis and dissertation chapters among other academic services you might need. Each assignment is handled by a writer specifically qualified in your subject area, ensuring expert-level work that meets academic standards.",
  },
  {
    id: 8,
    question: "How do you select your writers?",
    answer:
      "Our rigorous selection process ensures only top-tier academic writers join our team. Each candidate must provide proof of advanced degrees, pass comprehensive English proficiency tests, and successfully complete a trial period. Our quality control team continuously monitors performance, maintaining our high standards. Writers who don't consistently meet our quality benchmarks are immediately removed from our team.",
  },
  {
    id: 9,
    question: "Is your service legitimate?",
    answer:
      "Yes. We operate as a legitimate academic assistance service, providing reference materials and guidance to help students improve their writing skills. Our work serves as a learning tool to enhance your academic capabilities.",
  },
  {
    id: 10,
    question:
      "How can a money-back guarantee help me use your service effectively?",
    answer:
      "According to our money-back guarantee, you can get a full or partial refund when using our online essay writing service. For instance, when you decide to cancel your order, you can get a 100% refund if your writer has not started working on your assignment. Otherwise, the refund amount will depend on the expert’s progress. On top of that, you can count on getting your money back if your order is delivered late and we are at fault. Even though our writers do everything they can to meet the most challenging deadlines, it's impossible to guarantee on-time delivery in 100% of cases. As you can see, getting custom essay help here is risk-free because you can rely on multiple guarantees. We aim to meet our clients' expectations no matter what.",
  },
];

const HomepageFqa = () => {
  return <FAQ faqArray={faqData} />;
};

export default HomepageFqa;
