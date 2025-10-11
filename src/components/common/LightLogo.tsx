"use client";

import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/LogoImage.jpg";
import { useAuth } from "@/contexts/AuthContext";

const LightLogo: React.FC = () => {
  const { user } = useAuth();

  return (
    <Link href={`${user ? "/customer/dashboards" : "/"}`}>
      <div className="flex flex-shrink-0 items-center">
        <Image
          src={LogoImage}
          className="h-14 w-14 rounded-lg"
          alt="Trademark Marketing Agency Logo"
        />
      </div>
    </Link>
  );
};

export default LightLogo;
