"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      if (loading) return;

      if (!user) {
        router.push("/");
        return;
      }

      try {
        const superAdminsDocRef = doc(
          db,
          FIREBASE_COLLECTIONS.USER_ROLES,
          "superAdmins",
        );
        const superAdminsDoc = await getDoc(superAdminsDocRef);

        if (superAdminsDoc.exists()) {
          const superAdmins = superAdminsDoc.data()?.superAdmins || [];
          if (Array.isArray(superAdmins) && superAdmins.includes(user.uid)) {
            setIsAuthorized(true);
          } else {
            console.warn("User is not in the super admin allowlist.");
            router.push("/");
          }
        } else {
          console.error("Super admins document not found.");
          // OPTIONAL: Deny access if config is missing, or allow if you want to bootstrap.
          // Safe default: deny
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking super admin status:", error);
        router.push("/");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSuperAdmin();
  }, [user, loading, router]);

  if (loading || checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <section className="min-h-screen bg-gray-50">{children}</section>;
}
