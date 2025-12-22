
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
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      // Initialize without credentials in environments where they are auto-discovered
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


// Workout Functions
export async function getAllWorkouts(): Promise<Workout[]> {
    const snapshot = await firestore.collection('workouts').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
}

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
export async function getAllMeals(): Promise<Meal[]> {
    const snapshot = await firestore.collection('meals').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
}

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
