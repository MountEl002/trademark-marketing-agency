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

  console.log("[AuthContext] Component rendered with pathname:", pathname);

  // Consolidated effect for auth state and real-time user data
  useEffect(() => {
    console.log("[AuthContext] useEffect initialized");
    let unsubscribeFromUserDoc: (() => void) | undefined;
    const unsubscribeFromAuth = onAuthStateChanged(auth, async (authUser) => {
      console.log("[AuthContext] onAuthStateChanged triggered", {
        hasAuthUser: !!authUser,
        userId: authUser?.uid,
        email: authUser?.email,
      });

      // Clean up previous user's snapshot listener if it exists
      if (unsubscribeFromUserDoc) {
        console.log("[AuthContext] Cleaning up previous user doc listener");
        unsubscribeFromUserDoc();
      }

      if (authUser) {
        console.log("[AuthContext] User is authenticated, setting user state");
        setUser(authUser);

        // Set up real-time listener for the user document
        const userDocRef = doc(db, FIREBASE_COLLECTIONS.USERS, authUser.uid);
        console.log(
          "[AuthContext] Setting up snapshot listener for user doc:",
          authUser.uid
        );

        unsubscribeFromUserDoc = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            console.log("[AuthContext] User doc snapshot received", {
              exists: docSnapshot.exists(),
              data: docSnapshot.exists() ? docSnapshot.data() : null,
            });

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
            console.error("[AuthContext] Error in user doc snapshot:", error);
            setErrorFetchingUserData(`Error fetching user document: ${error}`);
            setUserData(null);
          }
        );

        // Check for admin claims
        try {
          console.log("[AuthContext] Checking admin claims");
          const idTokenResult = await getIdTokenResult(authUser, true);
          console.log("[AuthContext] ID token result:", {
            isAdmin: idTokenResult.claims.admin === true,
            claims: idTokenResult.claims,
          });
          setIsAdmin(idTokenResult.claims.admin === true);
        } catch (error) {
          console.error("[AuthContext] Error getting ID token result:", error);
          setIsAdmin(false);
        }
      } else {
        // No user is signed in
        console.log("[AuthContext] No user signed in, clearing state");
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
      }

      console.log("[AuthContext] Setting loading to false");
      setLoading(false);
    });

    return () => {
      console.log("[AuthContext] Cleanup function called");
      unsubscribeFromAuth();
      if (unsubscribeFromUserDoc) {
        unsubscribeFromUserDoc();
      }
    };
  }, [user]);

  const signInWithGoogle = async () => {
    console.log("[AuthContext] signInWithGoogle called");
    try {
      const provider = new GoogleAuthProvider();
      console.log("[AuthContext] Opening Google sign-in popup");

      const userCredential: UserCredential = await signInWithPopup(
        auth,
        provider
      );
      const authUser = userCredential.user;
      console.log("[AuthContext] Google sign-in successful", {
        userId: authUser.uid,
        email: authUser.email,
      });

      console.log("[AuthContext] Fetching user document");
      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      console.log("[AuthContext] User doc exists:", userDoc.exists());

      if (!routesWithCustomRedirection.includes(pathname)) {
        console.log(
          "[AuthContext] Current pathname not in custom redirection list"
        );

        if (!userDoc.exists()) {
          console.log("[AuthContext] New user, initializing documents");
          await initializeUserDocuments(
            authUser.uid,
            authUser.email,
            null,
            null,
            null
          );
          console.log("[AuthContext] Redirecting to profile completion");
          router.push("/customer/profile-completion");
        } else {
          // Existing user
          console.log("[AuthContext] Existing user, redirecting to dashboard");
          router.push("/customer/dashboards");
        }
      } else {
        console.log(
          "[AuthContext] Current pathname in custom redirection list, skipping redirect"
        );
        // Initialize user documents if they don't exist, but don't redirect
        if (!userDoc.exists()) {
          console.log(
            "[AuthContext] Initializing user documents without redirect"
          );
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
      console.error("[AuthContext] Error signing in with Google:", error);
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
    console.log("[AuthContext] signup called", {
      email,
      mobile,
      usernameInput,
      country,
    });

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = userCredential.user;
    console.log("[AuthContext] User created:", authUser.uid);

    console.log("[AuthContext] Initializing user documents");
    await initializeUserDocuments(
      authUser.uid,
      authUser.email,
      mobile,
      usernameInput,
      country
    );

    console.log("[AuthContext] Processing referral");
    await processReferral(
      authUser.uid,
      usernameInput,
      referralCode,
      isCodeValid
    );

    // Only redirect if not on a route with custom redirection logic
    if (!routesWithCustomRedirection.includes(pathname)) {
      console.log("[AuthContext] Redirecting to dashboard after signup");
      router.push("/customer/dashboards");
    } else {
      console.log(
        "[AuthContext] Skipping redirect after signup (custom redirection route)"
      );
    }
  };

  const login = async (email: string, password: string) => {
    console.log("[AuthContext] login called", { email });

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = userCredential.user;
    console.log("[AuthContext] User signed in:", authUser.uid);

    console.log("[AuthContext] Fetching user document for login");
    const userDoc = await getDoc(doc(db, "users", authUser.uid));
    console.log("[AuthContext] User doc exists:", userDoc.exists());
    console.log(
      "[AuthContext] User doc data:",
      userDoc.exists() ? userDoc.data() : null
    );

    if (userDoc.exists() && userDoc.data()?.username) {
      console.log("[AuthContext] User has username, redirecting to dashboard");
      router.push("/customer/dashboards");
    } else {
      console.log(
        "[AuthContext] User missing username, redirecting to profile completion"
      );
      router.push("/customer/profile-completion");
    }
  };

  const logout = async () => {
    console.log("[AuthContext] logout called");
    await signOut(auth);
    setIsAdmin(false);
    console.log("[AuthContext] Redirecting to login");
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    console.log("[AuthContext] resetPassword called", { email });
    return await sendPasswordResetEmail(auth, email);
  };

  console.log("[AuthContext] Rendering provider with state:", {
    hasUser: !!user,
    hasUserData: !!userData,
    username: userData?.username,
    isAdmin,
    loading,
    errorFetchingUserData,
  });

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
