// types.ts
import { FileUploadStatus } from "@/lib/constants";
import { User } from "firebase/auth";

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
    isCodeValid: boolean | null,
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

export interface UserDoc {
  userId: string;
  createdAt: string;
  currentBalance: number;
  email: string;
  unreadNotifications: number;
  username: string;
  phoneNumber: string;
}
