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
  console.log("AuthProvider: Initializing");
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
  console.log("AuthProvider: Current pathname:", pathname);

  const routesWithCustomRedirection = [
    "/signup",
    "/customer/profile-completion",
  ];

  useEffect(() => {
    console.log("AuthProvider: useEffect for auth state change triggered");
    let unsubscribeFromUserDoc: (() => void) | undefined;
    const unsubscribeFromAuth = onAuthStateChanged(auth, async (authUser) => {
      console.log("AuthProvider: onAuthStateChanged callback fired");
      if (unsubscribeFromUserDoc) {
        console.log(
          "AuthProvider: Unsubscribing from previous user doc listener"
        );
        unsubscribeFromUserDoc();
      }

      if (authUser) {
        console.log("AuthProvider: User is authenticated:", authUser);
        setUser(authUser);

        const userDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, authUser.uid);
        console.log(
          "AuthProvider: Setting up real-time listener for user document:",
          userDocRef.path
        );
        unsubscribeFromUserDoc = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              console.log(
                "AuthProvider: User document snapshot received:",
                docSnapshot.data()
              );
              setUserData(docSnapshot.data() as UserDoc);
            } else {
              console.log("AuthProvider: User document does not exist.");
              setUserData(null);
              setErrorFetchingUserData(
                "Error fetching user data: User document does not exist."
              );
            }
          },
          (error) => {
            console.error("AuthProvider: Error fetching user document:", error);
            setErrorFetchingUserData(`Error fetching user document: ${error}`);
            setUserData(null);
          }
        );

        try {
          console.log("AuthProvider: Getting ID token result for admin check");
          const idTokenResult = await getIdTokenResult(authUser, true);
          console.log(
            "AuthProvider: ID token result claims:",
            idTokenResult.claims
          );
          setIsAdmin(idTokenResult.claims.admin === true);
        } catch (error) {
          console.error("AuthProvider: Error getting ID token result:", error);
          setIsAdmin(false);
        }
      } else {
        console.log("AuthProvider: No user is signed in.");
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
      }
      console.log("AuthProvider: Setting loading to false");
      setLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth and user doc subscriptions");
      unsubscribeFromAuth();
      if (unsubscribeFromUserDoc) {
        unsubscribeFromUserDoc();
      }
    };
  }, [user]);

  const signInWithGoogle = async () => {
    console.log("signInWithGoogle: Attempting to sign in with Google");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        provider
      );
      const authUser = userCredential.user;
      console.log(
        "signInWithGoogle: Successfully signed in with Google:",
        authUser
      );

      const userDocRef = doc(db, "users", authUser.uid);
      console.log(
        "signInWithGoogle: Checking for user document at:",
        userDocRef.path
      );
      const userDoc = await getDoc(userDocRef);

      console.log("signInWithGoogle: Current pathname:", pathname);
      console.log(
        "signInWithGoogle: Is current path in routesWithCustomRedirection?",
        routesWithCustomRedirection.includes(pathname)
      );

      if (!routesWithCustomRedirection.includes(pathname)) {
        if (!userDoc.exists()) {
          console.log(
            "signInWithGoogle: New user. Initializing documents and redirecting to profile completion."
          );
          await initializeUserDocuments(
            authUser.uid,
            authUser.email,
            null,
            null,
            null
          );
          router.push("/customer/profile-completion");
        } else {
          console.log(
            "signInWithGoogle: Existing user. Redirecting to dashboard."
          );
          router.push("/customer/dashboards");
        }
      } else {
        console.log(
          "signInWithGoogle: On a route with custom redirection. Initializing documents if they don't exist, but not redirecting."
        );
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
      console.error("signInWithGoogle: Error signing in with Google:", error);
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
    console.log("signup: Attempting to sign up with email:", email);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = userCredential.user;
    console.log("signup: User created successfully:", authUser);

    console.log("signup: Initializing user documents");
    await initializeUserDocuments(
      authUser.uid,
      authUser.email,
      mobile,
      usernameInput,
      country
    );

    console.log("signup: Processing referral");
    await processReferral(
      authUser.uid,
      usernameInput,
      referralCode,
      isCodeValid
    );

    if (!routesWithCustomRedirection.includes(pathname)) {
      console.log("signup: Redirecting to dashboard");
      router.push("/customer/dashboards");
    } else {
      console.log(
        "signup: On a route with custom redirection, not redirecting."
      );
    }
  };

  const login = async (email: string, password: string) => {
    console.log("login: Attempting to log in with email:", email);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = userCredential.user;
    console.log("login: User logged in successfully:", authUser);

    const userDocRef = doc(db, "users", authUser.uid);
    console.log("login: Checking for user document at:", userDocRef.path);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data()?.username) {
      console.log(
        "login: User document exists and has a username. Redirecting to dashboard."
      );
      router.push("/customer/dashboards");
    } else {
      console.log(
        "login: User document does not exist or has no username. Redirecting to profile completion."
      );
      router.push("/customer/profile-completion");
    }
  };

  const logout = async () => {
    console.log("logout: Attempting to log out");
    await signOut(auth);
    setIsAdmin(false);
    console.log("logout: User signed out. Redirecting to login page.");
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    console.log("resetPassword: Sending password reset email to:", email);
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
