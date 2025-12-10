export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'client';
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
}

export type WorkoutCategory = 'Shooting' | 'Ball Handling' | 'Defense' | 'Conditioning' | 'Vertical Jump';

export interface Workout {
  id: string;
  title: string;
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
  id: string;
  userId: string;
  workoutId: string;
  date: number; // timestamp
  duration: number; // minutes spent
}

export type ScheduleEvent = {
    id: string;
    userId: string;
    date: Date;
    type: 'workout' | 'rest' | 'game' | 'meal';
    title: string;
    workoutId?: string;
    mealId?: string;
}
