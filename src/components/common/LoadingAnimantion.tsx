import React from "react";

interface LoadingAnimationProps {
  className?: string;
}

const LoadingAnimantion = ({ className = "" }: LoadingAnimationProps) => {
  return (
    <div className={`${className}`}>
      <div className="animate-spin grid grid-cols-2 gap-1 w-fit m-10">
        <div className="h-2 w-2 bg-blue-700 rounded-[50%]"></div>
        <div className="h-2 w-2 bg-green-700 rounded-[50%]"></div>
        <div className="h-2 w-2 bg-yellow-600 rounded-[50%]"></div>
        <div className="h-2 w-2 bg-pink-500 rounded-[50%]"></div>
      </div>
    </div>
  );
};

export default LoadingAnimantion;
