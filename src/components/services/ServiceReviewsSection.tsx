import ReviewsDisplayer from "../common/ReviewsDisplayer";
import UniversalLink from "../common/UniversalLink";
import { FaArrowRight } from "react-icons/fa";
import GetServiceButton from "./GetServiceButton";
import { ClientReview } from "@/types/servicesPages";

interface ServiceReviewsSectionProps {
  reviewsSectionTitle: string;
  reviewsSectionDescription: React.ReactNode;
  clientReviews: ClientReview[];
  serviceToTry: string;
}

const ServiceReviewsSection = ({
  reviewsSectionTitle,
  reviewsSectionDescription,
  clientReviews,
  serviceToTry,
}: ServiceReviewsSectionProps) => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-6xl w-full px-4 overflow-hidden">
        <div className="vertical">
          <h2 className="text-center">{reviewsSectionTitle}</h2>
          <p className="text-center max-w-3xl pb-10">
            {reviewsSectionDescription}
          </p>
        </div>
        <ReviewsDisplayer customerReviewsArray={clientReviews} />
        <div className="horizontal mt-12">
          <UniversalLink
            icon={FaArrowRight}
            href="/reviews"
            linkClassName="bg-blue-500 hover:bg-blue-700"
            iconClassName="bg-blue-400 group-hover:bg-blue-600"
            text="See more reviews"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mt-12 mx-auto text-center sm:text-start">
          <p className="text-2xl font-semibold">
            Try our {serviceToTry} right now!
          </p>
          <GetServiceButton text="Get started" />
        </div>
      </div>
    </section>
  );
};

export default ServiceReviewsSection;
