//initialize-chat.ts

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, runTransaction } from "firebase/firestore";

const UNREG_COUNTER_DOC = "unregisteredUserName";
const LOCAL_STORAGE_KEY = "anonymousChatUser";

interface AnonymousUser {
  name: string;
  createdAt: number;
}

export const getChatUserName = async (): Promise<string> => {
  // Check if user is authenticated
  const currentUser = auth.currentUser;

  if (currentUser) {
    return await handleAuthenticatedUser(currentUser.uid);
  } else {
    return await handleUnauthenticatedUser();
  }
};

const handleAuthenticatedUser = async (userId: string): Promise<string> => {
  // Check if user already has a chat document
  const chatDocRef = doc(db, "registeredUsersChats", userId);
  const chatDoc = await getDoc(chatDocRef);

  if (chatDoc.exists()) {
    return chatDoc.data().userName;
  }

  // Get user's username from users collection
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User document not found");
  }

  const userName = userDoc.data().username || `User_${userId.substring(0, 5)}`;

  // Create chat document
  await setDoc(chatDocRef, {
    userName,
    createdAt: Date.now(),
  });

  return userName;
};

const handleUnauthenticatedUser = async (): Promise<string> => {
  try {
    // Check localStorage for existing anonymous user
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUser) {
      try {
        const anonymousUser: AnonymousUser = JSON.parse(savedUser);

        // Add validation for the parsed data
        if (!anonymousUser.name || !anonymousUser.createdAt) {
          throw new Error("Invalid stored user data");
        }

        // Verify the document still exists
        const chatDocRef = doc(
          db,
          "unregisteredUsersChats",
          anonymousUser.name
        );
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
          return anonymousUser.name;
        }
      } catch (error) {
        // Clear invalid or expired data
        console.error(error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Get new guest username
    const guestName = await getNextGuestUserName();

    // Create chat document with expiration
    await setDoc(doc(db, "unregisteredUsersChats", guestName), {
      createdAt: Date.now(),
    });

    // Save to localStorage
    const anonymousUser: AnonymousUser = {
      name: guestName,
      createdAt: Date.now(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(anonymousUser));

    return guestName;
  } catch (error) {
    console.error("Error handling unauthenticated user:", error);
    throw error;
  }
};

const getNextGuestUserName = async (): Promise<string> => {
  const counterRef = doc(db, "counters", UNREG_COUNTER_DOC);

  try {
    const newNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      let currentNumber = 99999;
      if (counterDoc.exists()) {
        currentNumber = counterDoc.data().currentNumber;
      }

      const nextNumber = currentNumber + 1;

      transaction.set(counterRef, {
        currentNumber: nextNumber,
      });

      return nextNumber;
    });

    return `Guest_${newNumber}`;
  } catch (error) {
    console.error("Error getting next guest username:", error);
    throw error;
  }
};
