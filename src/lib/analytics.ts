import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";

interface AnalyticsUpdate {
  totalUsers?: number;
  usersWithBasicPackage?: number;
  usersWithSilverPackage?: number;
  usersWithGoldPackage?: number;
  usersWithEarlyPayment?: number;
  usersWithPremiumCode?: number;
}

export async function updateAnalytics(update: AnalyticsUpdate) {
  const analyticsRef = doc(db, FIREBASE_COLLECTIONS.COUNTERS, "userAnalytics");

  const updateData: any = {};

  if (update.totalUsers) updateData.totalUsers = increment(update.totalUsers);
  if (update.usersWithBasicPackage)
    updateData.usersWithBasicPackage = increment(update.usersWithBasicPackage);
  if (update.usersWithSilverPackage)
    updateData.usersWithSilverPackage = increment(
      update.usersWithSilverPackage,
    );
  if (update.usersWithGoldPackage)
    updateData.usersWithGoldPackage = increment(update.usersWithGoldPackage);
  if (update.usersWithEarlyPayment)
    updateData.usersWithEarlyPayment = increment(update.usersWithEarlyPayment);
  if (update.usersWithPremiumCode)
    updateData.usersWithPremiumCode = increment(update.usersWithPremiumCode);

  if (Object.keys(updateData).length > 0) {
    try {
      await updateDoc(analyticsRef, updateData);
    } catch (error) {
      console.error("Error updating analytics:", error);
      // We might want to throw here if it's critical, but for stats it's often better to just log
      // so we don't block the main flow.
    }
  }
}
