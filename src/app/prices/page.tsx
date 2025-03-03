import OrderPaper from "@/components/common/order/OrderPaper";
import Buttons from "@/components/prices/Buttons";
import Menu from "@/components/prices/Menu";
import React from "react";
import Image from "next/image";
import HappyStudent from "@/assests/happy-student.jpg";
import ServiceReviewsSection from "@/components/services/ServiceReviewsSection";

const Prices = () => {
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
        reviewsSectionTitle="At High-Quality Essay, every order has an encouraging story"
        reviewsSectionDescription="Find out what other customers are saying about our services"
        serviceToTry="essay writing service"
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
