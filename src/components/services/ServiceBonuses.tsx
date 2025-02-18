import { SiTicktick } from "react-icons/si";
import OrderPaper from "../common/order/OrderPaper";
import { BonusItem } from "@/types/servicesPages";

const bonusItems: BonusItem[] = [
  {
    id: 1,
    name: "Unlimited revisions",
    initialPrice: "$10.99",
    currentPrice: "free",
  },
  {
    id: 2,
    name: "A paper draft",
    initialPrice: "$5.99",
    currentPrice: "free",
  },
  {
    id: 3,
    name: "Premium writers",
    initialPrice: "$10.99",
    currentPrice: "free",
  },
  {
    id: 4,
    name: "VIP Support",
    initialPrice: "$10.99",
    currentPrice: "free",
  },
  {
    id: 5,
    name: "A plagiarism report",
    initialPrice: "$25.99",
    currentPrice: "free",
  },
  {
    id: 6,
    name: "Formatting",
    initialPrice: "$7.99",
    currentPrice: "free",
  },
  {
    id: 7,
    name: "Title page",
    initialPrice: "$3.99",
    currentPrice: "free",
  },
];

interface ServiceBonusesProps {
  bonusSectionTitle: string;
  bonusSectionDescription: string;
  bonusSectionDescription2?: string;
}

const ServiceBonuses = ({
  bonusSectionTitle,
  bonusSectionDescription,
  bonusSectionDescription2,
}: ServiceBonusesProps) => {
  return (
    <section className="bg-blue-100 py-14">
      <div className="max-w-6xl text-center">
        <h2>{bonusSectionTitle}</h2>
        <div className="vertical gap-4 mb-8">
          <p>{bonusSectionDescription}</p>
          <p>{bonusSectionDescription2}</p>
        </div>
        <div className="grid grid-cols-1 min-[645px]:grid-cols-2 min-[975px]:grid-cols-3 gap-6">
          {bonusItems.map((item) => (
            <div
              key={item.id}
              className="horizontal-space-between border-2 border-gray-50 hover:border-blue-500 rounded-lg px-4 py-4 space-x-8 transition-all duration-500"
            >
              <div className="horizontal gap-2 font-semibold">
                <SiTicktick size={20} className="flex-shrink-0" />
                <p>{item.name}</p>
              </div>
              <div className="horizontal space-x-2">
                <s className="text-red-600">{item.initialPrice}</s>
                <div className="horizontal bg-blue-500 px-2 py-1 rounded-lg">
                  <p className="text-gray-50 font-semibold">
                    {item.currentPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="horizontal w-full mt-12">
          <OrderPaper />
        </div>
      </div>
    </section>
  );
};

export default ServiceBonuses;
