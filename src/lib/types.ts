

import { Timestamp } from "firebase/firestore";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'client' | 'coach' | 'seller';
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  sessionsCompleted?: number;
  totalSessions?: number;
  xp?: number;
  address?: string;
}

export type WorkoutCategory = 'Shooting' | 'Ball Handling' | 'Defense' | 'Conditioning' | 'Vertical Jump';

export interface Workout {
  id: string;
  title: string;
  authorId?: string;
  category: WorkoutCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  description: string;
  steps: string[];
  videoUrl: string;
  imageId: string;
}

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Pre-game' | 'Post-game';

export interface Meal {
  id: string;
  authorId?: string;
  title: string;
  category: MealCategory;
  imageId: string;
  ingredients: string[];
  steps: string[];
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
}

export interface WorkoutProgress {
  id?: string;
  userId: string;
  workoutId: string;
  date: Timestamp;
  timeSpent: number; // minutes spent
  isCompleted: boolean;
}

export interface UserMealPlan {
  id: string; // e.g., userId_day_mealTime
  userId: string;
  mealId: string;
  authorId: string;
  day: string; // e.g., "Monday"
  mealTime: MealCategory;
}

export interface ScheduleEvent {
    id: string;
    userId: string;
    date: Date;
    type: 'workout' | 'rest' | 'game' | 'meal';
    title: string;
    workoutId?: string;
    mealId?: string;
}

export interface Location {
    id: string;
    name: string;
    address: string;
    photoUrls: string[];
    creatorId: string;
}

export interface BallIsLifePost {
    id: string;
    creatorId: string;
    creatorName: string;
    creatorPhotoUrl: string;
    selfieUrl: string;
    location: string;
    createdAt: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  priceXp: number;
  priceCash: number;
  stock: number;
}

export interface UserOrder {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImageId: string;
  paymentMethod: 'xp' | 'cod';
  amountPaid: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';
  createdAt: Timestamp;
}

export interface Connection {
    status: 'pending' | 'accepted';
    initiator: string; // UID of the user who sent the request
}

export interface ChatMessage {
    id?: string;
    text: string;
    senderId: string;
    receiverId: string;
    createdAt: Timestamp;
}

    