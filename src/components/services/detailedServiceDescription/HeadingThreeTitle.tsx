import React from "react";
import { HiOutlineAcademicCap } from "react-icons/hi2";

interface HeadingThreeTitleProps {
  text: string;
}

const HeadingThreeTitle = ({ text }: HeadingThreeTitleProps) => {
  return (
    <div className="horizontal-start gap-3 my-3">
      <HiOutlineAcademicCap size={30} />
      <h3 className="!text-base !my-auto">{text}</h3>
    </div>
  );
};

export default HeadingThreeTitle;
