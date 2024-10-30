import OrderNow from "@/components/common/order/orderNow";
import ContinueWithGoogle from "@/components/common/login/continueWithGoogle";
import Priorities from "@/components/common/priorities";

export default function Home() {
  return (
    <>
      {/* Here section */}
      <section className="max-w-5xl mt-16 text-center text-gray-600">
        <h1 className="font-bold max-w-3xl">
          Exemplary Essay Writing Services with Professional Writers at
          Affordable Prices
        </h1>
        <h5 className="py-8 text-gray-500">
          Get a professional essay for only
          <span className="font-semibold">
            <strong> $3.0/page </strong>
          </span>
          and get unique paper help
        </h5>
        <div className="horizontal gap-6 my-4">
          <OrderNow />
          <ContinueWithGoogle />
        </div>
        <Priorities />
      </section>

      {/* Essay Writing services summary */}
      <section className="bg-blue-50">
        <div className="max-w-5xl text-center">
          <h2>Premium Essay Writing Services</h2>
          <h6>
            Transform your academic journey with our professional essay writing
            service. Simply tell us &quot;Write my essay&quot; and let our
            experts handle the rest.
          </h6>
        </div>
        <div></div>
      </section>
    </>
  );
}
