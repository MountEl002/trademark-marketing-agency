// types.ts
import { User } from "firebase/auth";

export type TransactionType = 'deposit' | 'withdrawal' | 'refund' | 'order-payment';

export interface Transaction {
  type: TransactionType;
  amount: number;
  timestamp: string;
  description: string;
}

export interface AuthContextType {
  user: User | null;
  userNumber: string | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}