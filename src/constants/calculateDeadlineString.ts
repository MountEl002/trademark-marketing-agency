export function calculateDeadlineString(deadlineDate: string): string {
  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffInHours = parseFloat(((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)).toFixed(1));
  const diffInDays = parseFloat((diffInHours / 24).toFixed(1));

  // Determine deadline category
  const getCategory = (): number => {
    switch (true) {
      case diffInDays >= 7.5:
        return 1; // 10+ days
      case diffInDays >= 4:
        return 2; // 5 days
      case diffInDays >= 2.5:
        return 3; // 3 days
      case diffInDays >= 1.5:
        return 4; // 2 days
      case diffInHours >= 18:
        return 5; // 24 hrs
      case diffInHours >= 9:
        return 6; // 12 hrs
      case diffInHours >= 4.5:
        return 7; // 6 hrs
      default:
        return 8; // 3 hrs (rounded up)
    }
  };

  // Get deadline string based on category
  const deadlineString = (() => {
    switch (getCategory()) {
      case 1:
        return '10+ days';
      case 2:
        return '5 days';
      case 3:
        return '3 days';
      case 4:
        return '2 days';
      case 5:
        return '24 hrs';
      case 6:
        return '12 hrs';
      case 7:
        return '6 hrs';
      default:
        return '3 hrs';
    }
  })();

  return deadlineString;
}