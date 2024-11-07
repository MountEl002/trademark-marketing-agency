import React from "react";

interface DateDifferenceProps {
  targetDateString: string;
}

// Custom type for the calculation result
type DateDiffResult = {
  diffDays: number;
  message: string;
};

const DateDifference: React.FC<DateDifferenceProps> = ({
  targetDateString,
}) => {
  const calculateDateDifference = (): DateDiffResult => {
    const today: Date = new Date();

    try {
      // Handle different date formats (DD/MM/YYYY or YYYY-MM-DD)
      const formattedDate: string = targetDateString.includes("/")
        ? targetDateString.split("/").reverse().join("-")
        : targetDateString;

      const targetDate: Date = new Date(formattedDate);

      // Validate the date
      if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const diffTime: number = Math.abs(today.getTime() - targetDate.getTime());
      const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const message: string = `${diffDays} days ago`;

      return { diffDays, message };
    } catch (error) {
      return {
        diffDays: 0,
        message: `${error}: Please provide a valid date in DD/MM/YYYY or YYYY-MM-DD format`,
      };
    }
  };

  const { message } = calculateDateDifference();

  return <span className="text-gray-400">{message}</span>;
};

// Default props with type checking
DateDifference.defaultProps = {
  targetDateString: "22/10/2024",
} as Partial<DateDifferenceProps>;

export default DateDifference;
