"use client";

import { useCallback } from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ReferralPackageUpdaterProps {
  userId: string;
  username: string;
}

interface PackageInfo {
  packageName: string;
  packagePrice: number;
  purchasedAt: Date;
}

export const useReferralPackageUpdater = ({
  userId,
  username,
}: ReferralPackageUpdaterProps) => {
  const updateReferralPackages = useCallback(
    async (packageInfo: PackageInfo): Promise<boolean> => {
      if (!username || !packageInfo.packageName) {
        console.error("Username and package name are required");
        return false;
      }

      try {
        // Reference to the user's document in the referrals collection
        const referralDocRef = doc(db, "referrals", username);

        // Check if the document exists
        const docSnap = await getDoc(referralDocRef);

        const packageData = {
          name: packageInfo.packageName,
          price: packageInfo.packagePrice,
          purchasedAt: packageInfo.purchasedAt,
        };

        if (docSnap.exists()) {
          // Document exists, update the packages array
          const existingData = docSnap.data();

          // Check if packages field exists
          if (existingData.packages && Array.isArray(existingData.packages)) {
            // Add package to existing packages array
            await updateDoc(referralDocRef, {
              packages: arrayUnion(packageData),
            });
          } else {
            // packages field doesn't exist, create it with the new package
            await updateDoc(referralDocRef, {
              packages: [packageData],
            });
          }
        } else {
          // Document doesn't exist, create it with the package
          await setDoc(referralDocRef, {
            userId: userId,
            packages: [packageData],
            createdAt: new Date(),
            referrals: 0,
          });
        }

        console.log(`Successfully updated packages for user: ${username}`);
        return true;
      } catch (error) {
        console.error("Error updating referral packages:", error);
        return false;
      }
    },
    [userId, username]
  );

  return { updateReferralPackages };
};

// HOC Component for easy integration
interface WithReferralUpdaterProps {
  userId: string;
  username: string;
  children: (
    updateReferralPackages: (packageInfo: PackageInfo) => Promise<boolean>
  ) => React.ReactNode;
}

export const WithReferralUpdater: React.FC<WithReferralUpdaterProps> = ({
  userId,
  username,
  children,
}) => {
  const { updateReferralPackages } = useReferralPackageUpdater({
    userId,
    username,
  });

  return <>{children(updateReferralPackages)}</>;
};

// Standalone component for direct usage
interface ReferralPackageUpdaterComponentProps {
  userId: string;
  username: string;
  onUpdate?: (success: boolean) => void;
}

export const ReferralPackageUpdater: React.FC<
  ReferralPackageUpdaterComponentProps
> = ({ userId, username }) => {
  useReferralPackageUpdater({
    userId,
    username,
  });

  // This component doesn't render anything visible
  // It's meant to be used for its side effects
  return null;
};

export default ReferralPackageUpdater;
