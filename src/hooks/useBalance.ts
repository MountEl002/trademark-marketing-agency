// src/hooks/useBalance.ts
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

// interface BalanceData {
//   currentBalance: number;
//   lastUpdated: string;
// }

export async function getUserBalance(userId: string): Promise<number> {
  try {
    const balanceDoc = await getDoc(doc(db, "balances", userId));
    if (!balanceDoc.exists()) {
      console.error("No balance document found for user");
      return 0;
    }
    return balanceDoc.data().currentBalance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const balance = await getUserBalance(user.uid);
        setBalance(balance);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
        console.error('Error fetching balance:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [user]);

  return { balance, loading, error };
}