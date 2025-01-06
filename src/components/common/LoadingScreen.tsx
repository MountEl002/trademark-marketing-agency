import React from "react";
import LoadingAnimantion from "./LoadingAnimantion";

const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 z-[70] min-w-full min-h-screen vertical gap-3 bg-black opacity-65">
      <LoadingAnimantion />
      <div>
        <p className="text-center text-gray-100 font-semibold">Please Wait</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
