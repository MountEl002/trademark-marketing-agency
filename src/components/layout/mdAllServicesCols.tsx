import React from "react";

interface AllServicesColOne {
  id: number;
  name: string;
  LinkTo: string;
}
interface AllServicesColTwo {
  id: number;
  name: string;
  LinkTo: string;
}
interface AllServicesColThree {
  id: number;
  name: string;
  LinkTo: string;
}
interface AllServicesColFour {
  id: number;
  name: string;
  LinkTo: string;
}

const MdAllServicesCols = () => {
  const allServicesColOne: AllServicesColOne[] = [
    {
      id: 1,
      name: "Analytical Essay Writing",
      LinkTo: "/services/analytical-paper",
    },
    {
      id: 2,
      name: "Annotated Bibliography Writing",
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
  ];

  const allServicesColTwo: AllServicesColTwo[] = [
    {
      id: 1,
      name: "Chicago paper Writing",
      LinkTo: "/services/chicago-paper",
    },
    {
      id: 2,
      name: "College Essay Writing",
      LinkTo: "/services/college-essay",
    },
    {
      id: 3,
      name: "College Paper Writing",
      LinkTo: "/services/college-paper",
    },
    {
      id: 4,
      name: "Coursework Writing",
      LinkTo: "/services/coursework",
    },
    {
      id: 5,
      name: "Dissertation Writing",
      LinkTo: "/services/dissertation",
    },
    {
      id: 6,
      name: "English Assignment Writing",
      LinkTo: "/services/english-assignment",
    },
    {
      id: 7,
      name: "Essay Writing",
      LinkTo: "/services/essay",
    },
    {
      id: 8,
      name: "Fast Essay Writing",
      LinkTo: "/services/fast-essay",
    },
  ];

  const allServicesColThree: AllServicesColThree[] = [
    {
      id: 1,
      name: "Finance Paper Writing",
      LinkTo: "/services/finance-paper",
    },
    {
      id: 2,
      name: "Harvard Paper Writing",
      LinkTo: "/services/harvard-paper",
    },
    {
      id: 3,
      name: "Do My Homework",
      LinkTo: "/services/homework",
    },
    {
      id: 4,
      name: "Lab Report Writing",
      LinkTo: "/services/lab-report",
    },
    {
      id: 5,
      name: "Literature Review Writing",
      LinkTo: "/services/literature-review",
    },
    {
      id: 6,
      name: "MBA Paper Writing",
      LinkTo: "/services/mba-paper",
    },
    {
      id: 7,
      name: "Literature Paper Writing",
      LinkTo: "/services/literature-paper",
    },
    {
      id: 8,
      name: "MLA Paper Writing",
      LinkTo: "/services/mla-paper",
    },
  ];

  const allServicesColFour: AllServicesColFour[] = [
    {
      id: 1,
      name: "Nursing Paper Writing",
      LinkTo: "/services/nurse-paper",
    },
    {
      id: 2,
      name: "Personal Statement Writing",
      LinkTo: "/services/personal-statement",
    },
    {
      id: 3,
      name: "Philosophy Paper Writing",
      LinkTo: "/services/philosophy-paper",
    },
    {
      id: 4,
      name: "PowerPoint Presentation Writing",
      LinkTo: "/services/powerPoint-presentation",
    },
    {
      id: 5,
      name: "Research Paper Writing",
      LinkTo: "/services/research-paper",
    },
    {
      id: 6,
      name: "Scholarship Essay Writing",
      LinkTo: "/services/scholarship-essay",
    },
    {
      id: 7,
      name: "Term Paper Writing",
      LinkTo: "/services/term-paper",
    },
    {
      id: 8,
      name: "Urgent Paper Writing",
      LinkTo: "/services/urgent-paper",
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto w-full flex justify-between">
        {/* Column One */}
        <div>
          {allServicesColOne.map((service) => (
            <ul key={service.id} className="">
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={service.LinkTo}>{service.name}</a>
              </li>
            </ul>
          ))}
        </div>
        {/* Column Two */}
        <div>
          {allServicesColTwo.map((service) => (
            <ul key={service.id} className="">
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={service.LinkTo}>{service.name}</a>
              </li>
            </ul>
          ))}
        </div>

        {/* Column Three */}
        <div>
          {allServicesColThree.map((service) => (
            <ul key={service.id} className="">
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={service.LinkTo}>{service.name}</a>
              </li>
            </ul>
          ))}
        </div>

        {/* Column Fiour */}
        <div>
          {allServicesColFour.map((service) => (
            <ul key={service.id} className="">
              <li className="mb-2 hover:text-blue-600 cursor-pointer">
                <a href={service.LinkTo}>{service.name}</a>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
};

export default MdAllServicesCols;
