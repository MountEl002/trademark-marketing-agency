"use client";

import { useState } from "react";
import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

interface DeadlineSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DeadlineSelector = ({ value, onChange }: DeadlineSelectorProps) => {
  // Extract date and time from value prop if it exists
  const extractDateTime = () => {
    if (!value) return { date: "", time: "" };

    try {
      const dateStr = value.split("(")[0].trim();
      const date = new Date(dateStr);
      return {
        date: format(date, "yyyy-MM-dd"),
        time: format(date, "HH:mm"),
      };
    } catch {
      return { date: "", time: "" };
    }
  };

  const { date, time } = extractDateTime();
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedTime, setSelectedTime] = useState(time);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to format the countdown string
  const getCountdownString = (targetDate: Date) => {
    const now = new Date();
    const days = differenceInDays(targetDate, now);
    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;

    if (days > 0) {
      return `Due in ${days} day${days > 1 ? "s" : ""} ${hours} hour${
        hours !== 1 ? "s" : ""
      } ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Due in ${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }`;
    } else if (minutes > 0) {
      return `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      return "Deadline expired. Please select a new deadline";
    }
  };

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMessage("Please select both date and time");
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    const minDeadline = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    if (selectedDateTime < minDeadline) {
      setErrorMessage("Deadline must be at least 1 hour from now");
      return;
    }

    const formattedDate = format(selectedDateTime, "MMMM d, yyyy HHmm'hrs'");
    const countdownString = getCountdownString(selectedDateTime);
    const deadlineString = `${formattedDate} (${countdownString})`;
    onChange(deadlineString);
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setErrorMessage("");
          }}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Time
        </label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => {
            setSelectedTime(e.target.value);
            setErrorMessage("");
          }}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button
        onClick={handleSave}
        disabled={!selectedDate || !selectedTime}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          !selectedDate || !selectedTime
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Save Deadline
      </button>
    </div>
  );
};

export default DeadlineSelector;
