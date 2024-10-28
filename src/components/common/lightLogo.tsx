"use client";

import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assests/LogoImage.png";

const LightLogo: React.FC = () => {
  return (
    <Link href="/">
      <div className="flex flex-shrink-0 items-center">
        <Image src={LogoImage} width={30} height={40} alt="Company Logo" />
        <span className="ml-1 text-base font-semibold text-gray-600">
          HighQualityEssay
        </span>
      </div>
    </Link>
  );
};

export default LightLogo;
