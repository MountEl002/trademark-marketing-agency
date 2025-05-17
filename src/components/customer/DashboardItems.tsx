"use client";

import React from "react";
import { DashboardItemTemplate } from "@/types/trademark";
import WhatsappImage from "@/assests/WhatsappLogo.png";
import WhatsappWithdrawalsImage from "@/assests/WithdrawalsOne.png";
import WithdrawalsImage from "@/assests/WithdrawalsTwo.png";
import PackagesImage from "@/assests/MyPackages.png";
import DepositImage from "@/assests/Deposit.png";
import CashbackImage from "@/assests/Cashback.png";
import BalanceImage from "@/assests/Balance.png";
import DashboardsTemplate from "./DashboardsTemplate";
import { getUserBalance } from "@/contexts/userService";
import { useAuth } from "@/contexts/AuthContext";

import { useEffect, useState } from "react";
const DashboardItems = () => {
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.uid) {
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);
      } else {
        setUserBalance(0);
      }
    };
    fetchBalance();
  }, [user?.uid]);

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
      repImage: WhatsappWithdrawalsImage,
      repImageAlt: "Hand holding dedit card",
    },
    {
      title: "My Packages",
      packages: ["Inactive"],
      repImage: PackagesImage,
      repImageAlt: "Hand holding a wallet",
    },
    {
      title: "Deposit",
      amount: 0,
      repImage: DepositImage,
      repImageAlt: "open safe with cash",
    },
    {
      title: "Cashback",
      amount: 0,
      repImage: CashbackImage,
      repImageAlt: "Stacked coins with an arrow",
    },
    {
      title: "Balance",
      amount: userBalance,
      repImage: BalanceImage,
      repImageAlt: "Wallet with cash",
    },
    {
      title: "My Withdrawals",
      amount: 0,
      repImage: WithdrawalsImage,
      repImageAlt: "Hand holding dedit card",
    },
  ];
  return (
    <div className="w-full bg-gray-100">
      <DashboardsTemplate items={items} />
    </div>
  );
};

export default DashboardItems;
