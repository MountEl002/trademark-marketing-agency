// utils/admin-setup.ts

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, collection, getDoc } from 'firebase/firestore';

interface AdminUser {
  email: string;
  role: 'super_admin';
  createdAt: Date;
  lastUpdated: Date;
}

export async function createSuperAdmin(email: string, password: string) {
  try {
    // 1. Sign in the user first
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Set up admin document
    const db = getFirestore();
    const adminData: AdminUser = {
      email,
      role: 'super_admin',
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    // 3. Create admin document in Firestore
    await setDoc(doc(db, 'users', uid), adminData);
    
    // 4. Create a separate admin roles collection for quick lookups
    await setDoc(doc(db, 'admin_roles', uid), {
      role: 'super_admin',
      email
    });

    return {
      success: true,
      message: 'Super admin created successfully',
      uid
    };
  } catch (error) {
    console.error('Error creating super admin:', error);
    throw error;
  }
}

// Optional: Helper function to verify admin status
export async function isUserSuperAdmin(uid: string) {
  const db = getFirestore();
  const adminDocRef = doc(collection(db, 'admin_roles'), uid);
  const adminDoc = await getDoc(adminDocRef);
  return adminDoc.exists() && adminDoc.data()?.role === 'super_admin';
}