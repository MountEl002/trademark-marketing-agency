"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getChatUserNumber } from "@/utils/initialize-chat";
import { IoClose, IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import ChatBackground from "@/assests/chatbackgroundResized.png";
import CustomerCareAgent4 from "@/assests/CustomerCareAgent4.jpg";

const Chat = () => {
  const [userNumber, setUserNumber] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const number = await getChatUserNumber();
        setUserNumber(number);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="fixed z-[100] bg-blue-100 top-32 right-3 w-[32rem] rounded-lg shadow-xl overflow-hidden">
      <div
        className="flex flex-col h-[80vh]" // Changed to flex container with fixed height
        style={{
          backgroundImage: `url(${ChatBackground.src})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header - fixed height */}
        <div className="horizontal-space-between w-full bg-blue-200 p-3">
          <div className="horizontal gap-2">
            <div className="bg-white p-2 rounded-[50%]">
              <FaUser />
            </div>
            <p className="font-semibold">
              Customer {userNumber || "Loading..."}
            </p>
          </div>
          <IoClose size={30} />
        </div>

        {/* Messages container - flexible height */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto p-2">
          <div className="flex flex-col space-y-2">
            {/* Message Container 1 */}
            <div className="flex flex-row h-fit gap-2">
              <Image
                src={CustomerCareAgent4}
                alt="Image of the customer care agent"
                className="rounded-img h-10 w-10 flex-shrink-0"
              />
              <div className="relative max-w-[75%] bg-blue-600 text-white p-2 rounded-lg">
                <p className="text-sm">Message from admin</p>
                <div className="absolute left-[-8px] top-3 h-0 w-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-blue-600 border-b-[8px] border-b-transparent" />
              </div>
            </div>
            {/* Message Container 2 */}
            <div className="flex flex-row-reverse justify-start w-full h-fit gap-2">
              <div className="bg-white p-2 h-fit w-fit rounded-[50%] flex-shrink-0">
                <FaUser size={22} />
              </div>
              <div className="relative max-w-[75%] bg-green-600 text-white p-2 rounded-lg">
                <p className="text-sm">Message from customer</p>
                <div className="absolute right-[-8px] top-3 h-0 w-0 border-t-[8px] border-t-transparent border-l-[8px] border-l-green-600 border-b-[8px] border-b-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Input area - fixed height */}
        <div className="horizontal-start w-full h-20 bg-gray-100 p-1">
          <div className="w-[90%] h-full border border-blue-500 rounded-lg">
            <textarea
              name="message"
              id="message"
              placeholder="Message"
              className="w-full h-full p-2 bg-transparent outline-none resize-none" // Added resize-none
            ></textarea>
          </div>
          <div className="vertical gap-3 w-[10%] h-full bg-transparent">
            <div>
              <GrAttachment />
            </div>
            <button>
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
