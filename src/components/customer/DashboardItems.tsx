"use client";

import React, { useEffect, useState } from "react";
import { DashboardItemTemplate } from "@/types/trademark";
import WhatsappImage from "@/assests/WhatsappLogo.png";
import WhatsappWithdrawalsImage from "@/assests/WithdrawalsOne.png";
import WithdrawalsImage from "@/assests/WithdrawalsTwo.png";
import PackagesImage from "@/assests/MyPackages.png";
import CashbackImage from "@/assests/Cashback.png";
import BalanceImage from "@/assests/Balance.png";
import Specialpackages from "@/assests/SpecialPackages.png";
import DashboardsTemplate from "./DashboardsTemplate";
import {
  getUserBalance,
  getUserPackageNames,
  getUserPackageValue,
  getUserPayments,
  getUserSpecialPackageNames,
} from "@/contexts/userService";
import { useAuth } from "@/contexts/AuthContext";

const DashboardItems = () => {
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userPayments, setUserPayments] = useState<number>(0);
  const [userCashback, setUserCashback] = useState<number>(0);
  const [formattedPackagesString, setFormattedPackagesString] =
    useState<string>("Inactive");
  const [formattedSpecialPackagesString, setFormattedSpecialPackagesString] =
    useState<string>("Inactive");

  // Format package names to a grammatically correct string with counts
  const formatPackagesToString = (packages: string[]): string => {
    if (packages.length === 0) {
      return "Inactive";
    }

    // Count occurrences of each package
    const packageCounts: Record<string, number> = {};
    packages.forEach((pkg) => {
      const normalizedPkg = pkg.trim();
      if (normalizedPkg) {
        packageCounts[normalizedPkg] = (packageCounts[normalizedPkg] || 0) + 1;
      }
    });

    // Format each package with its count
    const formattedItems = Object.entries(packageCounts).map(
      ([name, count]) => {
        return count > 1 ? `${name} (${count})` : name;
      }
    );

    // Create grammatically correct string with proper Oxford comma and "and"
    if (formattedItems.length === 1) {
      return formattedItems[0];
    } else if (formattedItems.length === 2) {
      return `${formattedItems[0]} and ${formattedItems[1]}`;
    } else {
      const lastItem = formattedItems.pop();
      return `${formattedItems.join(", ")}, and ${lastItem}`;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        // Fetch the user's balance
        const balance = await getUserBalance(user.uid);
        setUserBalance(balance);

        // Fetch the user's payments
        const payments = await getUserPayments(user.uid);
        setUserPayments(payments);

        const cashback = await getUserPackageValue(user.uid);
        setUserCashback(cashback);

        // Fetch the user's package names
        const packageNames = await getUserPackageNames(user.uid);
        // Format the packages into a string for display
        if (packageNames.length > 0) {
          setFormattedPackagesString(formatPackagesToString(packageNames));
        } else {
          setFormattedPackagesString("You have no packages");
        }

        const specialPackageNames = await getUserSpecialPackageNames(user.uid);
        // Format the spcial packages into a string for display
        if (specialPackageNames.length > 0) {
          setFormattedSpecialPackagesString(
            formatPackagesToString(specialPackageNames)
          );
        } else {
          setFormattedSpecialPackagesString("You have no special packages");
        }
      } else {
        setUserBalance(0);
        setFormattedPackagesString("You have no packages");
        setFormattedSpecialPackagesString("You have no special packages");
      }
    };
    fetchUserData();
  }, [user?.uid]);

  const doubleCashback = userCashback * 2;

  const items: DashboardItemTemplate[] = [
    {
      title: "Whatsapp Earnings",
      amount: userPayments,
      repImage: WhatsappImage,
      repImageAlt: "Whatsapp logo",
    },
    {
      title: "Earning Withdrawals",
      amount: 0,
      repImage: WhatsappWithdrawalsImage,
      repImageAlt: "Hand holding dedit card",
    },
    {
      title: "My Packages",
      packages: formattedPackagesString,
      repImage: PackagesImage,
      repImageAlt: "Hand holding a wallet",
    },
    {
      title: "My Special Packages",
      packages: formattedSpecialPackagesString,
      repImage: Specialpackages,
      repImageAlt: "Hand holding a wallet",
    },
    {
      title: "Cashback",
      amount: doubleCashback,
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
