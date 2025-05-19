import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Adds a package name to the packages array of a referral document
 * using document ID instead of querying
 *
 * @param username - The username that is the document ID in the referrals collection
 * @param packageName - The package name to add to the packages array
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export const addPackageToReferral = async (
  username: string | null,
  packageName: string
): Promise<boolean> => {
  try {
    // Early return if username is null
    if (!username) {
      console.log("Username is null, cannot add package to referral");
      return false;
    }

    // Directly reference the document by its ID (username)
    const referralDocRef = doc(db, "referrals", username);

    // Check if the document exists
    const referralDoc = await getDoc(referralDocRef);
    if (!referralDoc.exists()) {
      console.log(`No referral document found with ID: ${username}`);
      return false;
    }

    // Get current data
    const currentData = referralDoc.data();

    // Update the document by adding the package name to the packages array
    // If packages doesn't exist yet, initialize it
    if (!currentData.packages || !Array.isArray(currentData.packages)) {
      await updateDoc(referralDocRef, {
        packages: [packageName],
      });
    } else {
      await updateDoc(referralDocRef, {
        packages: arrayUnion(packageName),
      });
    }

    console.log(
      `Successfully added package "${packageName}" to referral for username: ${username}`
    );
    return true;
  } catch (error) {
    console.error("Error adding package to referral:", error);
    return false;
  }
};
