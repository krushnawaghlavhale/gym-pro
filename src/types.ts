export type ScreenType =
  | "landing"
  | "onboarding"
  | "analyzing"
  | "home"
  | "workout"
  | "nutrition"
  | "progress"
  | "assistant";

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  goal: string;
  experience: "Beginner" | "Intermediate" | "Advanced";
  scheduleDays: number;
  locations: string[];
  equipment: string[];
  hasLimitations: boolean;
  limitations: string[];
  diet: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Eggetarian";
  dietPreferences: string[];
  allergies: string;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  calorieTarget: number;
  onboardingCompleted: boolean;
}

export interface Exercise {
  id: string;
  orderNumber: number;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  equipment: string;
  sets: number;
  reps: string;
  rest: string;
  imageUrl: string;
  description: string;
  instructions: string[];
  targetMuscles: string[];
}

export interface WorkoutDay {
  id: string;
  dayShort: string;
  focus: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: string;
  isRest: boolean;
  completed: boolean;
  exercises: Exercise[];
}

export interface Meal {
  id: string;
  type: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinProgressPercent: number;
  imageUrl: string;
  tags: string[];
  ingredients: string[];
  instructions: string;
}

export interface WeightRecord {
  week: string;
  weight: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "workout" | "nutrition" | "progress" | "ai";
}
