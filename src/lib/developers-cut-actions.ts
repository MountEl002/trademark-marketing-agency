import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  Timestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/lib/constants";

/**
 * Increments the developers cut counter by 30% of the given amount.
 * @param amount The transaction amount or balance increase amount.
 */
export async function incrementDevelopersCut(amount: number) {
  if (!amount || amount <= 0) return;

  const cutAmount = amount * 0.3;
  const docRef = doc(db, FIREBASE_COLLECTIONS.COUNTERS, "developersCut");

  try {
    // Check if document exists first to avoid errors if it doesn't
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        amount: increment(cutAmount),
        updatedOn: Timestamp.now(),
      });
    } else {
      // Create if it doesn't exist
      await setDoc(docRef, {
        amount: cutAmount,
        updatedOn: Timestamp.now(),
      });
    }
    console.log(
      `Developers Cut incremented by ${cutAmount} (30% of ${amount})`,
    );
  } catch (error) {
    console.error("Error updating developers cut:", error);
    // We don't throw here to avoid blocking the main transaction if this fails
    // but in a critical system we might want to ensure atomicity.
  }
}
