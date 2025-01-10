// types/pricing.ts

export type TimeFrame = '10+ days' | '5 days' | '3 days' | '2 days' | '24 hrs' | '12 hrs' | '6 hrs' | '3 hrs';
export type AcademicLevel = 'Middle School' | 'High School' | 'College' | 'Bachelor\'s' | 'Master\'s' | 'PhD';

export type PricingByTimeFrame = Record<TimeFrame, number>;
export type PricingData = Record<AcademicLevel, PricingByTimeFrame>;