// AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthContextType } from "@/types/transaction";
import { getNextUserNumber, initializeUserDocuments } from "./userService";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userNumber, setUserNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
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

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        provider
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        const userNumber = await getNextUserNumber();
        await initializeUserDocuments(user.uid, user.email, userNumber);

        setUserNumber(userNumber.toString());
        router.push("/customer/orders/new");
      } else {
        setUserNumber(userDoc.data().userNumber.toString());
        router.push("/customer/orders/open");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        provider
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        const userNumber = await getNextUserNumber();
        await initializeUserDocuments(user.uid, user.email, userNumber);

        setUserNumber(userNumber.toString());
        router.push("/customer/orders/new");
      } else {
        setUserNumber(userDoc.data().userNumber.toString());
        router.push("/customer/orders/open");
      }
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userNumber = await getNextUserNumber();
    await initializeUserDocuments(user.uid, user.email, userNumber);

    setUserNumber(userNumber.toString());
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

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
      value={{
        user,
        userNumber,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle,
        signInWithFacebook,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
