import React from "react";

interface HeadingFourTitle {
  text: string;
}

const HeadingFourTitle = ({ text }: HeadingFourTitle) => {
  return <h4 className="!text-sm !my-auto !mb-4">{text}</h4>;
};

export default HeadingFourTitle;
