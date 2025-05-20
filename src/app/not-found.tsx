"use client";

import Chat from "@/components/common/Chat";
import UniversalButton from "@/components/common/UniversalButton";
import Navbar from "@/components/layout/Navbar";
import { LuLayoutDashboard } from "react-icons/lu";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <Chat />
      <div className="min-h-screen vertical gap-10 text-center bg-blue-100">
        <h1>404: Page Not Found</h1>
        <p className="mb-8 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <UniversalButton
          icon={LuLayoutDashboard}
          text="Go to Dashboard"
          onClick={() => (window.location.href = "/customer/dashboards")}
          buttonClassName="bg-blue-500 hover:bg-blue-600"
          iconClassName="bg-blue-300 group-hover:bg-blue-400"
        />
      </div>
    </>
  );
};

export default NotFound;
