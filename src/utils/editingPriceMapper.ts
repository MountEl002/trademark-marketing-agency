import { getAllLevels, getAllTimeframes, editingTotalPrice } from '@/constants/editingPricing';
import { AcademicLevel, TimeFrame } from '@/types/pricing';

// Type guard to check if a string is a valid AcademicLevel
const isValidAcademicLevel = (level: string): level is AcademicLevel => {
  return ['Middle School', 'High School', 'College', 'Bachelor\'s', 'Master\'s', 'PhD'].includes(level);
};

// Type guard to check if a string is a valid TimeFrame
const isValidTimeFrame = (timeframe: string): timeframe is TimeFrame => {
  return ['10+ days', '5 days', '3 days', '2 days', '24 hrs', '12 hrs', '6 hrs', '3 hrs'].includes(timeframe);
};

type MapperResult = {
  error?: string;
  price?: number;
};

export const editingPriceMapper = (
  academicLevelStr: string,
  deadlineStr: string,
  wordCount: number | string
): MapperResult => {
  try {
    // Validate academic level
    if (!isValidAcademicLevel(academicLevelStr)) {
      return {
        error: `Invalid academic level: ${academicLevelStr}. Valid levels are: ${getAllLevels().join(', ')}`
      };
    }

    // Validate deadline
    if (!isValidTimeFrame(deadlineStr)) {
      return {
        error: `Invalid deadline: ${deadlineStr}. Valid deadlines are: ${getAllTimeframes().join(', ')}`
      };
    }

    // Convert and validate word count
    const numericWordCount = typeof wordCount === 'string' ? parseInt(wordCount, 10) : wordCount;
    
    if (isNaN(numericWordCount) || numericWordCount <= 0) {
      return {
        error: 'Word count must be a positive number'
      };
    }

    // Calculate price using the original function
    const price = editingTotalPrice(
      academicLevelStr as AcademicLevel,
      deadlineStr as TimeFrame,
      numericWordCount
    );

    return {
      price
    };
  } catch (error) {
    console.log(error)
    return {
      error: 'An unexpected error occurred while calculating the price'
    };
  }
};