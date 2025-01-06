import Link from "next/link";

type PageProps = {
  params: {
    orderNumber: string;
  };
};

async function OrderPage({ params }: PageProps) {
  // Remove the await since params is already an object with the value
  const orderNumber = params.orderNumber;

  return (
    <div className="bg-gray-200 overflow-hidden">
      <div className="fixed inset-x-0 top-0 h-24 z-[60] px-3 py-8">
        <div className="horizontal-space-between max-w-4xl mx-auto">
          <div>
            <h3 className="!mb-0">
              Order #{orderNumber}{" "}
              <span className="text-gray-500 font-medium">(Draft)</span>
            </h3>
          </div>
          <div className="button-blue">
            <Link href="/customer/orders/drafts">Close/Back</Link>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto min-h-screen overflow-auto mt-28">
        We Successfully completed the first step
      </div>
    </div>
  );
}

export default OrderPage;
