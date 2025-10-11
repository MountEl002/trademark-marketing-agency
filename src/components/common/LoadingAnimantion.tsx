interface LoadingAnimationProps {
  className?: string;
  text?: string;
}

export default function LoadingAnimantion({
  className = "",
  text,
}: LoadingAnimationProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="animate-spin grid grid-cols-2 gap-1 w-fit">
        <div className="h-2 w-2 bg-blue-700 rounded-[50%]"></div>
        <div className="h-2 w-2 bg-green-700 rounded-[50%]"></div>
        <div className="h-2 w-2 bg-yellow-600 rounded-[50%]"></div>
        <div className="h-2 w-2 bg-pink-500 rounded-[50%]"></div>
      </div>
      {text && <div>{text}</div>}
    </div>
  );
}
