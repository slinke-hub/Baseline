
import admin from 'firebase-admin';
import { Product, Workout, Meal } from '@/lib/types';

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

  if (!admin.apps.length) {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fallback for environments where service account is auto-discovered
      admin.initializeApp();
    }
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

const firestore = admin.firestore();

// Product Functions
export async function getAllProducts(): Promise<Product[]> {
  const productsSnapshot = await firestore.collection('products').get();
  const products: Product[] = [];
  productsSnapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = firestore.collection('products').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as Product;
}
