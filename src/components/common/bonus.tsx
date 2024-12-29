import React from "react";

interface Bonus {
  id: number;
  name: string;
  initialPrice: string;
  currentPrice: string;
}

const ourBonuses: Bonus[] = [
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
];

const Bonus = () => {
  return (
    <>
      <div className="grid grid-cols-1 min-[645px]:grid-cols-2 min-[975px]:grid-cols-3 gap-6">
        {ourBonuses.map((item) => (
          <div
            key={item.id}
            className="flex flex-row justify-between border-2 rounded-lg px-4 py-4 space-x-8"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="horizontal space-x-2">
              <s className="text-red-600">{item.initialPrice}</s>
              <p className="text-green-600 font-semibold">
                {item.currentPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Bonus;
