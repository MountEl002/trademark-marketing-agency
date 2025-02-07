import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, runTransaction } from "firebase/firestore";

const UNREG_COUNTER_DOC = "unregisteredUserNumber";
const LOCAL_STORAGE_KEY = "anonymousChatUser";

interface AnonymousUser {
  number: string;
  createdAt: number;
}

export const getChatUserNumber = async (): Promise<string> => {
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
    return chatDoc.data().userNumber;
  }

  // Get user's assigned number from users collection
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User document not found");
  }

  const userNumber = userDoc.data().userNumber.toString();

  // Create chat document
  await setDoc(chatDocRef, {
    userNumber,
    createdAt: Date.now(),
  });

  return userNumber;
};

const handleUnauthenticatedUser = async (): Promise<string> => {
  // Check localStorage for existing anonymous user
  const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedUser) {
    const anonymousUser: AnonymousUser = JSON.parse(savedUser);

    // Verify the document still exists
    const chatDocRef = doc(db, "unregisteredUsersChats", anonymousUser.number);
    const chatDoc = await getDoc(chatDocRef);

    if (chatDoc.exists()) {
      return anonymousUser.number;
    }
  }

  // Get new number from counter
  const number = await getNextUnregisteredUserNumber();

  // Create chat document
  await setDoc(doc(db, "unregisteredUsersChats", number), {
    createdAt: Date.now(),
  });

  // Save to localStorage
  const anonymousUser: AnonymousUser = {
    number,
    createdAt: Date.now(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(anonymousUser));

  return number;
};

const getNextUnregisteredUserNumber = async (): Promise<string> => {
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

    return newNumber.toString();
  } catch (error) {
    console.error("Error getting next unregistered user number:", error);
    throw error;
  }
};
