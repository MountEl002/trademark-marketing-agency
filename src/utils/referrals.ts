import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const addPackageToReferral = async (
  username: string | null,
  packageName: string
): Promise<boolean> => {
  try {
    if (!username) {
      console.log("Username is null, cannot add package to referral");
      return false;
    }

    const referralDocRef = doc(db, "referrals", username);

    const referralDoc = await getDoc(referralDocRef);
    if (!referralDoc.exists()) {
      console.log(`No referral document found with ID: ${username}`);
      return false;
    }

    const currentData = referralDoc.data();

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
