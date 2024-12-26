import Priorities from "@/components/common/priorities";
import qualityControlImage from "@/assests/qualityControl2.png";
import Image from "next/image";
import OrderPaper from "@/components/common/order/orderPaper";
import CustomerReviews from "@/components/customerReviews";
import TryNow from "@/components/common/order/tryNow";
import SocialMedia from "@/components/common/socialMedia";
import HomepageFqa from "@/components/homepageSections/homepageFqa";
import Benefits from "@/components/common/benefits";
import Bonus from "@/components/common/bonus";
import CommnOrderForm from "@/components/common/order/commonOderForm";
import SelfProclamation from "@/components/common/selfProclamation";

export default function Home() {
  return (
    <>
      {/* Here section */}
      <section className="max-w-5xl mt-28 text-center text-gray-600">
        <div className="grid grid-cols-1 min-[820px]:grid-cols-2 gap-4">
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
          <div>
            <CommnOrderForm />
          </div>
        </div>
      </section>
      {/* Essay Writing services summary */}
      <section className="bg-blue-50">
        <div className="max-w-5xl text-center">
          <h2>Premium Essay Writing Services</h2>
          <h6>
            Transform your academic journey with our professional essay writing
            service. Simply tell us &quot;Write my paper&quot; and let our
            experts handle the rest.
          </h6>
          <div>
            <Image
              src={qualityControlImage}
              alt="Our Qualitity cotrol process"
            />
          </div>
          <Benefits />
        </div>
      </section>
      {/* Bonuses Section */}
      <section className="max-w-5xl text-center">
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
        <div className="max-w-5xl w-full px-4 overflow-hidden">
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
      <section>
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
    </>
  );
}
