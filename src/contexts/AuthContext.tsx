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
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthContextType } from "@/types/transaction";
import { initializeUserDocuments } from "./userService";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData && userData.username) {
            setUsername(userData.username);
          } else {
            setUsername(null);
          }
        } else {
          // User authenticated but no profile document in Firestore yet
          // (e.g., new social login user before profile completion)
          setUsername(null);
        }
      } else {
        setUser(null);
        setUsername(null); // Clear username on logout or if no user
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []); // router is not directly used for navigation here, onAuthStateChanged handles state

  useEffect(() => {
    if (user?.uid) {
      // Listen for real-time updates to the user document
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          // Update username state when it changes in the database
          setUsername(userData.username || null);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        provider
      );
      const authUser = userCredential.user; // Renamed to avoid conflict

      const userDoc = await getDoc(doc(db, "users", authUser.uid));

      // onAuthStateChanged will handle setting user and username states.
      // This logic just handles initial redirection.
      if (!userDoc.exists()) {
        await initializeUserDocuments(
          authUser.uid,
          authUser.email,
          null,
          null,
          null
        );
        router.push("/customer/profile-completion");
      } else {
        // Existing user
        router.push("/customer/dashboards");
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
      const authUser = userCredential.user; // Renamed

      const userDoc = await getDoc(doc(db, "users", authUser.uid));

      if (!userDoc.exists()) {
        await initializeUserDocuments(
          authUser.uid,
          authUser.email,
          null,
          null,
          null
        );
        router.push("/customer/profile-completion");
      } else {
        router.push("/customer/dashboards");
      }
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    mobile: string,
    usernameInput: string,
    country: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = userCredential.user;

    await initializeUserDocuments(
      authUser.uid,
      authUser.email,
      mobile,
      usernameInput,
      country
    );
    setUsername(usernameInput);
    router.push("/customer/dashboards");
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", authUser.uid));
    if (userDoc.exists() && userDoc.data()?.username) {
      router.push("/customer/dashboards");
    } else {
      router.push("/customer/profile-completion");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        username,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle,
        signInWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
