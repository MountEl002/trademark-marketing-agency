// types.ts
import { User } from "firebase/auth";
export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  username: string | null;
  loading: boolean;
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
  resetPassword: (email: string) => Promise<void>;
}
