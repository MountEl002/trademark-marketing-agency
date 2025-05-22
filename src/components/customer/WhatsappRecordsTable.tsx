"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { format as formatDate } from "date-fns";

interface FileData {
  id: string;
  amount: number;
  views: number;
  uploadedAt: Date;
  status: string;
  fileName: string;
  fileUrl?: string;
}

type SortField = "amount" | "views" | "uploadedAt" | "status";
type SortDirection = "asc" | "desc";

export default function WhatsappRecordsTable() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("uploadedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const filesCollectionRef = collection(db, "users", user.uid, "files");
        const filesQuery = query(filesCollectionRef);
        const querySnapshot = await getDocs(filesQuery);

        const filesData: FileData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            filesData.push({
              id: doc.id,
              amount: data.amount || 0,
              views: data.views || 0,
              uploadedAt:
                data.uploadedAt?.toDate() || new Date(data.uploadedAt),
              status: data.status || "pending",
              fileName: data.fileName || "Unknown File",
              fileUrl: data.fileUrl || undefined,
            });
          }
        });

        setFiles(filesData);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;

    if (sortField === "amount") {
      comparison = a.amount - b.amount;
    } else if (sortField === "views") {
      comparison = a.views - b.views;
    } else if (sortField === "uploadedAt") {
      comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
    } else if (sortField === "status") {
      comparison = a.status.localeCompare(b.status);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const filteredFiles = sortedFiles.filter((file) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      file.fileName.toLowerCase().includes(query) ||
      file.status.toLowerCase().includes(query) ||
      file.amount.toString().includes(query) ||
      file.views.toString().includes(query)
    );
  });

  const exportData = (format: string) => {
    if (files.length === 0) return;

    let content = "";
    const filename = `transaction-files-${
      new Date().toISOString().split("T")[0]
    }.${format.toLowerCase()}`;

    if (format === "CSV") {
      content = "ID,Amount,Views,Date,Status,FileName\n";
      filteredFiles.forEach((file) => {
        content += `${file.id},${file.amount},${file.views},${formatDate(
          file.uploadedAt,
          "yyyy-MM-dd HH:mm:ss"
        )},"${file.status}","${file.fileName}"\n`;
      });
    } else if (format === "JSON") {
      content = JSON.stringify(filteredFiles, null, 2);
    } else if (format === "SQL") {
      content = `INSERT INTO files (id, amount, views, uploaded_at, status, file_name) VALUES\n`;
      filteredFiles.forEach((file, index) => {
        content += `('${file.id}', ${file.amount}, ${file.views}, '${formatDate(
          file.uploadedAt,
          "yyyy-MM-dd HH:mm:ss"
        )}', '${file.status}', '${file.fileName}')${
          index < filteredFiles.length - 1 ? "," : ";"
        }\n`;
      });
    } else if (format === "TXT") {
      content = "ID\tAmount\tViews\tDate\tStatus\tFileName\n";
      filteredFiles.forEach((file) => {
        content += `${file.id}\t${file.amount}\t${file.views}\t${formatDate(
          file.uploadedAt,
          "yyyy-MM-dd HH:mm:ss"
        )}\t${file.status}\t${file.fileName}\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="mb-3 sm:mb-0">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2 text-sm text-gray-600">entries per page</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount {getSortIcon("amount")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("views")}
              >
                Views {getSortIcon("views")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("uploadedAt")}
              >
                Date {getSortIcon("uploadedAt")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status {getSortIcon("status")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredFiles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No entries found
                </td>
              </tr>
            ) : (
              filteredFiles.slice(0, entriesPerPage).map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(file.uploadedAt, "MMM d, yyyy 'at' h:mm a")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        file.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : file.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex space-x-2">
        <button
          onClick={() => exportData("CSV")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportData("SQL")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export SQL
        </button>
        <button
          onClick={() => exportData("TXT")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export TXT
        </button>
        <button
          onClick={() => exportData("JSON")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}
