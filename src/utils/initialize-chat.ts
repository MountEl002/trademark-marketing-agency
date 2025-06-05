import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, runTransaction } from "firebase/firestore";

const UNREG_COUNTER_DOC = "unregisteredUserName";
const LOCAL_STORAGE_KEY = "anonymousChatUser";

interface AnonymousUser {
  name: string;
  createdAt: number;
}

interface UserClassification {
  isRegistered: boolean;
  chatId: string;
  userName: string;
  collectionPath: string;
}

export const getChatUserName = async (): Promise<string> => {
  const classification = await classifyUser();
  return classification.userName;
};

export const classifyUser = async (): Promise<UserClassification> => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    // Check if user has a username
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    const hasUsername = userDoc.exists() && userDoc.data().username;

    if (hasUsername) {
      // Registered user: authenticated + has username
      return await handleRegisteredUser(
        currentUser.uid,
        userDoc.data().username
      );
    }
  }

  // Unregistered user: either unauthenticated OR authenticated without username
  return await handleUnregisteredUser();
};

const handleRegisteredUser = async (
  userId: string,
  username: string
): Promise<UserClassification> => {
  const chatDocRef = doc(db, "registeredUsersChats", userId);
  const chatDoc = await getDoc(chatDocRef);

  if (!chatDoc.exists()) {
    await setDoc(chatDocRef, {
      userName: username,
      createdAt: Date.now(),
    });
  }

  return {
    isRegistered: true,
    chatId: userId,
    userName: username,
    collectionPath: "registeredUsersChats",
  };
};

const handleUnregisteredUser = async (): Promise<UserClassification> => {
  try {
    // Check localStorage for existing anonymous user
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUser) {
      try {
        const anonymousUser: AnonymousUser = JSON.parse(savedUser);

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
          return {
            isRegistered: false,
            chatId: anonymousUser.name,
            userName: anonymousUser.name,
            collectionPath: "unregisteredUsersChats",
          };
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Get new guest username
    const guestName = await getNextGuestUserName();

    // Create chat document
    await setDoc(doc(db, "unregisteredUsersChats", guestName), {
      createdAt: Date.now(),
    });

    // Save to localStorage
    const anonymousUser: AnonymousUser = {
      name: guestName,
      createdAt: Date.now(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(anonymousUser));

    return {
      isRegistered: false,
      chatId: guestName,
      userName: guestName,
      collectionPath: "unregisteredUsersChats",
    };
  } catch (error) {
    console.error("Error handling unregistered user:", error);
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
