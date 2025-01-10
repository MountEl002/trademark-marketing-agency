// constants/pricing.ts

import { PricingData, TimeFrame, AcademicLevel } from '@/types/pricing';

export const PRICING_DATA: PricingData = {
  'Middle School': {
    '10+ days': 1.50,
    '5 days': 1.70,
    '3 days': 1.90,
    '2 days': 2.10,
    '24 hrs': 2.30,
    '12 hrs': 2.50,
    '6 hrs': 2.70,
    '3 hrs': 2.90,
  },
  'High School': {
    '10+ days': 1.80,
    '5 days': 2.00,
    '3 days': 2.20,
    '2 days': 2.40,
    '24 hrs': 2.60,
    '12 hrs': 2.80,
    '6 hrs': 3.00,
    '3 hrs': 3.20,
  },
  'College': {
    '10+ days': 2.40,
    '5 days': 2.60,
    '3 days': 2.80,
    '2 days': 3.00,
    '24 hrs': 3.20,
    '12 hrs': 3.40,
    '6 hrs': 3.60,
    '3 hrs': 3.80,
  },
  'Bachelor\'s': {
    '10+ days': 2.90,
    '5 days': 3.10,
    '3 days': 3.30,
    '2 days': 3.50,
    '24 hrs': 3.70,
    '12 hrs': 3.90,
    '6 hrs': 4.10,
    '3 hrs': 4.30,
  },
  'Master\'s': {
    '10+ days': 3.40,
    '5 days': 3.60,
    '3 days': 3.80,
    '2 days': 4.00,
    '24 hrs': 4.20,
    '12 hrs': 4.40,
    '6 hrs': 4.60,
    '3 hrs': 4.80,
  },
  'PhD': {
    '10+ days': 3.90,
    '5 days': 4.10,
    '3 days': 4.30,
    '2 days': 4.50,
    '24 hrs': 4.70,
    '12 hrs': 4.90,
    '6 hrs': 5.10,
    '3 hrs': 5.30,
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