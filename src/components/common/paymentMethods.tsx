import React from "react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Discover from "@/assests/paymentMethods/Discover.png";
import Visa from "@/assests/paymentMethods/visa.png";
import MasterCard from "@/assests/paymentMethods/mastercard.png";
import ApplePay from "@/assests/paymentMethods/applePay.png";
import GooglePay from "@/assests/paymentMethods/googlePay.png";
import PayPal from "@/assests/paymentMethods/payPal.png";
import AmericanExpress from "@/assests/paymentMethods/amex.png";

interface PaymentMethod {
  id: number;
  repimage: StaticImageData;
  alt: string;
}

const PaymentMethods = () => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      repimage: Discover,
      alt: "Logo of Discover",
    },
    {
      id: 2,
      repimage: Visa,
      alt: "Logo of Visa",
    },
    {
      id: 3,
      repimage: MasterCard,
      alt: "Logo of MasterCard",
    },
    {
      id: 4,
      repimage: AmericanExpress,
      alt: "Logo of AmericanExpress",
    },
    {
      id: 5,
      repimage: ApplePay,
      alt: "Logo of ApplePay",
    },
    {
      id: 6,
      repimage: GooglePay,
      alt: "Logo of GooglePay",
    },
    {
      id: 7,
      repimage: PayPal,
      alt: "Logo of PayPal",
    },
  ];

  return (
    <div className="flex items-center w-96">
      <div className="grid grid-cols-7 gap-2">
        {paymentMethods.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-gray-300 rounded-sm px-1"
          >
            <Image src={item.repimage} alt={item.alt} className="objet-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
