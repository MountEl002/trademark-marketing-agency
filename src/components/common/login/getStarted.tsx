import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const GetStarted = () => {
  return (
    <div className="w-fit horizontal button-gradient">
      <Link href="#">
        Get Started{" "}
        <span className="ml-3">
          <FaArrowRight color="white" className="inline" />
        </span>
      </Link>
    </div>
  );
};

export default GetStarted;
