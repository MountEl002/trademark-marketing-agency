import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FileDetails {
  fileName: string;
  fileKey: string;
  fileUrl?: string;
  uploadDate: Date;
}

export async function getOrderFiles(
  userId: string,
  orderNumber: string
): Promise<FileDetails[]> {
  // Validate inputs
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (!orderNumber) {
    throw new Error('Order number is required');
  }

  try {
    // Create a query to fetch files
    const filesRef = collection(db, 'files');
    const fileQuery = query(
      filesRef,
      where('userId', '==', userId),
      // where('orderNumber', '==', orderNumber)
    );

    // Execute query
    console.log("Fetching started");

    const querySnapshot = await getDocs(fileQuery);
      console.log("The found data is:", querySnapshot);

    
    if (querySnapshot.empty) {
      return [];
    }

    // Map the documents to our FileDetails interface
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        fileName: data.fileName,
        fileKey: data.fileKey,
        fileUrl: data.fileUrl,
        uploadDate: data.uploadedAt?.toDate()
      };
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    throw new Error('Failed to fetch files. Please try again later.');
  }
}
