"use client";

import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <div className="flex-shrink-0">
        <Image
          src="/images/favicon.png"
          width={50}
          height={50}
          alt="Company Logo"
        />
      </div>
    </Link>
  );
};

export default Logo;
