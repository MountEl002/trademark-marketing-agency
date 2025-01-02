"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  userNumber: string | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

async function getNextUserNumber(): Promise<number> {
  const result = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(doc(db, "counters", "userNumber"));

    if (!counterDoc.exists()) {
      // Initialize counter if it doesn't exist
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userNumber, setUserNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch user number from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserNumber(userDoc.data().userNumber.toString());
        }
      } else {
        setUserNumber(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get next sequential number
    const userNumber = await getNextUserNumber();

    // Store user data
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      userNumber: userNumber,
      createdAt: new Date().toISOString(),
    });

    setUserNumber(userNumber.toString());
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch user number
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      setUserNumber(userDoc.data().userNumber.toString());
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserNumber(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userNumber, loading, signup, login, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
