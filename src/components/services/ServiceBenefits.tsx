import Image from "next/image";
import React, { FC } from "react";
import { IconType } from "react-icons";
import { StaticImageData } from "next/image";
import OrderAnEssay from "../common/order/OrderAnEssay";

interface Image {
  src: StaticImageData | string;
  alt: string;
}

interface benefitItem {
  id: number;
  repIcon: IconType;
  name: string;
  description: string;
}

interface ServiceBenefitsProps {
  benefitsSectionTitle: string;
  benefitsDescription: string;
  serviceRepImage: Image;
  benefitItems: benefitItem[];
}

const ServiceBenefits: FC<ServiceBenefitsProps> = ({
  benefitsSectionTitle,
  benefitsDescription,
  serviceRepImage,
  benefitItems,
}: ServiceBenefitsProps) => {
  return (
    <section className="bg-blue-50">
      <div className="max-w-6xl text-center w-full">
        <h2>{benefitsSectionTitle}</h2>
        <p>{benefitsDescription}</p>
        <div className="max-w-4xl mx-auto w-full">
          <Image
            src={serviceRepImage.src}
            alt={serviceRepImage.alt}
            className="rounded-2xl my-8"
          />
        </div>
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-8 p-4">
          {benefitItems.map((item) => (
            <div
              key={item.id}
              className="border-b-2 border-gray-400 text-justify"
            >
              <div className="flex flex-row justify-center min-[900px]:justify-start items-center gap-4 mb-4">
                <item.repIcon size={30} />
                <h4 className="!mb-0">{item.name}</h4>
              </div>
              <p>{item.description}</p>
              <br />
            </div>
          ))}
        </div>
        <div className="horizontal w-full mt-12">
          <OrderAnEssay />
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
