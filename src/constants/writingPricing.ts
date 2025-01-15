// constants/WritingPricing.ts

import { PricingData, TimeFrame, AcademicLevel } from '@/types/pricing';

export const PRICING_DATA: PricingData = {
  'Middle School': {
    '10+ days': 2.50,
    '5 days': 2.70,
    '3 days': 2.90,
    '2 days': 3.10,
    '24 hrs': 3.30,
    '12 hrs': 3.50,
    '6 hrs': 3.70,
    '3 hrs': 3.90,
  },
  'High School': {
    '10+ days': 2.80,
    '5 days': 3.00,
    '3 days': 3.20,
    '2 days': 3.40,
    '24 hrs': 3.60,
    '12 hrs': 3.80,
    '6 hrs': 4.00,
    '3 hrs': 4.20,
  },
  'College': {
    '10+ days': 3.40,
    '5 days': 3.60,
    '3 days': 3.80,
    '2 days': 4.00,
    '24 hrs': 4.20,
    '12 hrs': 4.40,
    '6 hrs': 4.60,
    '3 hrs': 4.80,
  },
  'Bachelor\'s': {
    '10+ days': 3.90,
    '5 days': 4.10,
    '3 days': 4.30,
    '2 days': 4.50,
    '24 hrs': 4.70,
    '12 hrs': 4.90,
    '6 hrs': 5.10,
    '3 hrs': 5.30,
  },
  'Master\'s': {
    '10+ days': 4.40,
    '5 days': 4.60,
    '3 days': 4.80,
    '2 days': 5.00,
    '24 hrs': 5.20,
    '12 hrs': 5.40,
    '6 hrs': 5.60,
    '3 hrs': 5.80,
  },
  'PhD': {
    '10+ days': 4.90,
    '5 days': 5.10,
    '3 days': 5.30,
    '2 days': 5.50,
    '24 hrs': 5.70,
    '12 hrs': 5.90,
    '6 hrs': 6.10,
    '3 hrs': 6.30,
  },
};

// Helper functions with proper typing
export const getPrice = (level: AcademicLevel, timeframe: TimeFrame): number => {
  return PRICING_DATA[level][timeframe];
};

export const getAllTimeframes = (): TimeFrame[] => {
  return Object.keys(PRICING_DATA['High School']) as TimeFrame[];
};

export const getAllLevels = (): AcademicLevel[] => {
  return Object.keys(PRICING_DATA) as AcademicLevel[];
};

export const WritingTotalPrice = (
  academicLevel: AcademicLevel,
  deadline: TimeFrame,
  wordCount: number
): number => {
  const basePrice = getPrice(academicLevel, deadline);
    const multiplier = Math.ceil(wordCount / 275);
    const totalPrice = basePrice * multiplier;
    return Number(totalPrice.toFixed(2));
};