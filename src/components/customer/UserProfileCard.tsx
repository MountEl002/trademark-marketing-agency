import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LoadingScreen from "../common/LoadingScreen";

type UserProfileCardProps = {
  userId: string;
};

export default function UserProfileCard({ userId }: UserProfileCardProps) {
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    mobile: string;
    country: string;
    balance: number;
    createdAt: Date | null;
  }>({
    username: "",
    email: "",
    mobile: "",
    country: "",
    balance: 0,
    createdAt: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date manually without external libraries
  const formatDate = (date: Date): string => {
    const pad = (num: number): string => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          let createdAtDate = null;
          if (data.createdAt) {
            createdAtDate = data.createdAt.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt);
          }

          setUserData({
            username: data.username || "",
            email: data.email || "",
            mobile: data.mobile || "",
            country: data.country || "",
            balance: data.balance || 0,
            createdAt: createdAtDate,
          });
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-fit pl-12 pr-32 mx-auto rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Personal Information
      </h2>
      <div className="space-y-4">
        {userData.createdAt && (
          <div className="flex items-center">
            <div className="w-8 text-blue-500">
              <FaUser className="text-lg" />
            </div>
            <div>
              <p className="text-gray-600">Join Date: </p>
              <p className="font-medium">{formatDate(userData.createdAt)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <div className="w-8 text-blue-500">
            <FaUser className="text-lg" />
          </div>
          <div>
            <p className="text-gray-600">UserName: </p>
            <p className="font-medium">{userData.username}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 text-blue-500">
            <FaPhone className="text-lg" />
          </div>
          <div>
            <p className="text-gray-600">Phone: </p>
            <p className="font-medium">{userData.mobile}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 text-blue-500">
            <FaEnvelope className="text-lg" />
          </div>
          <div>
            <p className="text-gray-600">Email: </p>
            <p className="font-medium">{userData.email}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 text-blue-500">
            <FaGlobe className="text-lg" />
          </div>
          <div>
            <p className="text-gray-600">Country: </p>
            <p className="font-medium">{userData.country}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 text-blue-500">
            <FaWallet className="text-lg" />
          </div>
          <div>
            <p className="text-gray-600">Balance: </p>
            <p className="font-medium">Ksh {userData.balance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
