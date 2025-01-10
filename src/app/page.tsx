import Priorities from "@/components/common/Priorities";
import HeroSection from "@/assests/hero-section.jpg";
import Image from "next/image";
import OrderPaper from "@/components/common/order/OrderPaper";
import CustomerReviews from "@/components/CustomerReviews";
import TryNow from "@/components/common/order/TryNow";
import HomepageFqa from "@/components/homepageSections/HomepageFqa";
import Benefits from "@/components/common/Benefits";
import Bonus from "@/components/common/Bonus";
import SelfProclamation from "@/components/common/SelfProclamation";
import EffortlessLearning from "@/components/common/EffortlessLearning";
import PrivacyHighlight from "@/components/common/PrivacyHighlight";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="max-w-6xl mt-28 text-center text-gray-600">
        <div>
          <div>
            <h1 className="font-bold max-w-3xl">
              Exemplary Essay Writing Services with Professional Writers at
              Affordable Prices
            </h1>
            <h5 className="text-gray-500">
              Get a professional essay for only
              <span className="font-semibold">
                <strong> $3.0/page </strong>
              </span>
              and get unique paper help
            </h5>
            <Priorities />
          </div>
        </div>
      </section>
      {/* Essay Writing services summary */}
      <section className="bg-blue-50">
        <div className="max-w-6xl text-center">
          <h2>Premium Essay Writing Services</h2>
          <h6>
            Transform your academic journey with our professional essay writing
            service. Simply tell us &quot;Write my paper&quot; and let our
            experts handle the rest.
          </h6>
          <div>
            <Image src={HeroSection} alt="Essay writing in progress" />
          </div>
          <Benefits />
        </div>
      </section>
      {/* Bonuses Section */}
      <section className="max-w-6xl text-center">
        <h2 className="mb-6">
          Smart students choose smarter writing solutions!
        </h2>
        <h6>
          Turn &lsquo;I need help writing my essay&rsquo; into{" "}
          <strong>&lsquo;I got everything I needed—and more!&rsquo;</strong>{" "}
          <br />
          Experience top-tier academic writing with our signature collection of
          free additional benefits:
        </h6>
        <Bonus />
        <div className="mt-12">
          <OrderPaper />
        </div>
      </section>
      {/* Customer Reviws Section */}
      <section className="bg-blue-50">
        <div className="max-w-6xl w-full px-4 overflow-hidden">
          <div className="vertical">
            <h3 className="text-center">What our Clients Say About Us</h3>
            <p className="text-center max-w-3xl pb-10">
              Join 23K+ successful students who trust High-
              <span className="text-blue-700">Quality</span> Essay for their
              academic needs. With 392 qualified writers, We build lasting
              partnerships with our clients through exceptional service and
              affordable rates, making academic excellence accessible to all.
            </p>
          </div>
          <CustomerReviews />
          <div className="horizontal mt-8">
            <a href="#" className="buttonBlue">
              See More Reviews
            </a>
          </div>
          <TryNow />
        </div>
      </section>
      {/* Frequently Asked Questions Section */}
      <section id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center">
            Frequently Asked Questions about our services
          </h2>
          <HomepageFqa />
        </div>
      </section>
      {/* Self-Procalamation Section */}
      <section className="bg-blue-50">
        <SelfProclamation />
      </section>

      {/* Description of services and processes section */}
      <section className="bg-blue-100">
        <EffortlessLearning />
      </section>

      {/* Privacy Highlight Section */}
      <section className="bg-blue-600">
        <PrivacyHighlight />
      </section>
    </>
  );
}
