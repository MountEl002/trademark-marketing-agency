// userService.ts
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    balance: 0,
    createdAt: serverTimestamp(),
  };
  batch.set(userDocRef, userData);

  if (username) {
    const userNameDocRef = doc(db, "userNames", username);
    batch.set(userNameDocRef, { userId: userId });
  }
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

export async function getUserBalance(userId: string): Promise<number> {
  if (!userId) {
    console.error("getUserBalance: userId is required.");
    return 0;
  }

  const userDocRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const balanceValue =
        typeof userData.balance === "number" ? userData.balance : 0;
      return parseFloat(balanceValue.toFixed(2));
    } else {
      // User document does not exist
      console.warn(
        `User document not found for userId: ${userId}. Returning 0.00 balance.`
      );
      return 0;
    }
  } catch (error) {
    console.error("Error fetching user balance for userId:", userId, error);
    // In case of any other error (e.g., network issue, permissions)
    return 0;
  }
}
