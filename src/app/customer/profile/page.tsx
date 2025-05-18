"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext
import UserProfileCard from "@/components/customer/UserProfileCard";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const currentUserId = user.uid;
    setUserId(currentUserId);

    setLoading(false);
  }, [user, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mx-auto">
        <UserProfileCard userId={userId} />
      </div>
    </div>
  );
}
