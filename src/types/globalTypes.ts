// types.ts
import {
  BalanceType,
  CommonRoute,
  CustomerTransactionType,
  FileUploadStatus,
  OrderStatus,
  OtherRoute,
} from "@/lib/constants";
import { User } from "firebase/auth";

export interface RouteObjectProps {
  id: number;
  name: string;
  linkTo: OtherRoute | CommonRoute;
}

export interface CustomerTransaction {
  type: CustomerTransactionType;
  amount: number;
  timestamp: string;
  description: string;
  orderNumber?: number;
}

export interface AuthContextType {
  user: User | null;
  userData: UserDoc | null;
  isAdmin: boolean;
  username: string | null;
  // hasUserData: boolean;
  errorFetchingUserData: string | null;
  loading: boolean;
  // loggingOut: boolean;
  signup: (
    email: string,
    password: string,
    mobile: string,
    username: string,
    country: string,
    referralCode: string | null,
    isCodeValid: boolean | null
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook?: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface UploadedFileInfo {
  fileKey: string;
  fileName: string;
  fileUrl?: string;
  progress: number;
  status: FileUploadStatus;
  id: string;
  file?: File;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface OrderData {
  docId?: string;
  userNumber: string;
  orderNumber: number;
  userId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  assignmentType: string;
  service: string;
  academicLevel: string;
  language: string;
  size: string;
  words: number;
  deadline: {
    date: string;
    formattedDate: string;
  };
  addOns: string;
  addOnsTotalPrice: number;
  topic: string;
  subject: string;
  instructions: string;
  orderFiles: UploadedFileInfo[];
  instructionsPreview: string;
  price: number;
  sources: string;
  style: string;
  userBalance: number;
  submissionFiles?: UploadedFileInfo[];
  submissionDetails?: string;
  timeOfSubmission?: string;
  ratingByCustomer?: number;
}

export interface UserDoc {
  userId: string;
  createdAt: string;
  currentBalance: number;
  email: string;
  unreadNotifications: number;
  username: string;
  phoneNumber: string;
}

export interface BalanceUpdateInfo {
  userId: string;
  balanceType: BalanceType;
  newBalance: number;
}
