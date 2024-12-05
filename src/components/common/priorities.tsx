import React from "react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import PlagiarismFreeImage from "@/assests/PlagFree.png";
import AiFreeImage from "@/assests/no-ai-icon-04.png";
import MoneyBack from "@/assests/moneyBackGuarantee.png";
import SatisfactionImage from "@/assests/costomerSatisfaction.png";

interface CustomerPrioty {
  id: number;
  name: string;
  repImage: StaticImageData;
  imageAlt: string;
}

const Priorities = () => {
  const customerPrioties: CustomerPrioty[] = [
    {
      id: 1,
      name: "100% SATISFACTION",
      repImage: SatisfactionImage,
      imageAlt: "Customer satisfaction guaranteed image",
    },
    {
      id: 2,
      name: "MONEY-BACK GUARANTEE",
      repImage: MoneyBack,
      imageAlt: "Money Back Gurantee Image",
    },
    {
      id: 3,
      name: "AI-FREE CONTENT",
      repImage: AiFreeImage,
      imageAlt: "AI Free image",
    },
    {
      id: 4,
      name: "PLAGIRISM-FREE CONTENT",
      repImage: PlagiarismFreeImage,
      imageAlt: "Plagiarism free image",
    },
  ];
  return (
    <div className="grid grid-cols-2 min-[875px]:grid-cols-4 gap-8 my-4">
      {customerPrioties.map((item) => (
        <div
          key={item.id}
          className="bg-gray-50 p-4 rounded-lg shadow-lg h-48 w-48"
        >
          <Image
            src={item.repImage}
            alt={item.imageAlt}
            className="object-contain h-[80%] w-full"
          />
          <p className="pt-4 text-gray-800 text-xs">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Priorities;
