import React from "react";

interface DateDifferenceProps {
  targetDateString: string;
}

// Custom type for the calculation result
type DateDiffResult = {
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
      let message: string;

      // Validate the date
      if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const diffTime: number = Math.abs(today.getTime() - targetDate.getTime());
      const diffMinutes: number = Math.round(diffTime / 6000);

      const diffHours: number = Math.round(diffTime / 3600000);
      const diffDays: number = Math.round(diffTime / 86400000);
      const diffWeeks: number = Math.round(diffTime / 604800000);
      const diffMonths: number = Math.round(diffTime / 2629746000);
      const diffYears: number = Math.round(diffTime / 31556952000);

      if (diffMinutes < 60) {
        message =
          diffMinutes === 1
            ? `${diffMinutes} minute ago`
            : `${diffMinutes} minutes ago`;
      } else if (diffMinutes >= 60 && diffHours < 24) {
        message =
          diffHours === 1 ? `${diffHours} hour ago` : `${diffHours} hours ago`;
      } else if (diffHours >= 24 && diffDays < 7) {
        message =
          diffDays === 1 ? `${diffDays} day ago` : `${diffDays} days ago`;
      } else if (diffDays >= 7 && diffWeeks < 4.3) {
        message =
          diffWeeks === 1 ? `${diffWeeks} week ago` : `${diffWeeks} weeks ago`;
      } else if (diffWeeks >= 4.3 && diffMonths < 12) {
        message =
          diffMonths === 1
            ? `${diffMonths} month ago`
            : `${diffMonths} months ago`;
      } else {
        message =
          diffYears === 1 ? `${diffYears} year ago` : `${diffYears} years ago`;
      }

      return { message };
    } catch (error) {
      return {
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
