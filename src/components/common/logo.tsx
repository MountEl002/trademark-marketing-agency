"use client";

import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <div className="flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-lg">
        <Image
          src="/images/favicon.png"
          width={100}
          height={50}
          alt="Company Logo"
        />
      </div>
    </Link>
  );
};

export default Logo;
