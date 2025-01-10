import React from "react";
import { IconType } from "react-icons";
import { HiAcademicCap } from "react-icons/hi2";
import { GiPapers } from "react-icons/gi";
import { IoIosClock } from "react-icons/io";
import { FaBookOpenReader } from "react-icons/fa6";

interface Buttons {
  id: number;
  name: string;
  icon: IconType;
}

const buttons: Buttons[] = [
  { id: 1, name: "Academic Level", icon: HiAcademicCap },
  { id: 2, name: "Number of pages", icon: GiPapers },
  { id: 3, name: "Urgency", icon: IoIosClock },
  { id: 4, name: "Type of paper need", icon: FaBookOpenReader },
];

const Buttons = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-10 w-full md:w-fit">
        {buttons.map((item) => (
          <div key={item.id}>
            <div className="horizontal w-full gap-3 text-base border border-gray-200 rounded-3xl py-1 px-4">
              <item.icon size={20} className="text-blue-500" />
              <p className="text-gray-500 text-sm md:text-base">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Buttons;
