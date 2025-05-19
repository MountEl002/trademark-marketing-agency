"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaUsers,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

export default function AdminHeader() {
  const { user, username, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <FaUserShield className="text-2xl" />
            <Link href="/admin">
              <span className="font-bold text-xl">Admin Dashboard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin"
              className="hover:text-blue-200 flex items-center"
            >
              <FaUsers className="mr-2" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/transactions"
              className="hover:text-blue-200 flex items-center"
            >
              <FaMoneyBillWave className="mr-2" />
              <span>Transactions</span>
            </Link>
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-blue-500">
              <div className="text-sm">
                <span className="block font-medium">{username || "Admin"}</span>
                <span className="block text-xs opacity-75">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="bg-blue-800 hover:bg-blue-900 p-2 rounded-full"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-2xl">
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-600">
            <Link
              href="/admin"
              className="py-3 hover:bg-blue-600 px-4 rounded-md flex items-center"
            >
              <FaUsers className="mr-2" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/transactions"
              className="py-3 hover:bg-blue-600 px-4 rounded-md flex items-center"
            >
              <FaMoneyBillWave className="mr-2" />
              <span>Transactions</span>
            </Link>
            <div className="mt-4 pt-4 border-t border-blue-600 flex items-center justify-between px-4">
              <div className="text-sm">
                <span className="block font-medium">{username || "Admin"}</span>
                <span className="block text-xs opacity-75">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="bg-blue-800 hover:bg-blue-900 p-2 rounded-full"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
