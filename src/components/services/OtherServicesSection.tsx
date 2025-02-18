import Link from "next/link";
import { FaRegCheckCircle } from "react-icons/fa";
import { AllServices } from "@/types/servicesPages";

interface OtherServicesSectionProps {
  servicesToExclude: string[];
  currentServicePage: string;
}

const allServices: AllServices[] = [
  {
    id: 1,
    name: "Analytical Essay Writing",
    LinkTo: "/services/analytical-paper",
  },
  {
    id: 2,
    name: "Annotated Bibliography",
    LinkTo: "/services/annotated-bibliography",
  },
  {
    id: 3,
    name: "APA Paper Writing",
    LinkTo: "/services/apa-paper",
  },
  {
    id: 4,
    name: "Argumentative Essay Writing",
    LinkTo: "/services/argumentative-essay",
  },
  {
    id: 5,
    name: "Case Study Paper Writing",
    LinkTo: "/services/case-study",
  },
  {
    id: 6,
    name: "Capstone Project Writing",
    LinkTo: "/services/capstone-project",
  },
  {
    id: 7,
    name: "Article Review Writing",
    LinkTo: "/services/article-review",
  },
  {
    id: 8,
    name: "Do My Assignment",
    LinkTo: "/services/assignment",
  },
  {
    id: 9,
    name: "Chicago paper Writing",
    LinkTo: "/services/chicago-paper",
  },
  {
    id: 10,
    name: "College Essay Writing",
    LinkTo: "/services/college-essay",
  },
  {
    id: 11,
    name: "College Paper Writing",
    LinkTo: "/services/college-paper",
  },
  {
    id: 12,
    name: "Coursework Writing",
    LinkTo: "/services/coursework",
  },
  {
    id: 13,
    name: "Dissertation Writing",
    LinkTo: "/services/dissertation",
  },
  {
    id: 14,
    name: "English Assignment Writing",
    LinkTo: "/services/english-assignment",
  },
  {
    id: 15,
    name: "Essay Writing",
    LinkTo: "/services/essay",
  },
  {
    id: 16,
    name: "Fast Essay Writing",
    LinkTo: "/services/fast-essay",
  },
  {
    id: 17,
    name: "Finance Paper Writing",
    LinkTo: "/services/finance-paper",
  },
  {
    id: 18,
    name: "Harvard Paper Writing",
    LinkTo: "/services/harvard-paper",
  },
  {
    id: 19,
    name: "Do My Homework",
    LinkTo: "/services/homework",
  },
  {
    id: 20,
    name: "Lab Report Writing",
    LinkTo: "/services/lab-report",
  },
  {
    id: 21,
    name: "Literature Review Writing",
    LinkTo: "/services/literature-review",
  },
  {
    id: 22,
    name: "MBA Paper Writing",
    LinkTo: "/services/mba-paper",
  },
  {
    id: 23,
    name: "Literature Paper Writing",
    LinkTo: "/services/literature-paper",
  },
  {
    id: 24,
    name: "MLA Paper Writing",
    LinkTo: "/services/mla-paper",
  },
  {
    id: 25,
    name: "Nursing Paper Writing",
    LinkTo: "/services/nurse-paper",
  },
  {
    id: 26,
    name: "Personal Statement Writing",
    LinkTo: "/services/personal-statement",
  },
  {
    id: 27,
    name: "Philosophy Paper Writing",
    LinkTo: "/services/philosophy-paper",
  },
  {
    id: 28,
    name: "PowerPoint Presentation",
    LinkTo: "/services/powerPoint-presentation",
  },
  {
    id: 29,
    name: "Research Paper Writing",
    LinkTo: "/services/research-paper",
  },
  {
    id: 30,
    name: "Scholarship Essay Writing",
    LinkTo: "/services/scholarship-essay",
  },
  {
    id: 31,
    name: "Term Paper Writing",
    LinkTo: "/services/term-paper",
  },
  {
    id: 32,
    name: "Urgent Paper Writing",
    LinkTo: "/services/urgent-paper",
  },
];

const OtherServicesSection = ({
  servicesToExclude,
  currentServicePage,
}: OtherServicesSectionProps) => {
  return (
    <section className="bg-blue-700 text-white">
      <div>
        <h2>
          Apart from {currentServicePage}, we also offer the following services:
        </h2>
        <div className="grid grid-cols-1 min-[546px]:grid-cols-2 min-[810px]:grid-cols-3 min-[1080px]:grid-cols-4 gap-1 max-h-[70vh] overflow-y-auto chat-scrollbars">
          {allServices.map((service) => (
            <Link
              key={service.id}
              href={service.LinkTo}
              className={` ${
                servicesToExclude.includes(service.name)
                  ? "hidden"
                  : "horizontal gap-3 w-fit hover:bg-white hover:text-blue-700 p-2 rounded-md transition-all duration-500"
              }`}
            >
              <FaRegCheckCircle size={20} className="flex-shrink-0" />{" "}
              <span> {service.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherServicesSection;
