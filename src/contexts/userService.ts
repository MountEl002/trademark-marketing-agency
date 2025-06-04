// userService.ts
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  collection,
  getDocs,
  query,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
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

export async function verifyReferralCode(
  referralCode: string
): Promise<boolean> {
  const normalizedReferralCode = referralCode;
  const referralCodeDocRef = doc(db, "userNames", normalizedReferralCode);
  const docSnap = await getDoc(referralCodeDocRef);
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
    userId: userId,
    email: email,
    mobile: mobile,
    username: username,
    country: country,
    balance: 0,
    payments: 0,
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

export async function getUserPayments(userId: string): Promise<number> {
  if (!userId) {
    console.error("getUserBalance: userId is required.");
    return 0;
  }

  const userDocRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const paymentValue =
        typeof userData.payments === "number" ? userData.payments : 0;
      return parseFloat(paymentValue.toFixed(2));
    } else {
      console.warn(
        `User document not found for userId: ${userId}. Returning 0.00 payments.`
      );
      return 0;
    }
  } catch (error) {
    console.error("Error fetching user payments for userId:", userId, error);
    return 0;
  }
}

export async function getUserPackageNames(userId: string): Promise<string[]> {
  if (!userId) {
    console.error("getUserPackageNames: userId is required.");
    return [];
  }

  try {
    // Reference to the packages subcollection of the specific user
    const packagesCollectionRef = collection(db, "users", userId, "packages");
    const packagesQuery = query(packagesCollectionRef);
    const querySnapshot = await getDocs(packagesQuery);

    // Extract packageName from each document
    const packageNames: string[] = [];
    querySnapshot.forEach((doc) => {
      const packageData = doc.data();
      if (packageData.packageName) {
        packageNames.push(packageData.packageName);
      }
    });

    return packageNames;
  } catch (error) {
    console.error("Error fetching package names for userId:", userId, error);
    return [];
  }
}

export async function getUserSpecialPackageNames(
  userId: string
): Promise<string[]> {
  if (!userId) {
    console.error("getUserSpecialPackageNames: userId is required.");
    return [];
  }

  try {
    // Reference to the extra packages subcollection of the specific user
    const packagesCollectionRef = collection(
      db,
      "users",
      userId,
      "extraPackages"
    );
    const packagesQuery = query(packagesCollectionRef);
    const querySnapshot = await getDocs(packagesQuery);

    // Extract packageName from each document
    const packageNames: string[] = [];
    querySnapshot.forEach((doc) => {
      const packageData = doc.data();
      if (packageData.packageName) {
        packageNames.push(packageData.packageName);
      }
    });

    return packageNames;
  } catch (error) {
    console.error(
      "Error fetching special package names for userId:",
      userId,
      error
    );
    return [];
  }
}

// Package values
const PACKAGE_VALUES: { [key: string]: number } = {
  "Premium Code": 600,
  Bronze: 850,
  Gold: 3000,
  Silver: 1750,
  "Early Payment": 450,
  Basic: 350,
};

export async function getUserPackageValue(userId: string): Promise<number> {
  if (!userId) {
    console.error("getUserPackageValue: userId is required.");
    return 0;
  }

  try {
    const packageNames = await getUserPackageNames(userId);
    let totalValue = 0;
    const packageCounts: { [key: string]: number } = {};
    packageNames.forEach((packageName) => {
      packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
    });

    Object.entries(packageCounts).forEach(([packageName, count]) => {
      const packageValue = PACKAGE_VALUES[packageName];
      if (packageValue) {
        totalValue += packageValue * count;
      } else {
        console.warn(`Package value not found for: ${packageName}`);
      }
    });
    return totalValue;
  } catch (error) {
    console.error("Error calculating package value for userId:", userId, error);
    return 0;
  }
}

export async function processReferral(
  currentUserId: string | undefined,
  currentUserUsername: string | null,
  referralCode: string | null,
  isCodeValid: boolean | null
) {
  if (!currentUserUsername) {
    console.error("Username is required to process referral");
    return false;
  }

  try {
    // Always create a document for the current user in referrals collection
    const userReferralDocRef = doc(db, "referrals", currentUserUsername);
    await setDoc(userReferralDocRef, {
      userId: currentUserId,
      packages: [],
      createdAt: new Date(),
      referrals: 0,
    });

    if (isCodeValid && referralCode) {
      const normalizedCode = referralCode.trim();
      const referrerDocRef = doc(db, "referrals", normalizedCode);
      try {
        const referrerDoc = await getDoc(referrerDocRef);

        if (referrerDoc.exists()) {
          await updateDoc(referrerDocRef, {
            referrals: increment(1),
            updatedAt: new Date(),
          });
        } else {
          await setDoc(referrerDocRef, {
            userId: "",
            packages: [],
            createdAt: new Date(),
            referrals: 1,
          });
        }

        const referredUserDocRef = doc(
          db,
          "referrals",
          normalizedCode,
          "referred",
          currentUserUsername
        );

        await setDoc(referredUserDocRef, {
          username: currentUserUsername,
          referredAt: new Date(),
          processed: false,
        });

        window.alert(
          `Referral processed successfully for ${normalizedCode}. Thank you for believing in us!`
        );
      } catch (referralError) {
        window.alert(
          `Error processing referral: ${referralError}. Please contact the admin through the chat to fix the issue.`
        );
      }
    }

    return true;
  } catch (error) {
    console.error("Error in processReferral:", error);
    return false;
  }
}
