"use server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function toggleOfflineStatus(
  token: string,
  currentStatus: boolean,
) {
  try {
    // 1. Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!uid) {
      throw new Error("Unauthorized: Invalid token");
    }

    // 2. Check if the user is a super admin
    const superAdminsDoc = await adminDb
      .collection(FIREBASE_COLLECTIONS.USER_ROLES)
      .doc("superAdmins")
      .get();

    if (!superAdminsDoc.exists) {
      throw new Error("Configuration Error: Super admins list not found");
    }

    const superAdmins = superAdminsDoc.data()?.superAdmins || [];

    if (!Array.isArray(superAdmins) || !superAdmins.includes(uid)) {
      throw new Error("Unauthorized: User is not a super admin");
    }

    // 3. Update the status
    const newStatus = !currentStatus;
    await adminDb
      .collection(FIREBASE_COLLECTIONS.SUPER_ADMIN_OPERATIONS)
      .doc("offlineStatus")
      .set({ isOffline: newStatus }, { merge: true });

    // 4. Revalidate the homepage to show the new status immediately
    revalidatePath("/");

    return { success: true, isOffline: newStatus };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
