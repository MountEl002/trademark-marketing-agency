import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 z-[70] min-w-full min-h-screen vertical gap-3 bg-black opacity-65">
      <div className="animate-spin h-10 w-10 border-4 border-gray-100 border-t-transparent rounded-[50%]"></div>
      <div>
        <p className="text-center text-gray-100 font-semibold">Please Wait</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
