"use client";

import { useState } from "react";
import { format, addHours, addDays } from "date-fns";
import { IoChevronDown } from "react-icons/io5";

interface DeadlineSelectorProps {
  value:
    | {
        date: string;
        formattedDate: string;
      }
    | string; // Include string type for backward compatibility
  onChange: (value: { date: string; formattedDate: string }) => void;
}
interface PopularButtons {
  id: number;
  name: string;
  hours: number;
}

const popularButtons: PopularButtons[] = [
  { id: 1, name: "3 hours", hours: 3 },
  { id: 2, name: "6 hours", hours: 6 },
  { id: 3, name: "12 hours", hours: 12 },
  { id: 4, name: "1 day", hours: 24 },
  { id: 5, name: "2 days", hours: 48 },
  { id: 6, name: "3 days", hours: 72 },
  { id: 7, name: "5 days", hours: 120 },
  { id: 8, name: "7 days", hours: 168 },
  { id: 9, name: "10 days", hours: 240 },
];

const DeadlineSelector = ({ value, onChange }: DeadlineSelectorProps) => {
  // Extract date and time from value prop if it exists
  const extractDateTime = () => {
    if (!value || typeof value === "string") {
      console.log("Value/deadline not found or in old format");
      return { date: "", time: "" };
    }

    try {
      const date = new Date(value.date);
      return {
        date: format(date, "yyyy-MM-dd"),
        time: format(date, "HH:mm"),
      };
    } catch (error) {
      console.log("Error parsing date:", error);
      return { date: "", time: "" };
    }
  };

  const { date, time } = extractDateTime();
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedTime, setSelectedTime] = useState(time);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

  // Function to handle popular button clicks
  const handlePopularButtonClick = (button: PopularButtons) => {
    const now = new Date();
    let targetDate: Date;

    if (button.name.includes("days")) {
      targetDate = addDays(now, button.hours / 24);
    } else {
      targetDate = addHours(now, button.hours);
    }

    setSelectedDate(format(targetDate, "yyyy-MM-dd"));
    setSelectedTime(format(targetDate, "HH:mm"));
    setActiveButtonId(button.id);
    setErrorMessage("");

    setTimeout(() => {
      setActiveButtonId(null);
    }, 1000 * 60);
  };

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMessage("Please select both date and time");
      return;
    }
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    const minDeadline = new Date(
      now.getTime() + 3 * 60 * 60 * 1000 - 1000 * 60 * 10
    ); // 3 hours from now with a 10 minutes slippage

    if (selectedDateTime < minDeadline) {
      setErrorMessage("Deadline must be at least 1 hour from now");
      return;
    }

    const formattedDate = format(selectedDateTime, "MMMM d, yyyy HHmm'hrs'");
    onChange({
      date: selectedDateTime.toISOString(),
      formattedDate: formattedDate,
    });
  };

  return (
    <div className="Vertical-start p-4">
      <p className="order-form-field-title">Deadline</p>

      {/* Date and time selection  */}
      <div className="flex flex-row items-center justify-start gap-8 md:gap-3 my-6 w-full">
        {/* Date Selection */}
        <div className="w-fit">
          <label className="block text-sm text-gray-400">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setErrorMessage("");
            }}
            className="block w-full px-3 py-2 text-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Selection */}
        <div className="w-fit">
          <label className="block text-sm text-gray-400">Select Time</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              setErrorMessage("");
            }}
            className="block w-full px-3 py-2 text-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {errorMessage && (
        <p className="animate-pulse text-red-600 text-sm">{errorMessage}</p>
      )}

      {/* Popular Buttons */}
      <div className="my-8">
        <p className="text-gray-500 text-sm">Popular:</p>
        <div className="container">
          <div className="order-form-buttons">
            {popularButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handlePopularButtonClick(button)}
                className={`py-2 px-3 w-fit rounded-lg text-sm transition-all duration-500 ${
                  activeButtonId === button.id
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-600 hover:text-blue-500"
                }`}
              >
                {button.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="order-form-save-button">
        <button
          onClick={handleSave}
          className="group transition-all duration-500"
        >
          Save Deadline
          <IoChevronDown
            size={30}
            className="chev-icon group-hover:bg-blue-500"
          />
        </button>
      </div>
    </div>
  );
};

export default DeadlineSelector;
