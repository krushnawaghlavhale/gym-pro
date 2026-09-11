import React, { useState } from "react";
import { ScreenType, UserProfile, WorkoutDay, Meal, Exercise, WeightRecord, NotificationItem } from "./types";
import {
  DEFAULT_USER_PROFILE,
  INITIAL_WORKOUT_DAYS,
  INITIAL_MEALS,
  INITIAL_WEIGHT_RECORDS,
  INITIAL_NOTIFICATIONS,
} from "./data/mockData";
import { TopAppBar } from "./components/TopAppBar";
import { BottomNavBar } from "./components/BottomNavBar";
import { LandingPage } from "./components/LandingPage";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { PlanGeneratingScreen } from "./components/PlanGeneratingScreen";
import { HomeDashboard } from "./components/HomeDashboard";
import { WorkoutScreen } from "./components/WorkoutScreen";
import { WorkoutPlayerModal } from "./components/WorkoutPlayerModal";
import { ExerciseDetailModal } from "./components/ExerciseDetailModal";
import { NutritionScreen } from "./components/NutritionScreen";
import { MealDetailModal } from "./components/MealDetailModal";
import { ProgressScreen } from "./components/ProgressScreen";
import { AssistantScreen } from "./components/AssistantScreen";
import { NotificationsModal } from "./components/NotificationsModal";
import { ProfileModal } from "./components/ProfileModal";

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("landing");
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(INITIAL_WORKOUT_DAYS);
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(INITIAL_WEIGHT_RECORDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modal States
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);
  const [activeWorkoutPlayer, setActiveWorkoutPlayer] = useState<WorkoutDay | null>(null);
  const [activeMealModal, setActiveMealModal] = useState<Meal | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const handleStartOnboarding = () => {
    setCurrentScreen("onboarding");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOnboardingComplete = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setCurrentScreen("analyzing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlanGenerated = (recommendationData?: any) => {
    if (recommendationData) {
      if (recommendationData.profileSummary) {
        setUserProfile((prev) => ({
          ...prev,
          calorieTarget: recommendationData.profileSummary.calorieTargetKcal || prev.calorieTarget,
          proteinTarget:
            recommendationData.profileSummary.macroTargets?.proteinGrams || prev.proteinTarget,
          carbTarget:
            recommendationData.profileSummary.macroTargets?.carbsGrams || prev.carbTarget,
          fatTarget: recommendationData.profileSummary.macroTargets?.fatGrams || prev.fatTarget,
        }));
      }

      if (
        recommendationData.fitnessPlan?.schedule &&
        Array.isArray(recommendationData.fitnessPlan.schedule)
      ) {
        const mappedDays: WorkoutDay[] = recommendationData.fitnessPlan.schedule.map(
          (d: any, idx: number) => ({
            id: `server-day-${idx + 1}`,
            dayShort: d.dayShort || `D${idx + 1}`,
            focus: d.focus || "Daily Workout",
            durationMinutes: d.durationMinutes || 45,
            caloriesBurned: d.caloriesBurned || 350,
            intensity: d.intensity || "Moderate",
            isRest: !!d.isRest,
            completed: false,
            exercises: (d.exercises || []).map((ex: any, eIdx: number) => ({
              id: `server-ex-${idx}-${eIdx}`,
              orderNumber: eIdx + 1,
              name: ex.name,
              level: userProfile.experience,
              equipment: ex.equipment || "Gym Equipment",
              sets: ex.sets || 3,
              reps: String(ex.reps || "10-12"),
              rest: ex.rest || "60s",
              imageUrl:
                ex.imageUrl ||
                "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
              description: ex.formCues || "Focus on mind-muscle connection and controlled tempo.",
              instructions: [
                ex.formCues || "Execute with controlled tempo.",
                "Breathe out during concentric contraction.",
                "Maintain neutral spine posture.",
              ],
              targetMuscles: ex.targetMuscles || ["Target Muscles"],
            })),
          })
        );
        if (mappedDays.length > 0) {
          setWorkoutDays(mappedDays);
        }
      }

      if (
        recommendationData.nutritionPlan?.meals &&
        Array.isArray(recommendationData.nutritionPlan.meals)
      ) {
        const mappedMeals: Meal[] = recommendationData.nutritionPlan.meals.map(
          (m: any, idx: number) => ({
            id: `server-meal-${idx + 1}`,
            type: m.type as any,
            title: m.title,
            description: m.instructions || "Balanced nutrition for recovery and performance.",
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
            proteinProgressPercent: Math.min(
              100,
              Math.round((m.protein / (userProfile.proteinTarget || 120)) * 100)
            ),
            imageUrl:
              m.imageUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
            tags: [userProfile.diet, "Server Recommended"],
            ingredients: m.ingredients || ["Wholesome ingredients"],
            instructions: m.instructions || "Prepare fresh and enjoy.",
          })
        );
        if (mappedMeals.length > 0) {
          setMeals(mappedMeals);
        }
      }
    }

    setCurrentScreen("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleWorkoutCompleted = (dayId: string) => {
    setWorkoutDays((prev) =>
      prev.map((w) => (w.id === dayId ? { ...w, completed: !w.completed } : w))
    );
  };

  const handleFinishWorkout = (workoutId: string) => {
    setWorkoutDays((prev) =>
      prev.map((w) => (w.id === workoutId ? { ...w, completed: true } : w))
    );
  };

  const handleAddWeightRecord = (newWeight: number, weekLabel: string) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    setWeightRecords((prev) => [
      ...prev,
      { week: weekLabel, weight: newWeight, date: today },
    ]);
    setUserProfile((prev) => ({ ...prev, weight: newWeight }));
  };

  const handleSwapMeal = (oldMeal: Meal) => {
    setActiveMealModal(oldMeal);
  };

  const handleSelectAlternativeMeal = (newMeal: Meal) => {
    setMeals((prev) =>
      prev.map((m) => (m.type === newMeal.type ? newMeal : m))
    );
    setActiveMealModal(null);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#c1f100] selection:text-[#546b00]">
      {/* Top Application Bar */}
      <TopAppBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        userProfile={userProfile}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onStartOnboarding={handleStartOnboarding}
      />

      {/* Screen Views */}
      <main className="flex-grow">
        {currentScreen === "landing" && (
          <LandingPage
            onStartOnboarding={handleStartOnboarding}
            onSeeDemo={() => setCurrentScreen("home")}
            onExploreFeatures={() => {
              const el = document.getElementById("features");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        {currentScreen === "onboarding" && (
          <OnboardingFlow
            initialProfile={userProfile}
            onComplete={handleOnboardingComplete}
            onCancel={() => setCurrentScreen("landing")}
          />
        )}

        {currentScreen === "analyzing" && (
          <PlanGeneratingScreen
            userProfile={userProfile}
            onFinish={handlePlanGenerated}
          />
        )}

        {currentScreen === "home" && (
          <HomeDashboard
            userProfile={userProfile}
            workoutDays={workoutDays}
            meals={meals}
            onNavigate={setCurrentScreen}
            onStartWorkout={(workout) => setActiveWorkoutPlayer(workout)}
            onSelectMeal={(meal) => setActiveMealModal(meal)}
          />
        )}

        {currentScreen === "workout" && (
          <WorkoutScreen
            userProfile={userProfile}
            workoutDays={workoutDays}
            onStartWorkout={(workout) => setActiveWorkoutPlayer(workout)}
            onViewExercise={(exercise) => setActiveExerciseModal(exercise)}
            onToggleWorkoutCompleted={handleToggleWorkoutCompleted}
          />
        )}

        {currentScreen === "nutrition" && (
          <NutritionScreen
            userProfile={userProfile}
            meals={meals}
            onSelectMeal={(meal) => setActiveMealModal(meal)}
            onSwapMeal={handleSwapMeal}
          />
        )}

        {currentScreen === "progress" && (
          <ProgressScreen
            userProfile={userProfile}
            weightRecords={weightRecords}
            onAddWeightRecord={handleAddWeightRecord}
          />
        )}

        {currentScreen === "assistant" && (
          <AssistantScreen userProfile={userProfile} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Modals & Dialogs */}
      {activeExerciseModal && (
        <ExerciseDetailModal
          exercise={activeExerciseModal}
          onClose={() => setActiveExerciseModal(null)}
        />
      )}

      {activeWorkoutPlayer && (
        <WorkoutPlayerModal
          workout={activeWorkoutPlayer}
          onClose={() => setActiveWorkoutPlayer(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {activeMealModal && (
        <MealDetailModal
          meal={activeMealModal}
          onClose={() => setActiveMealModal(null)}
          onSelectAlternative={handleSelectAlternativeMeal}
        />
      )}

      <NotificationsModal
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      <ProfileModal
        userProfile={userProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onRetakeOnboarding={handleStartOnboarding}
        onUpdateGoal={(g) => setUserProfile({ ...userProfile, goal: g })}
      />
    </div>
  );
};

export default App;
