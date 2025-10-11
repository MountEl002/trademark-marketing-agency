import { DatabaseName } from "@/lib/constants";

export interface IndexedDBFileRecord {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileBuffer: ArrayBuffer;
  domain: string;
  uploadedAt: string;
}

// Database connections cache to prevent concurrent upgrades
const dbConnections = new Map<string, Promise<IDBDatabase>>();
const DB_VERSION = 2;

/**
 * Get or create the IndexedDB database instance for specified database name
 */
function getDatabase(dbName: DatabaseName): Promise<IDBDatabase> {
  if (!dbConnections.has(dbName)) {
    const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, DB_VERSION);

      request.onerror = () => {
        console.error("IndexedDB open error:", request.error);
        dbConnections.delete(dbName);
        reject(request.error);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (db.objectStoreNames.contains("files")) {
          db.deleteObjectStore("files");
        }

        const objectStore = db.createObjectStore("files", {
          keyPath: "fileKey",
        });

        objectStore.createIndex("fileName", "fileName", { unique: false });
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("files")) {
          console.error(
            "Object store 'files' was not created properly, attempting to recreate database"
          );
          db.close();

          const deleteRequest = indexedDB.deleteDatabase(dbName);
          deleteRequest.onsuccess = () => {
            dbConnections.delete(dbName);
            getDatabase(dbName).then(resolve).catch(reject);
          };
          deleteRequest.onerror = () => {
            console.error("Failed to delete corrupted database");
            dbConnections.delete(dbName);
            reject(
              new Error(
                "Database schema initialization failed and cannot be repaired"
              )
            );
          };
          return;
        }
        resolve(db);
      };

      request.onblocked = () => {
        console.warn("IndexedDB upgrade blocked by another connection");
      };
    });

    dbConnections.set(dbName, dbPromise);
  }

  return dbConnections.get(dbName)!;
}

/**
 * Save file to IndexedDB with specified database name
 */
export async function saveToIndexedDB(params: {
  dbName: DatabaseName;
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileBuffer: ArrayBuffer;
}): Promise<void> {
  const { dbName, fileKey, fileName, fileUrl, fileBuffer } = params;

  try {
    const db = await getDatabase(dbName);

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");

      const fileRecord: IndexedDBFileRecord = {
        fileKey,
        fileName,
        fileUrl,
        fileBuffer,
        domain: dbName,
        uploadedAt: new Date().toISOString(),
      };

      const putRequest = objectStore.put(fileRecord);

      putRequest.onsuccess = () => {
        resolve();
      };

      putRequest.onerror = () => {
        console.error("IndexedDB put error:", putRequest.error);
        reject(putRequest.error);
      };

      transaction.onerror = () => {
        console.error("IndexedDB transaction error:", transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Failed to get database connection:", error);
    throw error;
  }
}

/**
 * Get file from IndexedDB by fileKey from specified database
 */
export async function getFromIndexedDB(
  dbName: DatabaseName,
  fileKey: string
): Promise<IndexedDBFileRecord | null> {
  try {
    const db = await getDatabase(dbName);

    return new Promise<IndexedDBFileRecord | null>((resolve, reject) => {
      const transaction = db.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const getRequest = objectStore.get(fileKey);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };

      getRequest.onerror = () => {
        console.error("IndexedDB get error:", getRequest.error);
        reject(getRequest.error);
      };

      transaction.onerror = () => {
        console.error("IndexedDB transaction error:", transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Failed to get database connection:", error);
    throw error;
  }
}

/**
 * Clear all files from specified IndexedDB database
 */
export async function clearIndexedDB(dbName: DatabaseName): Promise<void> {
  try {
    const db = await getDatabase(dbName);

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        resolve();
      };

      clearRequest.onerror = () => {
        console.error("IndexedDB clear error:", clearRequest.error);
        reject(clearRequest.error);
      };
    });
  } catch (error) {
    console.error("Failed to clear IndexedDB:", error);
    throw error;
  }
}

/**
 * Reset specified IndexedDB database
 */
export async function resetIndexedDB(dbName: DatabaseName): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const dbPromise = dbConnections.get(dbName);
    if (dbPromise) {
      dbPromise.then((db) => db.close()).catch(() => {});
      dbConnections.delete(dbName);
    }

    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onsuccess = () => {
      resolve();
    };

    deleteRequest.onerror = () => {
      console.error("Failed to reset IndexedDB database:", deleteRequest.error);
      reject(deleteRequest.error);
    };

    deleteRequest.onblocked = () => {
      console.warn("IndexedDB reset blocked - please close all other tabs");
      resolve();
    };
  });
}

/**
 * Delete file from specified IndexedDB database by fileKey
 */
export async function deleteFromIndexedDB(
  dbName: DatabaseName,
  fileKey: string
): Promise<void> {
  try {
    const db = await getDatabase(dbName);

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");
      const deleteRequest = objectStore.delete(fileKey);

      deleteRequest.onsuccess = () => {
        resolve();
      };

      deleteRequest.onerror = () => {
        console.error("IndexedDB delete error:", deleteRequest.error);
        reject(deleteRequest.error);
      };

      transaction.onerror = () => {
        console.error("IndexedDB transaction error:", transaction.error);
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Failed to get database connection:", error);
    throw error;
  }
}

/**
 * Delete a specific IndexedDB database by name
 */
export async function deleteIndexedDatabase(
  databaseName: DatabaseName
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(databaseName);

    deleteRequest.onsuccess = () => {
      resolve();
    };

    deleteRequest.onerror = () => {
      console.error(
        `Failed to delete IndexedDB database '${databaseName}':`,
        deleteRequest.error
      );
      reject(deleteRequest.error);
    };

    deleteRequest.onblocked = () => {
      console.warn(
        `IndexedDB database '${databaseName}' deletion blocked - please close all other tabs`
      );
      resolve();
    };
  });
}
