"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import DateDifference from "./dateDifference";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
interface ClientReview {
  id: number;
  clientDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
}

const CustomerReviews = () => {
  const clientReviews: ClientReview[] = [
    {
      id: 0,
      daysAgo: "2024-11-04",
      numOfStars: "9/10",
      clientDetails: "CLIENT #19844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      daysAgo: "2024-11-06",
      numOfStars: "10/10",
      clientDetails: "CLIENT #2438",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      daysAgo: "2024-11-04",
      numOfStars: "10/10",
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #5674",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 4,
      daysAgo: "2024-11-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #39807",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 5,
      daysAgo: "2024-11-04",
      numOfStars: "10/10",
      clientDetails: "CLIENT #87645",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 6,
      daysAgo: "2024-11-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #210897",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 7,
      daysAgo: "2024-11-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #56729",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 8,
      daysAgo: "2024-11-03",
      numOfStars: "9/10",
      clientDetails: "CLIENT #67945",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 9,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientDetails: "CLIENT #567453",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 10,
      daysAgo: "2024-11-05",
      numOfStars: "9/10",
      clientDetails: "CLIENT #67543",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 11,
      daysAgo: "2024-11-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #100547",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 12,
      daysAgo: "2024-11-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #29887",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 13,
      daysAgo: "2024-11-04",
      numOfStars: "9/10",
      clientDetails: "CLIENT #454647",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 14,
      daysAgo: "2024-11-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #77902",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 15,
      daysAgo: "2024-11-06",
      numOfStars: "10/10",
      clientDetails: "CLIENT #110089",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 16,
      daysAgo: "2024-11-01",
      numOfStars: "9/10",
      clientDetails: "CLIENT #562100",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 17,
      daysAgo: "2024-10-29",
      numOfStars: "10/10",
      clientDetails: "CLIENT #90889",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 18,
      daysAgo: "2024-11-30",
      numOfStars: "9/10",
      clientDetails: "CLIENT #40982",
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
          <h3 className="text-center">
            Essay writing service customer reviews
          </h3>
          <p className="text-center max-w-3xl pb-10">
            Looking for proof of our excellence? Our clients&apos; success
            stories say it all. Through tailored essay writing solutions and
            unwavering support, we&apos;ve earned our reputation for exceptional
            service.
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
          <div className="embla max-w-4xl" ref={emblaRef}>
            <div className="embla__container">
              {clientReviews.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-col justify-between w-64 h-60 rounded-2xl border-2 border-gray-300 p-4 mx-4">
                    <div className="flex justify-between">
                      <div className="horizontal gap-1">
                        <FaStar size={20} className="text-yellow-500" />
                        {item.numOfStars}
                      </div>
                      <div>
                        <DateDifference targetDateString={item.daysAgo} />
                      </div>
                    </div>
                    <div className="horizontal gap-4 text-blue-600">
                      <div className="p-3 bg-blue-100 rounded-[50%]">
                        <FaUser size={24} />
                      </div>
                      <div>{item.clientDetails}</div>
                    </div>
                    <div className="">{item.statement}</div>
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

export default CustomerReviews;
