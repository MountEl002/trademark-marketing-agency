// constants/WritingPricing.ts

import { PricingData, TimeFrame, AcademicLevel } from "@/types/pricing";

export const PRICING_DATA: PricingData = {
  "Middle School": {
    "10+ days": 2.5,
    "5 days": 2.7,
    "3 days": 2.9,
    "2 days": 3.1,
    "24 hrs": 3.3,
    "12 hrs": 3.5,
    "6 hrs": 3.7,
    "3 hrs": 3.9,
  },
  "High School": {
    "10+ days": 2.8,
    "5 days": 3.0,
    "3 days": 3.2,
    "2 days": 3.4,
    "24 hrs": 3.6,
    "12 hrs": 3.8,
    "6 hrs": 4.0,
    "3 hrs": 4.2,
  },
  College: {
    "10+ days": 3.4,
    "5 days": 3.6,
    "3 days": 3.8,
    "2 days": 4.0,
    "24 hrs": 4.2,
    "12 hrs": 4.4,
    "6 hrs": 4.6,
    "3 hrs": 4.8,
  },
  "Bachelor's": {
    "10+ days": 3.9,
    "5 days": 4.1,
    "3 days": 4.3,
    "2 days": 4.5,
    "24 hrs": 4.7,
    "12 hrs": 4.9,
    "6 hrs": 5.1,
    "3 hrs": 5.3,
  },
  "Master's": {
    "10+ days": 4.4,
    "5 days": 4.6,
    "3 days": 4.8,
    "2 days": 5.0,
    "24 hrs": 5.2,
    "12 hrs": 5.4,
    "6 hrs": 5.6,
    "3 hrs": 5.8,
  },
  PhD: {
    "10+ days": 4.9,
    "5 days": 5.1,
    "3 days": 5.3,
    "2 days": 5.5,
    "24 hrs": 5.7,
    "12 hrs": 5.9,
    "6 hrs": 6.1,
    "3 hrs": 6.3,
  },
};

// Helper functions with proper typing
export const getPrice = (
  level: AcademicLevel,
  timeframe: TimeFrame
): number => {
  return PRICING_DATA[level][timeframe];
};

export const getAllTimeframes = (): TimeFrame[] => {
  return Object.keys(PRICING_DATA["High School"]) as TimeFrame[];
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
  const multiplier = wordCount / 275;
  const totalPrice = basePrice * multiplier;
  return Number(totalPrice.toFixed(2));
};
