import React, { FC } from "react";
import Priorities from "../common/Priorities";
import ContinueWithSV from "./ContinueWithSV";
import GetServiceButton from "./GetServiceButton";

interface ServiceHeroSectionProps {
  serviceTitle: string;
  openningStatement: string;
  getServiceButtonText: string;
}

const ServiceHeroSection: FC<ServiceHeroSectionProps> = ({
  serviceTitle,
  openningStatement,
  getServiceButtonText,
}) => {
  return (
    <>
      <section className="max-w-6xl mt-28 vertical text-center text-gray-600">
        <h1 className="font-bold max-w-3xl">{serviceTitle}</h1>
        <p className="text-lg mb-6">{openningStatement}</p>
        <GetServiceButton text={getServiceButtonText} />
        <ContinueWithSV />
        <Priorities />
      </section>
    </>
  );
};

export default ServiceHeroSection;
