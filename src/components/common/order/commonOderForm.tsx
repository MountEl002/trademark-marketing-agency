"use client";

import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import ContinueWith from "../login/ContinueWith";
import EmailInfo from "../login/EmailInfo";
interface CommnOrderFormProps {
  onSubmit?: (formData: {
    email: string;
    pages: number;
    deadline: Date;
    totalAmount: number;
  }) => void;
}

const CommnOrderForm: React.FC<CommnOrderFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [pages, setPages] = useState(1);
  const [deadline, setDeadline] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });
  const [timeLeft, setTimeLeft] = useState("");

  const WORDS_PER_PAGE = 275;
  const PRICE_PER_PAGE = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Deadline expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
      } else if (days <= 0 && hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const now = new Date();
    const minTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    if (selectedDate < minTime) {
      alert("Please select a time at least 1 hour from now");
      return;
    }

    setDeadline(selectedDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      email,
      pages,
      deadline,
      totalAmount: pages * PRICE_PER_PAGE,
    });
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto p-6 border-2 bg-white rounded-xl shadow-lg">
        <h2>Place an order</h2>
        <div className="horizontal">
          <ContinueWith />
        </div>
        <div className="flex flex-row items-center gap-3 my-5">
          <div className="w-full h-0 border-[0.5px] border-gray-200"></div>
          <div className="text-center text-gray-500">or</div>
          <div className="w-full h-0 border-[1px] border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2 text-start">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <EmailInfo />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2 text-start">
              Pages
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-between  w-[60%] border border-gray-300 rounded-lg px-3">
                <button
                  type="button"
                  onClick={() => setPages(Math.max(1, pages - 1))}
                  className="p-2 hover:bg-gray-300 rounded-[50%]"
                >
                  <FaMinus className="w-5 h-5 text-gray-500" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {pages}
                </span>
                <button
                  type="button"
                  onClick={() => setPages(pages + 1)}
                  className="p-2 hover:bg-gray-300 rounded-[50%]"
                >
                  <FaPlus className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500">
                  {pages * WORDS_PER_PAGE} words
                </span>
                <span className="text-gray-600 font-semibold">
                  ${pages * PRICE_PER_PAGE}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2 text-start">
              Deadline
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="datetime-local"
                  onChange={handleDateTimeChange}
                  min={new Date(Date.now() + 3600000)
                    .toISOString()
                    .slice(0, 16)}
                  defaultValue={deadline.toISOString().slice(0, 16)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
                />
              </div>
              <span className="text-blue-500 min-w-[100px]">{timeLeft}</span>
            </div>
          </div>

          <button type="submit" className="button-blue">
            Place your order
          </button>

          <p className="google-recaptcha text-sm text-gray-400 mt-4">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy?hl=en-US">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms?hl=en-US">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </form>
      </div>
    </>
  );
};

export default CommnOrderForm;
