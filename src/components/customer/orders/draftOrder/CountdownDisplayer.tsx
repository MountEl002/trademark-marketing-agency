import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

interface CountdownDisplayProps {
  targetDate: string;
}

const CountdownDisplayer = ({ targetDate }: CountdownDisplayProps) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const getCountdownString = () => {
      const target = new Date(targetDate);
      const now = new Date();

      if (now > target) {
        return "Your deadline has expired, please select a new deadline.";
      }

      const days = differenceInDays(target, now);
      const hours = differenceInHours(target, now) % 24;
      const minutes = differenceInMinutes(target, now) % 60;

      if (days > 0) {
        const hoursString =
          hours > 0 ? ` ${hours} hour${hours !== 1 ? "s" : ""}` : "";
        const minutesString =
          minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? "s" : ""}` : "";
        return `Due in ${days} day${
          days !== 1 ? "s" : ""
        }${hoursString}${minutesString}`;
      } else if (hours > 0) {
        const minutesString =
          minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? "s" : ""}` : "";
        return `Due in ${hours} hour${hours !== 1 ? "s" : ""}${minutesString}`;
      } else if (minutes > 0) {
        return `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      }
      return "Due now";
    };

    const updateCountdown = () => {
      setCountdown(getCountdownString());
    };

    // Update immediately
    updateCountdown();

    // Then update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="text-gray-500">{countdown}</span>;
};

export default CountdownDisplayer;
