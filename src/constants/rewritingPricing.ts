// constants/rewritingPricing.ts

import { PricingData, TimeFrame, AcademicLevel } from "@/types/pricing";

export const PRICING_DATA: PricingData = {
  "Middle School": {
    "10+ days": 2.0,
    "5 days": 2.2,
    "3 days": 2.4,
    "2 days": 2.6,
    "24 hrs": 2.8,
    "12 hrs": 3.0,
    "6 hrs": 3.2,
    "3 hrs": 3.4,
  },
  "High School": {
    "10+ days": 2.3,
    "5 days": 2.5,
    "3 days": 2.7,
    "2 days": 2.9,
    "24 hrs": 3.1,
    "12 hrs": 3.3,
    "6 hrs": 3.5,
    "3 hrs": 3.7,
  },
  College: {
    "10+ days": 2.9,
    "5 days": 3.1,
    "3 days": 3.3,
    "2 days": 3.5,
    "24 hrs": 3.7,
    "12 hrs": 3.9,
    "6 hrs": 4.1,
    "3 hrs": 4.3,
  },
  "Bachelor's": {
    "10+ days": 3.4,
    "5 days": 3.6,
    "3 days": 3.8,
    "2 days": 4.0,
    "24 hrs": 4.2,
    "12 hrs": 4.4,
    "6 hrs": 4.6,
    "3 hrs": 4.8,
  },
  "Master's": {
    "10+ days": 3.9,
    "5 days": 4.1,
    "3 days": 4.3,
    "2 days": 4.5,
    "24 hrs": 4.7,
    "12 hrs": 4.9,
    "6 hrs": 5.1,
    "3 hrs": 5.3,
  },
  PhD: {
    "10+ days": 4.4,
    "5 days": 4.6,
    "3 days": 4.8,
    "2 days": 5.0,
    "24 hrs": 5.2,
    "12 hrs": 5.4,
    "6 hrs": 5.6,
    "3 hrs": 5.8,
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

export const rewritingTotalPrice = (
  academicLevel: AcademicLevel,
  deadline: TimeFrame,
  wordCount: number
): number => {
  const basePrice = getPrice(academicLevel, deadline);
  const multiplier = wordCount / 275;
  const totalPrice = basePrice * multiplier;
  return Number(totalPrice.toFixed(2));
};
