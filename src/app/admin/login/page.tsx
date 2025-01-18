// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { isUserSuperAdmin } from "@/utils/admin-setup";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      // First, attempt to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Then check if the user is a super admin
      const isSuperAdmin = await isUserSuperAdmin(userCredential.user.uid);

      if (!isSuperAdmin) {
        // If not a super admin, sign them out and show error
        await auth.signOut();
        setError("Access denied. Only administrators can login.");
        return;
      }

      // If they are a super admin, redirect to admin dashboard
      router.push("/admin");
    } catch (error) {
      setError("Invalid credentials or insufficient permissions");
      window.alert(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
