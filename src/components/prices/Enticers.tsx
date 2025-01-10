import React from "react";
import { IconType } from "react-icons";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { FaListCheck } from "react-icons/fa6";
import { GiInfinity } from "react-icons/gi";
import { MdOutlineSecurity } from "react-icons/md";

interface Enticers {
  id: number;
  name: string;
  icon: IconType;
}

const enticers: Enticers[] = [
  { id: 1, name: "Money-back guarantee", icon: RiShieldKeyholeLine },
  { id: 2, name: "Part-by-part payments", icon: FaListCheck },
  { id: 3, name: "Free unlimited revisions", icon: GiInfinity },
  { id: 4, name: "Absolute anonymity", icon: MdOutlineSecurity },
];

const Enticers = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-5 lg:gap-8 my-10 w-full md:w-fit">
        {enticers.map((item) => (
          <div key={item.id}>
            <div className="horizontal-start w-full gap-3 text-base">
              <div className="bg-gray-300 p-2 rounded-[50%]">
                <item.icon size={20} className="text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm md:text-base">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Enticers;
