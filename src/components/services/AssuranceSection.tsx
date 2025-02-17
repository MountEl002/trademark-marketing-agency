import { StaticImageData } from "next/image";
import React from "react";
import Image from "next/image";
import DoubtfulCustomer1 from "@/assests/DoubtfulCustomer1.png";
import DoubtfulCustomer2 from "@/assests/DoubtfulCustomer2.jpg";
import DoubtfulCustomer3 from "@/assests/DoubtfulCustomer3.png";
import DoubtfulCustomer4 from "@/assests/DoubtfulCustomer4.png";
import { FaQuoteRight } from "react-icons/fa";
import GetServiceButton from "./GetServiceButton";

interface AssuranceItemImage {
  src: StaticImageData | string;
  alt: string;
}

interface AssuranceItem {
  id: number;
  question: string;
  description: string;
  bulletPoints?: string[];
}

interface AssuranceSectionProps {
  assuranceSectionTitle: string;
  assuranceItems: AssuranceItem[];
}

const assuranceItemImages: AssuranceItemImage[] = [
  {
    src: DoubtfulCustomer1,
    alt: "Doubtful Customer 1",
  },
  {
    src: DoubtfulCustomer2,
    alt: "Doubtful Customer 2",
  },
  {
    src: DoubtfulCustomer3,
    alt: "Doubtful Customer 3",
  },
  {
    src: DoubtfulCustomer4,
    alt: "Doubtful Customer 4",
  },
];

const AssuranceSection = ({
  assuranceSectionTitle,
  assuranceItems,
}: AssuranceSectionProps) => {
  return (
    <section className="bg-blue-200">
      <div className="max-w-6xl mx-auto">
        <h2>{assuranceSectionTitle}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
          {assuranceItems.map((item, index) => {
            const itemImage = assuranceItemImages[index];
            return (
              <div key={item.id} className="p-4 bg-blue-50 rounded-2xl">
                <div className="horizontal-start gap-14 border-b border-gray-300">
                  <div className="relative">
                    <Image
                      src={itemImage.src}
                      alt={itemImage.alt}
                      width={200}
                      height={200}
                      className="rounded-t-lg"
                    />
                    <FaQuoteRight
                      size={30}
                      className="absolute -top-2 -right-10 text-blue-200"
                    />
                  </div>
                  <h5>{item.question}</h5>
                </div>
                <p
                  className={`mt-4 text-sm ${
                    item.bulletPoints ? "ml-10" : "ml-0"
                  }`}
                >
                  {item.description}
                </p>
                {item.bulletPoints && (
                  <ol className="mt-4 ml-10 list-decimal text-sm list-inside">
                    {item.bulletPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-fit mx-auto">
          <GetServiceButton text="Get started now" />
        </div>
      </div>
    </section>
  );
};

export default AssuranceSection;
