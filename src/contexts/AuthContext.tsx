"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  getIdTokenResult,
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
import { initializeUserDocuments } from "@/contexts/userService";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Combined auth state monitoring effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Get user document data
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
          setUsername(null);
        }

        // Check for admin claims
        try {
          const idTokenResult = await getIdTokenResult(authUser, true);
          setIsAdmin(idTokenResult.claims.admin === true);
        } catch (error) {
          console.error("Error getting ID token result:", error);
          setIsAdmin(false);
        }
      } else {
        // No user is signed in
        setUser(null);
        setUsername(null);
        setIsAdmin(false);
      }

      // Only set loading to false after all auth state is resolved
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time updates to the user document
  useEffect(() => {
    if (user?.uid) {
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
      const authUser = userCredential.user;

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
      const authUser = userCredential.user;

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
    setIsAdmin(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
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
