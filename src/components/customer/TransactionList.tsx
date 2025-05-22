"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { FiSearch, FiFilter } from "react-icons/fi";
import TransactionVerification from "@/components/customer/TransactionVerification";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  time: {
    toDate: () => Date;
  };
  status: string;
  TransactionId: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const transactionsCollectionRef = collection(userDocRef, "transactions");
    const q = query(transactionsCollectionRef, orderBy("time", "desc"));

    // First do initial load
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const transactionData: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          transactionData.push({
            id: doc.id,
            ...doc.data(),
          } as Transaction);
        });

        setTransactions(transactionData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Then set up real-time listener for updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedTransactions: Transaction[] = [];
      snapshot.forEach((doc) => {
        updatedTransactions.push({
          id: doc.id,
          ...doc.data(),
        } as Transaction);
      });

      setTransactions(updatedTransactions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleVerifyClick = (transactionId: string) => {
    setSelectedTransaction(transactionId);
    setShowVerificationDialog(true);
  };

  const closeVerificationDialog = () => {
    setShowVerificationDialog(false);
    setSelectedTransaction(null);
  };

  const formatTime = (timestamp: { toDate: () => Date }) => {
    try {
      if (!timestamp || !timestamp.toDate) return "N/A";
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusClassName = (status: string | undefined) => {
    if (typeof status !== "string" || !status) {
      return "text-gray-600";
    }
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "verifying":
        return "text-blue-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const searchTermLower = searchTerm.toLowerCase();
    const idMatch = (transaction.TransactionId || "")
      .toLowerCase()
      .includes(searchTermLower);
    const typeMatch = (transaction.type || "")
      .toLowerCase()
      .includes(searchTermLower);
    const statusMatch = (transaction.status || "")
      .toLowerCase()
      .includes(searchTermLower);
    return idMatch || typeMatch || statusMatch;
  });

  // Check if any transaction has pending status
  const hasPendingTransactions = filteredTransactions.some(
    (transaction) => (transaction.status || "").toLowerCase() === "pending"
  );

  const handleExport = (format: string) => {
    if (filteredTransactions.length === 0) return;

    let content = "";
    let filename = `transactions-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "CSV":
        content = "Amount,Type,Time,Status,TransactionId\n";
        filteredTransactions.forEach((t) => {
          content += `${t.amount},${t.type},${formatTime(t.time)},${t.status},${
            t.TransactionId
          }\n`;
        });
        filename += ".csv";
        break;
      case "JSON":
        content = JSON.stringify(
          filteredTransactions.map((t) => ({
            amount: t.amount,
            type: t.type,
            time: formatTime(t.time),
            status: t.status,
            transactionId: t.TransactionId,
          })),
          null,
          2
        );
        filename += ".json";
        break;
      case "TXT":
        content = "Amount\tType\tTime\tStatus\tTransactionId\n";
        filteredTransactions.forEach((t) => {
          content += `${t.amount}\t${t.type}\t${formatTime(t.time)}\t${
            t.status
          }\t${t.TransactionId}\n`;
        });
        filename += ".txt";
        break;
      case "SQL":
        content =
          "CREATE TABLE IF NOT EXISTS transactions (amount DECIMAL(10,2), type VARCHAR(50), time VARCHAR(100), status VARCHAR(50), transaction_id VARCHAR(50));\n\n";
        content +=
          "INSERT INTO transactions (amount, type, time, status, transaction_id) VALUES\n";
        filteredTransactions.forEach((t, index) => {
          content += `(${t.amount}, '${t.type}', '${formatTime(t.time)}', '${
            t.status
          }', '${t.TransactionId}')${
            index === filteredTransactions.length - 1 ? ";" : ","
          }\n`;
        });
        filename += ".sql";
        break;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded shadow p-3 sm:p-6">
      {/* Desktop filter and search */}
      <div className="hidden sm:flex justify-between items-center mb-4">
        <div className="flex items-center">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 mr-2 text-sm"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 pl-8 text-sm w-44"
          />
          <FiSearch className="absolute left-2 top-2 text-gray-400" />
        </div>
      </div>

      {/* Mobile filter and search toggle */}
      <div className="flex sm:hidden justify-between items-center mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center text-gray-600 text-sm border rounded px-3 py-1"
        >
          <FiFilter className="mr-1" /> Filter
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 pl-8 text-sm w-full max-w-[120px]"
          />
          <FiSearch className="absolute left-2 top-2 text-gray-400" />
        </div>
      </div>

      {/* Mobile filters - shown when toggled */}
      {showMobileFilters && (
        <div className="sm:hidden bg-gray-50 p-3 mb-4 rounded">
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">
              Entries per page
            </label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 w-full text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {hasPendingTransactions && (
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={hasPendingTransactions ? 5 : 4}
                      className="text-center py-4 text-sm"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={hasPendingTransactions ? 5 : 4}
                      className="text-center py-4 text-sm"
                    >
                      No entries found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions
                    .slice(0, entriesPerPage)
                    .map((transaction) => {
                      const isPending =
                        (transaction.status || "").toLowerCase() === "pending";

                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                            Ksh {transaction.amount.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                            {transaction.type}
                          </td>
                          <td className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                            {formatTime(transaction.time)}
                          </td>
                          <td
                            className={`px-3 py-2 text-xs sm:text-sm whitespace-nowrap ${getStatusClassName(
                              transaction.status
                            )}`}
                          >
                            {transaction.status || "N/A"}
                          </td>
                          {hasPendingTransactions && (
                            <td className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                              {isPending && transaction.TransactionId && (
                                <button
                                  onClick={() =>
                                    handleVerifyClick(transaction.TransactionId)
                                  }
                                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                                >
                                  Verify
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export buttons - stacked on mobile, row on desktop */}
      <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:flex gap-2">
          <button
            onClick={() => handleExport("CSV")}
            className="bg-green-500 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("SQL")}
            className="bg-green-500 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-600"
          >
            Export SQL
          </button>
          <button
            onClick={() => handleExport("TXT")}
            className="bg-green-500 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-600"
          >
            Export TXT
          </button>
          <button
            onClick={() => handleExport("JSON")}
            className="bg-green-500 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-600"
          >
            Export JSON
          </button>
        </div>
      </div>

      {showVerificationDialog && user && selectedTransaction && (
        <TransactionVerification
          transactionId={selectedTransaction}
          userId={user.uid}
          onClose={closeVerificationDialog}
        />
      )}
    </div>
  );
}
