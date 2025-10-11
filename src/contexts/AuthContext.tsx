"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  getIdTokenResult,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthContextType, UserDoc } from "@/types/globalTypes";
import {
  initializeUserDocuments,
  processReferral,
} from "@/contexts/userService";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserDoc | null>({
    userId: "",
    createdAt: "",
    currentBalance: 0,
    email: "",
    phoneNumber: "",
    unreadNotifications: 0,
    username: "",
  });
  const [errorFetchingUserData, setErrorFetchingUserData] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const pathname = usePathname();

  // Routes that should handle their own redirections
  const routesWithCustomRedirection = [
    "/signup",
    "/customer/profile-completion",
  ];

  // Consolidated effect for auth state and real-time user data
  useEffect(() => {
    let unsubscribeFromUserDoc: (() => void) | undefined;
    const unsubscribeFromAuth = onAuthStateChanged(auth, async (authUser) => {
      // Clean up previous user's snapshot listener if it exists
      if (unsubscribeFromUserDoc) {
        unsubscribeFromUserDoc();
      }

      if (authUser) {
        setUser(authUser);

        // Set up real-time listener for the user document
        const userDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, authUser.uid);
        unsubscribeFromUserDoc = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData(docSnapshot.data() as UserDoc);
            } else {
              setUserData(null);
              setErrorFetchingUserData(
                "Error fetching user data: User document does not exist."
              );
            }
          },
          (error) => {
            setErrorFetchingUserData(`Error fetching user document: ${error}`);
            setUserData(null);
          }
        );

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
        setUserData(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromUserDoc) {
        unsubscribeFromUserDoc();
      }
    };
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

      if (!routesWithCustomRedirection.includes(pathname)) {
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
      } else {
        // Initialize user documents if they don't exist, but don't redirect
        if (!userDoc.exists()) {
          await initializeUserDocuments(
            authUser.uid,
            authUser.email,
            null,
            null,
            null
          );
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    mobile: string,
    usernameInput: string,
    country: string,
    referralCode: string | null,
    isCodeValid: boolean | null
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

    await processReferral(
      authUser.uid,
      usernameInput,
      referralCode,
      isCodeValid
    );

    // Only redirect if not on a route with custom redirection logic
    if (!routesWithCustomRedirection.includes(pathname)) {
      router.push("/customer/dashboards");
    }
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

  const resetPassword = async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        username: userData?.username || null,
        isAdmin,
        errorFetchingUserData,
        resetPassword,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
