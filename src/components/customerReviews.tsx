"use client";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CLientOneImage from "@/assests/testimonies/clientOne.jpg";
import CLientTwoImage from "@/assests/testimonies/clientTwo.jpg";
import CLientThreeImage from "@/assests/testimonies/clientThree.jpg";
import CLientFourImage from "@/assests/testimonies/clientFour.jpg";

interface ClientTestimony {
  id: number;
  clientImage: StaticImageData;
  orderDetails: string;
  statement: string;
}

const CustomerReviews = () => {
  const clientTestimonies: ClientTestimony[] = [
    {
      id: 0,
      clientImage: CLientOneImage,
      orderDetails: "CLIENT #719844 HISTORY - 12 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      clientImage: CLientTwoImage,
      orderDetails: "CLIENT #719844 Business - 8 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      clientImage: CLientThreeImage,
      orderDetails: "CLIENT #719844 Psychology - 4 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      clientImage: CLientFourImage,
      orderDetails: "CLIENT #719844 Nursing - 7 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
  ];

  return (
    <div>{clientTestimonies}</div>
  )
}

export default CustomerReviews;