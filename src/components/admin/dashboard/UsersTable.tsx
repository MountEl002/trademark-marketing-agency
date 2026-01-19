"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";
import UsersTableMobile from "./UsersTableMobile";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  username: string;
  email: string;
  mobile: string;
  balance: number;
  payments: number;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(usersCollectionRef, limit(10));
        const querySnapshot = await getDocs(usersQuery);

        const usersData: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          usersData.push({
            userId: data.userId || doc.id,
            username: data.username || "N/A",
            email: data.email || "N/A",
            mobile: data.mobile || "N/A",
            balance: typeof data.balance === "number" ? data.balance : 0,
            payments: typeof data.payments === "number" ? data.payments : 0,
          });
        });

        setUsers(usersData);

        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        if (querySnapshot.docs.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.length > 0 && searchTerm.length < 3) {
      setIsSearching(false);
      return;
    }

    if (searchTerm.length === 0) {
      setIsSearching(false);
      async function resetUsers() {
        setLoading(true);
        try {
          const usersCollectionRef = collection(db, "users");
          const usersQuery = query(usersCollectionRef, limit(10));
          const querySnapshot = await getDocs(usersQuery);

          const usersData: User[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as User;
            usersData.push({
              userId: data.userId || doc.id,
              username: data.username || "N/A",
              email: data.email || "N/A",
              mobile: data.mobile || "N/A",
              balance: typeof data.balance === "number" ? data.balance : 0,
              payments: typeof data.payments === "number" ? data.payments : 0,
            });
          });

          setUsers(usersData);

          if (querySnapshot.docs.length > 0) {
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          }

          if (querySnapshot.docs.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } catch (error) {
          console.error("Error resetting users:", error);
        } finally {
          setLoading(false);
        }
      }
      resetUsers();
      return;
    }

    setIsSearching(true);

    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchTerm, null);
    }, 3000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const performSearch = async (
    term: string,
    lastDoc: QueryDocumentSnapshot<DocumentData> | null
  ) => {
    if (term.length < 3) return;

    setIsSearching(true);
    try {
      const usersCollectionRef = collection(db, "users");
      
      // Generate search term variations
      const variations = new Set<string>();
      variations.add(term); // Exact match
      variations.add(term.toLowerCase()); // Lowercase
      variations.add(term.charAt(0).toUpperCase() + term.slice(1).toLowerCase()); // Capitalized (e.g. "saint" -> "Saint")

      const searchTerms = Array.from(variations);
      const queries:any[] = [];

      // Create queries for each variation for username
      searchTerms.forEach((searchTerm) => {
        const searchTermEnd = searchTerm + "\uf8ff";
        
        if (lastDoc) {
             queries.push(query(
              usersCollectionRef,
              where("username", ">=", searchTerm),
              where("username", "<=", searchTermEnd),
              startAfter(lastDoc),
              limit(10)
            ));
        } else {
            queries.push(query(
              usersCollectionRef,
              where("username", ">=", searchTerm),
              where("username", "<=", searchTermEnd),
              limit(10)
            ));
        }
      });

      // Add email and mobile searches (using lowercase as distinct from above if needed, 
      // but usually email/mobile are stored consistent or we just try lowercase for these)
      // The original code only searched lowercase for email/mobile. Let's keep that but maybe also exact?
      // For safety, let's just stick to the original behavior for email/mobile (lowercase) + exact 
      // if it differs, but to keep it simple and match the request "search for fields that matches...", 
      // I will apply the variations to these fields too or just specific ones?
      // The user specifically pointed out "Saint" (username) was missing.
      // Let's stick to adding the variations primarily.
      
      // Original email/mobile logic used lowercase.
      const searchTermLower = term.toLowerCase();
      const searchTermLowerEnd = searchTermLower + "\uf8ff";

      // Add Email query (standard lowercase search as per previous logic, but maybe we should add exact too?)
      // Let's just keep the original email/mobile queries in addition to the username variations
      queries.push(
        lastDoc
          ? query(
              usersCollectionRef,
              where("email", ">=", searchTermLower),
              where("email", "<=", searchTermLowerEnd),
              startAfter(lastDoc),
              limit(10)
            )
          : query(
              usersCollectionRef,
              where("email", ">=", searchTermLower),
              where("email", "<=", searchTermLowerEnd),
              limit(10)
            )
      );

      queries.push(
        lastDoc
          ? query(
              usersCollectionRef,
              where("mobile", ">=", searchTermLower),
              where("mobile", "<=", searchTermLowerEnd),
              startAfter(lastDoc),
              limit(10)
            )
          : query(
              usersCollectionRef,
              where("mobile", ">=", searchTermLower),
              where("mobile", "<=", searchTermLowerEnd),
              limit(10)
            )
      );

      const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));

      const userMap = new Map<string, User>();
      const allDocs: QueryDocumentSnapshot<DocumentData>[] = [];

      querySnapshots.forEach((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data() as User;
          const userId = data.userId || doc.id;

          if (!userMap.has(userId)) {
            userMap.set(userId, {
              userId,
              username: data.username || "N/A",
              email: data.email || "N/A",
              mobile: data.mobile || "N/A",
              balance: typeof data.balance === "number" ? data.balance : 0,
              payments: typeof data.payments === "number" ? data.payments : 0,
            });
            allDocs.push(doc);
          }
        });
      });

      const usersData = Array.from(userMap.values());

      if (lastDoc) {
        setUsers((prevUsers) => [...prevUsers, ...usersData]);
      } else {
        setUsers(usersData);
      }

      if (allDocs.length > 0) {
        setLastVisible(allDocs[allDocs.length - 1]);
      }

      if (usersData.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreUsers = async () => {
    if (!lastVisible || !hasMore) return;

    setLoadingMore(true);

    if (searchTerm.length >= 3) {
      await performSearch(searchTerm, lastVisible);
      setLoadingMore(false);
    } else {
      try {
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(
          usersCollectionRef,
          startAfter(lastVisible),
          limit(10)
        );
        const querySnapshot = await getDocs(usersQuery);

        const newUsersData: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          newUsersData.push({
            userId: data.userId || doc.id,
            username: data.username || "N/A",
            email: data.email || "N/A",
            mobile: data.mobile || "N/A",
            balance: typeof data.balance === "number" ? data.balance : 0,
            payments: typeof data.payments === "number" ? data.payments : 0,
          });
        });

        setUsers((prevUsers) => [...prevUsers, ...newUsersData]);

        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        if (querySnapshot.docs.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading more users:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-800">All Customers</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {isMobile ? (
            <UsersTableMobile users={users} />
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiUser className="mr-2" /> Username
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiMail className="mr-2" /> Email
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiPhone className="mr-2" /> Mobile
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2" /> Balance
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiCreditCard className="mr-2" /> Payments
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.userId}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/users/${user.userId}`)
                        }
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600 hover:underline">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.mobile}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.payments.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={loadMoreUsers}
                disabled={loadingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loadingMore ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </span>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
