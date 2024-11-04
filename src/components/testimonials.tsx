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

const Testimonials = () => {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimony = () => {
    const isFisrtTestimony = currentIndex === 0;
    const newIndex = isFisrtTestimony
      ? clientTestimonies.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextTestimony = () => {
    const isLastTestimony = currentIndex === clientTestimonies.length - 1;
    const newIndex = isLastTestimony ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToTestimony = (testimonyIndex: React.SetStateAction<number>) => {
    setCurrentIndex(testimonyIndex);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <ChevronLeft
          onClick={prevTestimony}
          className="h-[6%] w-[6%] hover:bg-blue-500 hover:text-white rounded-[50%] transition-colors duration-500 cursor-pointer"
        />
        <div className="horizontal gap-6 mx-20">
          <div className="relative h-[400px] w-[700px]">
            <Image
              src={clientTestimonies[currentIndex].clientImage}
              alt="image of client"
              fill
              className="object-cover rounded-2xl transition-trasform ease-out duration-1000"
            />
          </div>
          <div className="transition-all duration-300 ease-in-out">
            <p className="text-blue-600 mb-4">
              {clientTestimonies[currentIndex].orderDetails}
            </p>
            <p className="text-xl font-semibold">
              {clientTestimonies[currentIndex].statement}
            </p>
          </div>
        </div>
        <ChevronRight
          onClick={nextTestimony}
          className="h-[6%] w-[6%] hover:bg-blue-500 hover:text-white rounded-[50%] transition-colors duration-500 cursor-pointer"
        />
      </div>
      <div className="horizontal gap-2 p-4">
        {clientTestimonies.map((item) => (
          <div
            key={item.id}
            onClick={() => goToTestimony(item.id)}
            className={`h-2 w-2 rounded-[50%] cursor-pointer ${
              item.id === currentIndex ? "bg-blue-950" : "bg-blue-400"
            }`}
          ></div>
        ))}
      </div>
    </>
  );
};

export default Testimonials;
