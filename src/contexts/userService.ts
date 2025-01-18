// userService.ts
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TransactionType } from "@/types/transaction";

export async function getNextUserNumber(): Promise<number> {
  const result = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(doc(db, "counters", "userNumber"));

    if (!counterDoc.exists()) {
      transaction.set(doc(db, "counters", "userNumber"), {
        currentNumber: 7000,
      });
      return 7000;
    }

    const newNumber = counterDoc.data().currentNumber + 1;
    transaction.update(doc(db, "counters", "userNumber"), {
      currentNumber: newNumber,
    });

    return newNumber;
  });

  return result;
}

export async function initializeUserDocuments(userId: string, email: string | null, userNumber: number) {
  // Create user profile
  await setDoc(doc(db, "users", userId), {
    email: email,
    userNumber: userNumber,
    createdAt: new Date().toISOString(),
  });

  // Create balance document
  await setDoc(doc(db, "balances", userId), {
    currentBalance: 10,
    lastUpdated: new Date().toISOString(),
  });

  // Create transactions document with initial deposit
  await setDoc(doc(db, "transactions", userId), {
    transactions: [{
      type: 'deposit' as TransactionType,
      amount: 10,
      timestamp: new Date().toISOString(),
      description: 'Welcome bonus'
    }]
  });
}