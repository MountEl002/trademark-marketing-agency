"use client";

import { use, useState } from "react";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

function OrderPage({ params }: PageProps) {
  const { orderNumber } = use(params);
  const [assignmentType, setassignmentType] = useState<string>(
    "Select assignment type"
  );
  const [service, setService] = useState<string>("Select service");
  const [academicLevel, setAcademicLevel] = useState<string>(
    "Select academic level"
  );
  const [language, setLanguage] = useState<string>("Select language");
  const [size, setSize] = useState<string>("Indicate the size of assignment");
  const [pages, setpages] = useState<number>(0);
  const [words, setWords] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>("Select deadline");
  const [addOns, setAddOns] = useState<string>("Select add-ons");
  const [topic, setTopic] = useState<string>("Write Your Topic");
  const [subject, setSubject] = useState<string>("Select your subject");
  const [instructions, setInstructions] = useState<string>(
    "Write the instructions"
  );

  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden">
      <div className="fixed inset-x-0 top-0 h-24 z-[60] px-3 py-8 bg-gray-200">
        <div className="horizontal-space-between max-w-4xl mx-auto">
          <div>
            <h3 className="!mb-0">
              Order #{orderNumber}{" "}
              <span className="text-gray-500 font-medium">(Draft)</span>
            </h3>
          </div>
          <div className="button-blue">
            <Link href="/customer/orders/drafts">Close/Back</Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-24 max-w-4xl mx-auto">
        {/* Assignment type field */}
        <div id="assignment-type">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Assignment type</p>
              <p>{assignmentType}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Service Field */}
        <div id="service">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Service</p>
              <p>{service}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Academic Level field */}
        <div id="academic-level">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Academic level</p>
              <p>{academicLevel}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Language Field */}
        <div id="language">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Language</p>
              <p>{language}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Size field */}
        <div id="size">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Size</p>
              <p>{size}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Deadline field */}
        <div id="deadline">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Deadline</p>
              <p>{deadline}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Add-ons field */}
        <div id="add-ons">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Add-ons</p>
              <p>{addOns}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Topic field */}
        <div id="topic">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Topic</p>
              <p>{topic}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Subject field */}
        <div id="subject">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Subject</p>
              <p>{subject}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>

        {/* Instructions field */}
        <div id="instructions">
          <div className="draft-order-grids-min group">
            <div className="first-div">
              <p>Instructions</p>
              <p>{instructions}</p>
            </div>
            <div className="second-div group-hover:bg-blue-500 transtion-all duration-500">
              <span className="text-white text-sm">Edit</span>
              <IoChevronDown className="group-hover:bg-blue-400 bg-blue-300 text-xl text-white rounded-sm transtion-all duration-500" />
            </div>
          </div>
          <div className="draft-order-grids-max"></div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
