"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import DateDifference from "../dateDifference";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

type CustomerReviewsArray = {
  id: number;
  clientDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
};

type ReviewDisplayerProps = {
  customerReviewsArray: CustomerReviewsArray[];
};

const ReviewsDisplayer: React.FC<ReviewDisplayerProps> = ({
  customerReviewsArray,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      dragFree: true,
    },
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
      <div className="horizontal-space-between bg-green-500 mx-auto">
        <div>
          <button
            onClick={scrollPrev}
            className="flex items-center justify-center p-1 hover:text-gray-200 hover:bg-blue-400 transition-colors duration-500 rounded-full hover:shadow-lg focus:outline-none"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-red-500 w-[80%]">
          <div className="embla mx-auto bg-white" ref={emblaRef}>
            <div className="embla__container">
              {customerReviewsArray.map((item) => (
                <div key={item.id} className="embla__slide">
                  <div className="flex-col justify-start h-full gap-3 rounded-2xl bg-gray-200 border-2 border-gray-300 p-4 mx-2">
                    <div className="flex justify-between">
                      <div className="horizontal gap-1">
                        <FaStar size={20} className="text-yellow-500" />
                        {item.numOfStars}
                      </div>
                      <div>
                        <DateDifference targetDateString={item.daysAgo} />
                      </div>
                    </div>
                    <div className="horizontal !justify-start gap-4 text-blue-600">
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
    </>
  );
};

export default ReviewsDisplayer;
