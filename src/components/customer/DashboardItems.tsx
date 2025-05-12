import React from "react";
import { DashboardItemTemplate } from "@/types/trademark";
import WhatsappImage from "@/assests/twitterLogo.png";
import DashboardsTemplate from "./DashboardsTemplate";

const items: DashboardItemTemplate[] = [
  {
    title: "Whatsapp Earnings",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "Whatsapp Withdrawals",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "My Packages",
    packages: ["Inactive"],
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "Deposit",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "Cashback",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "Balance",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "My Withdrawals",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
  {
    title: "Whatsapp Earnings",
    amount: 0,
    repImage: WhatsappImage,
    repImageAlt: "Whatsapp logo",
  },
];

const DashboardItems = () => {
  return (
    <div className="w-full bg-gray-100">
      <DashboardsTemplate items={items} />
    </div>
  );
};

export default DashboardItems;
