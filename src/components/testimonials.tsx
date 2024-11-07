"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image, { StaticImageData } from "next/image";
import CLientOneImage from "@/assests/testimonies/clientOne.jpg";
import CLientTwoImage from "@/assests/testimonies/clientTwo.jpg";
import CLientThreeImage from "@/assests/testimonies/clientThree.jpg";
import CLientFourImage from "@/assests/testimonies/clientFour.jpg";
import DateDifference from "./dateDifference";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ClientTestimony {
  id: number;
  clientImage: StaticImageData;
  orderDetails: string;
  statement: string;
  daysAgo: string;
}

const Testimonials = () => {
  const clientTestimonies: ClientTestimony[] = [
    {
      id: 0,
      clientImage: CLientOneImage,
      orderDetails: "CLIENT #719844 HISTORY - 12 PAGES",
      daysAgo: "2024-11-01",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      clientImage: CLientTwoImage,
      orderDetails: "CLIENT #719844 Business - 8 PAGES",
      daysAgo: "2024-11-05",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      clientImage: CLientThreeImage,
      orderDetails: "CLIENT #719844 Psychology - 4 PAGES",
      daysAgo: "2024-11-02",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      clientImage: CLientFourImage,
      orderDetails: "CLIENT #719844 Nursing - 7 PAGES",
      daysAgo: "2024-11-03",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: "trimSnaps" },
    [Autoplay({ delay: 10000 })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <>
      <div>
        <div className="vertical">
          <h3 className="text-center">What our Clients Say About Us?</h3>
          <p className="text-center max-w-3xl mb-12">
            Join 657K+ successful students who trust HighQualityEssay for their
            academic needs. With 392 qualified writers, We build lasting
            partnerships with our clients through exceptional service and
            affordable rates, making academic excellence accessible to all.
          </p>
        </div>
        <div className="flex items-center justify-between p-4 gap-6">
          <div>
            <button
              onClick={scrollPrev}
              className="flex items-center justify-center p-1 hover:text-gray-200 hover:bg-blue-400 transition-colors duration-500 rounded-full hover:shadow-lg focus:outline-none"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {clientTestimonies.map((item) => (
                <div key={item.id} className="embla__slide">
                  <div className="horizontal gap-6 px-10">
                    <div className="horizontal">
                      <Image
                        src={item.clientImage}
                        alt="image of client"
                        className="object-cover rounded-2xl w-80 h-40"
                      />
                    </div>
                    <div className="max-w-2xl">
                      <DateDifference targetDateString={item.daysAgo} />
                      <p className="text-blue-600 mb-4">{item.orderDetails}</p>
                      <p className="text-2xl font-semibold">{item.statement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={scrollNext}
              className="flex items-center justify-center p-1 hover:text-gray-200 hover:bg-blue-400 transition-colors duration-500 rounded-full hover:shadow-lg focus:outline-none"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                index === selectedIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonials;
