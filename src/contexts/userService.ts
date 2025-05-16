// userService.ts
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TransactionType } from "@/types/transaction";

export async function verifyUsername(username: string): Promise<boolean> {
  if (!username || username.trim() === "") {
    return true;
  }
  const normalizedUsername = username.toLowerCase();
  const usernameDocRef = doc(db, "userNames", normalizedUsername);
  const docSnap = await getDoc(usernameDocRef);
  return docSnap.exists();
}

export async function initializeUserDocuments(
  userId: string,
  email: string | null,
  mobile: string | null,
  username: string | null,
  country: string | null
) {
  const batch = writeBatch(db);

  // 1. User Profile Document
  const userDocRef = doc(db, "users", userId);
  const userData: { [key: string]: unknown } = {
    userId: userId, // Add userId field
    email: email,
    mobile: mobile,
    username: username,
    country: country,
    createdAt: serverTimestamp(),
  };
  batch.set(userDocRef, userData);

  if (username) {
    const userNameDocRef = doc(db, "userNames", username);
    batch.set(userNameDocRef, { userId: userId });
  }

  // 3. Balance Document
  const balanceDocRef = doc(db, "balances", userId);
  batch.set(balanceDocRef, {
    currentBalance: 10, // Welcome bonus
    lastUpdated: serverTimestamp(),
  });

  // 4. Transactions Document with Initial Deposit
  const transactionDocRef = doc(db, "transactions", userId);
  batch.set(transactionDocRef, {
    transactions: [
      {
        type: "deposit" as TransactionType,
        amount: 10,
        timestamp: new Date().toTimeString(),
        description: "Welcome bonus",
      },
    ],
  });

  await batch.commit();
}

// --- Functions for the new profile completion page ---
export async function updateUserProfileAndUsername(
  userId: string,
  newData: { username: string; mobile: string; country: string }
): Promise<void> {
  const batch = writeBatch(db);
  const userDocRef = doc(db, "users", userId);
  // Update user document
  batch.update(userDocRef, {
    username: newData.username,
    mobile: newData.mobile,
    country: newData.country,
  });

  const newUsernameRef = doc(db, "userNames", newData.username);
  batch.set(newUsernameRef, { userId: userId });

  await batch.commit();
}
