"use client";

import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assests/LogoImage.png";
import { useAuth } from "@/contexts/AuthContext";

const LightLogo: React.FC = () => {
  const { user } = useAuth();

  return (
    <Link href={`${user ? "/customer/orders/open" : "/"}`}>
      <div className="flex flex-shrink-0 items-center">
        <Image src={LogoImage} width={30} height={40} alt="Company Logo" />
        <span className="max-[480px]:hidden ml-1 text-base font-semibold text-gray-600 text-center">
          High-<span className="text-blue-700">Quality</span> <br />
          Essay
        </span>
      </div>
    </Link>
  );
};

export default LightLogo;
