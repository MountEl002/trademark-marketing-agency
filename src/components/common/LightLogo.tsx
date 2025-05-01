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
        <Image src={LogoImage} width={120} height={120} alt="Company Logo" />
      </div>
    </Link>
  );
};

export default LightLogo;
