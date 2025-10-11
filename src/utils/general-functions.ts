import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function deleteCollection(collectionPath: string): Promise<void> {
  const collectionRef = collection(db, collectionPath);
  const snapshot = await getDocs(collectionRef);

  const deletePromises = snapshot.docs.map((document) =>
    deleteDoc(doc(db, collectionPath, document.id))
  );

  await Promise.all(deletePromises);
}
