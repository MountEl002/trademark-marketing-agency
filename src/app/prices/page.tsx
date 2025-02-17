import OrderPaper from "@/components/common/order/OrderPaper";
import Buttons from "@/components/prices/Buttons";
import Menu from "@/components/prices/Menu";
import React from "react";
import Image from "next/image";
import HappyStudent from "@/assests/happy-student.jpg";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";

interface ClientReview {
  id: number;
  clientDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
}

const Prices = () => {
  const reviewsSectionTitle =
    "At High-Quality Essay, every order has an encouraging story";
  const reviewsSectionDescription = (
    <span>
      Join 23K+ successful students who trust High-
      <span className="text-blue-700">Quality</span> Essay for their academic
      needs. With 392 qualified writers, We build lasting partnerships with our
      clients through exceptional service and affordable rates, making academic
      excellence accessible to all.
    </span>
  );

  const clientReviews: ClientReview[] = [
    {
      id: 0,
      daysAgo: "2024-12-28",
      numOfStars: "9/10",
      clientDetails: "CLIENT #19844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed. Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      daysAgo: "2024-12-06",
      numOfStars: "10/10",
      clientDetails: "CLIENT #2438",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      daysAgo: "2024-12-04",
      numOfStars: "10/10",
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #5674",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 4,
      daysAgo: "2024-12-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #39807",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 5,
      daysAgo: "2024-12-04",
      numOfStars: "10/10",
      clientDetails: "CLIENT #87645",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 6,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #210897",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 7,
      daysAgo: "2024-12-05",
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
      daysAgo: "2024-12-01",
      numOfStars: "10/10",
      clientDetails: "CLIENT #567453",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 10,
      daysAgo: "2024-12-05",
      numOfStars: "9/10",
      clientDetails: "CLIENT #67543",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 11,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #100547",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 12,
      daysAgo: "2024-12-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #29887",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 13,
      daysAgo: "2024-12-04",
      numOfStars: "9/10",
      clientDetails: "CLIENT #454647",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 14,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #77902",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 15,
      daysAgo: "2024-12-06",
      numOfStars: "10/10",
      clientDetails: "CLIENT #110089",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 16,
      daysAgo: "2024-12-01",
      numOfStars: "9/10",
      clientDetails: "CLIENT #562100",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 17,
      daysAgo: "2024-11-29",
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

  const serviceToTry = "Essay Writing Service";

  return (
    <>
      <section className="max-w-6xl mt-28 text-lg">
        <h1 className="w-full text-center md:text-start">Our Prices</h1>
        <p className="w-full text-center md:text-start text-gray-500">
          Here you can check our prices for writing, rewriting, editing, and
          proofreading services. We offer our customers part-by-part payments
          and an option to pay only for approved paper parts to get the desired
          result.
        </p>
        <div className="w-full">
          <Buttons />
        </div>
      </section>
      <section className="horizontal-start bg-blue-100 border-t border-b border-gray-400">
        <div className="max-w-6xl w-full mx-auto">
          <div>
            <p className="text-sm sm:text-base my-6">
              The prices mentioned below are for one double-spaced page (275
              words). We do all types of academic work including PowerPoint,
              final exams, quizzes, etc. Get a price quote by sharing
              instructions with live chat support team which is available 24/7.
            </p>
            <Menu />
          </div>
        </div>
      </section>
      {/* Customer Reviws Section */}
      <ServiceReviewsSection
        reviewsSectionTitle={reviewsSectionTitle}
        reviewsSectionDescription={reviewsSectionDescription}
        clientReviews={clientReviews}
        serviceToTry={serviceToTry}
      />

      <section className="!py-12 bg-blue-200 border-t border-blue-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="flex justify-center">
            <Image
              src={HappyStudent}
              alt="Student laughing holding a blue book"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center justify-center sm:items-start sm:justify-center w-full gap-6">
            <h3 className="text-center sm:text-start">
              Let us take care of all your writing needs at an affordable price
            </h3>
            <OrderPaper />
          </div>
        </div>
      </section>
    </>
  );
};

export default Prices;
