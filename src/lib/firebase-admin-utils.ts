
import admin from 'firebase-admin';
import { Product, Workout, Meal } from '@/lib/types';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : undefined,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
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


// Workout Functions
export async function getAllWorkoutIds(): Promise<string[]> {
    const workoutsSnapshot = await firestore.collection('workouts').select().get();
    return workoutsSnapshot.docs.map(doc => doc.id);
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  const docRef = firestore.collection('workouts').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as Workout;
}


// Meal Functions
export async function getAllMealIds(): Promise<string[]> {
    const mealsSnapshot = await firestore.collection('meals').select().get();
    return mealsSnapshot.docs.map(doc => doc.id);
}

export async function getMealById(id: string): Promise<Meal | null> {
  const docRef = firestore.collection('meals').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as Meal;
}
