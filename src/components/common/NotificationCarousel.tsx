"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface NotificationProps {
  notifications: {
    testimony: string;
    source: string;
  }[];
}

export default function NotificationCarousel({
  notifications,
}: NotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up rotation timer
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
    }, 2000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [notifications.length]);

  const currentNotification = notifications[currentIndex];

  if (!currentNotification) return null;

  return (
    <div className="vertical gap-6 w-full mx-auto max-w-4xl text-white px-6 mt-12">
      <div className="w-full bg-green-500 px-4 py-4 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="mr-2 text-black">
            <span>{currentNotification.source}</span>
            <span className="inline-block ml-1">🔔</span>
          </div>
        </div>
        <div>{currentNotification.testimony}</div>
      </div>
      <div>
        <p>Get Unlimited Bonus</p>
      </div>
      <Link
        href="/deposit"
        className="px-4 py-2 border border-green-500 rounded-lg hover:bg-green-500 tranastion-all duration-500"
      >
        Deposit
      </Link>
    </div>
  );
}
