import { StaticImageData } from "next/image";
import { IconType } from "react-icons";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Benefit {
  id: number;
  repIcon: IconType;
  name: string;
  description: string;
}

export interface ClientReview {
  id: number;
  clientDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
}

export interface AssuranceItem {
  id: number;
  question: string;
  description: string;
  bulletPoints?: string[];
}

export interface AssuranceItemImage {
  src: StaticImageData | string;
  alt: string;
}

export interface TableRow {
  icon: React.ReactNode;
  primaryText: string;
  secondaryText: string;
}

export interface OrderingStepImage {
  id: number;
  src: StaticImageData | string;
  alt: string;
}

export interface CreateAnOrderStep {
  id: number;
  step: string;
  stepDescription: string;
}

export interface AllServices {
  id: number;
  name: string;
  LinkTo: string;
}

export interface ServiceRepImage {
  src: StaticImageData | string;
  alt: string;
}

export interface BenefitItem {
  id: number;
  repIcon: IconType;
  name: string;
  description: string;
}

export interface BonusItem {
  id: number;
  name: string;
  initialPrice: string;
  currentPrice: string;
}
