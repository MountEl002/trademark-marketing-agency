"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutProps {
  onLogoutSuccess?: () => void;
}

const Logout = ({ onLogoutSuccess }: LogoutProps) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`text-gray-50 bg-red-500 px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-500 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? <span>Logging out...</span> : <span>Logout</span>}
    </button>
  );
};

export default Logout;
