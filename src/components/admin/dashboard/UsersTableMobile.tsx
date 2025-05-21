"use client";

import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  username: string;
  email: string;
  mobile: string;
  balance: number;
  payments: number;
}

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (expanded) {
      // If already expanded, navigate to user detail page
      router.push(`/admin/users/${user.username}`);
    } else {
      // If collapsed, just expand first
      setExpanded(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-3 overflow-hidden">
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <FiUser className="text-blue-500 mr-2" />
          <span className="font-medium text-blue-600">{user.username}</span>
        </div>
        {expanded ? (
          <FiChevronUp className="text-gray-500" />
        ) : (
          <FiChevronDown className="text-gray-500" />
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <div className="flex items-center py-2">
            <FiMail className="text-gray-500 mr-3 w-5" />
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-sm">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center py-2">
            <FiPhone className="text-gray-500 mr-3 w-5" />
            <div>
              <div className="text-xs text-gray-500">Mobile</div>
              <div className="text-sm">{user.mobile}</div>
            </div>
          </div>

          <div className="flex items-center py-2">
            <FiDollarSign className="text-gray-500 mr-3 w-5" />
            <div>
              <div className="text-xs text-gray-500">Balance</div>
              <div className="text-sm">
                {user.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center py-2">
            <FiCreditCard className="text-gray-500 mr-3 w-5" />
            <div>
              <div className="text-xs text-gray-500">Payments</div>
              <div className="text-sm">
                {user.payments.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <button
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/users/${user.username}`);
            }}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

export default function UsersTableMobile({ users }: { users: User[] }) {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <UserCard key={user.userId} user={user} />
      ))}
    </div>
  );
}
