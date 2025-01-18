import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

interface User {
  id: string;
  email: string | null;
  userNumber: number;
  balance: number;
  lastUpdated: string | null;
  createdAt?: string;
}

export default function UserBalances() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newBalance, setNewBalance] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const usersSnapshot = await getDocs(collection(db, "users"));

      const userData = await Promise.all(
        usersSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
          const balanceDoc = await getDoc(doc(db, "balances", userId));
          const userData = userDoc.data();

          return {
            id: userId,
            email: userData.email,
            userNumber: userData.userNumber,
            createdAt: userData.createdAt,
            balance: balanceDoc.exists() ? balanceDoc.data().currentBalance : 0,
            lastUpdated: balanceDoc.exists()
              ? balanceDoc.data().lastUpdated
              : null,
          } as User;
        })
      );

      setUsers(userData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser || !newBalance || isNaN(parseFloat(newBalance))) {
      return;
    }

    try {
      setUpdating(true);
      const db = getFirestore();

      await updateDoc(doc(db, "balances", selectedUser.id), {
        currentBalance: parseFloat(newBalance),
        lastUpdated: new Date().toISOString(),
      });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                balance: parseFloat(newBalance),
                lastUpdated: new Date().toISOString(),
              }
            : user
        )
      );

      setSelectedUser(null);
      setNewBalance("");
    } catch (err) {
      setError("Failed to update balance");
      console.error("Error updating balance:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">User Balances</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">User Number</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Current Balance</th>
              <th className="border p-3 text-left">Last Updated</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-3">{user.userNumber}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">${user.balance.toFixed(2)}</td>
                <td className="border p-3">
                  {user.lastUpdated
                    ? new Date(user.lastUpdated).toLocaleString()
                    : "Never"}
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Update Balance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Balance</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-2">User: {selectedUser.email}</p>
              <p className="mb-4">
                Current Balance: ${selectedUser.balance.toFixed(2)}
              </p>

              <label className="block text-sm font-medium mb-2">
                New Balance
                <input
                  type="number"
                  step="0.01"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                  placeholder="Enter new balance"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBalance}
                disabled={!newBalance || updating}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Balance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
