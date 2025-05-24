// components/Layout/Navbar.tsx
import { useState } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiBell,
  FiUsers,
  FiDatabase,
  FiUpload,
  FiEye,
} from "react-icons/fi";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-blue-700 text-white shadow-md fixed top-0 left-0 right-0 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Open sidebar"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              <span className="ml-4 font-semibold text-xl">
                Admin Dashboard
              </span>
            </div>
            <div>
              <Link
                href="/admin/notifications"
                className="p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <FiBell className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay that appears when sidebar is open (on mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          pt-16 lg:pt-16
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-6">
            Admin Menu
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/users"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FiUsers className="mr-3 h-5 w-5" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/user-transactions"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FiDatabase className="mr-3 h-5 w-5" />
                <span>Transactions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/uploaded-views"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FiEye className="mr-3 h-5 w-5" />
                <span>Uploaded Views</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/upload-product"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FiUpload className="mr-3 h-5 w-5" />
                <span>Upload Product</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
