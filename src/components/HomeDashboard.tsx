import React from "react";
import { ScreenType, UserProfile, WorkoutDay, Meal } from "../types";
import { IMAGES } from "../data/mockData";
import { Play, Sparkles, Flame, CheckCircle, ChevronRight, Dumbbell, Utensils, TrendingUp, Bot } from "lucide-react";

interface HomeDashboardProps {
  userProfile: UserProfile;
  workoutDays: WorkoutDay[];
  meals: Meal[];
  onNavigate: (screen: ScreenType) => void;
  onStartWorkout: (workout: WorkoutDay) => void;
  onSelectMeal: (meal: Meal) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  workoutDays,
  meals,
  onNavigate,
  onStartWorkout,
  onSelectMeal,
}) => {
  const todayWorkout = workoutDays.find((w) => !w.isRest) || workoutDays[0];
  const completedWorkoutsCount = workoutDays.filter((w) => w.completed && !w.isRest).length;
  const totalPlannedWorkouts = workoutDays.filter((w) => !w.isRest).length;

  const totalCaloriesPlanned = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinPlanned = meals.reduce((acc, m) => acc + m.protein, 0);

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-10 max-w-6xl mx-auto min-h-screen text-[#131b2e] animate-fadeIn">
      {/* Greeting Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#131b2e]">
            Good morning, {userProfile.name} 👋
          </h1>
          <p className="text-sm text-[#434656] mt-0.5">
            Here's your personalized fitness and nutrition overview.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 bg-[#eaedff] border border-[#c3c5d9]/60 px-3.5 py-1.5 rounded-full w-max">
          <span className="w-2 h-2 rounded-full bg-[#506600] animate-pulse" />
          <span className="text-xs font-bold text-[#003ec7]">
            Active Phase: Hypertrophy & Recomp
          </span>
        </div>
      </div>

      {/* Personalized Plan Bento Card */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#c3c5d9]/60 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003ec7] text-xl">tune</span>
            <h3 className="font-headline font-bold text-base text-[#131b2e]">
              Personalized Plan Summary
            </h3>
          </div>
          <button
            onClick={() => onNavigate("progress")}
            className="text-xs font-bold text-[#003ec7] hover:underline flex items-center gap-0.5"
          >
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
            <span className="text-[11px] font-semibold text-[#737688] uppercase tracking-wider block mb-1">
              Primary Goal
            </span>
            <span className="font-headline font-bold text-sm text-[#131b2e] block truncate">
              {userProfile.goal}
            </span>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
            <span className="text-[11px] font-semibold text-[#737688] uppercase tracking-wider block mb-1">
              Experience
            </span>
            <span className="font-headline font-bold text-sm text-[#131b2e] block truncate">
              {userProfile.experience}
            </span>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
            <span className="text-[11px] font-semibold text-[#737688] uppercase tracking-wider block mb-1">
              Commitment
            </span>
            <span className="font-headline font-bold text-sm text-[#131b2e] block truncate">
              {userProfile.scheduleDays} Days / Week
            </span>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
            <span className="text-[11px] font-semibold text-[#737688] uppercase tracking-wider block mb-1">
              Nutrition Base
            </span>
            <span className="font-headline font-bold text-sm text-[#131b2e] block truncate">
              {userProfile.diet}
            </span>
          </div>
        </div>
      </div>

      {/* Hero: Today's Featured Workout */}
      <div className="relative rounded-3xl overflow-hidden shadow-md mb-6 group border border-[#c3c5d9]/60">
        <div className="h-64 sm:h-72 w-full relative">
          <img
            src={IMAGES.todayWorkout}
            alt="Today's Workout"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-[#131b2e]/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#c1f100] text-[#546b00] px-3 py-1 rounded-full text-xs font-bold mb-2.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#506600]" />
              Today's Session • Monday
            </div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {todayWorkout.focus} Strength
            </h2>
            <p className="text-sm text-white/90 mt-1 flex items-center gap-3">
              <span>⏱ {todayWorkout.durationMinutes} mins</span>
              <span>•</span>
              <span>🔥 ~{todayWorkout.caloriesBurned} kcal</span>
              <span>•</span>
              <span>⚡ {todayWorkout.intensity}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("workout")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold px-4 py-2.5 rounded-full text-xs transition-colors"
            >
              View Exercises
            </button>
            <button
              onClick={() => onStartWorkout(todayWorkout)}
              className="bg-[#c1f100] text-[#546b00] font-headline font-bold px-6 py-3 rounded-full hover:bg-[#c3f400] transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-black/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Workout
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Metric 1: Workouts Completed */}
        <div
          onClick={() => onNavigate("workout")}
          className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#003ec7]/10 text-[#003ec7] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">fitness_center</span>
              </div>
              <span className="text-xs font-bold text-[#003ec7]">
                {Math.round((completedWorkoutsCount / totalPlannedWorkouts) * 100)}%
              </span>
            </div>
            <span className="text-xs font-semibold text-[#737688] uppercase tracking-wider block">
              Weekly Workouts
            </span>
            <div className="font-headline font-extrabold text-2xl text-[#131b2e] mt-1">
              {completedWorkoutsCount} / {totalPlannedWorkouts}{" "}
              <span className="text-sm font-normal text-[#737688]">sessions</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#003ec7] rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (completedWorkoutsCount / totalPlannedWorkouts) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#434656] mt-2">
              Next scheduled: Upper Hypertrophy (Thursday)
            </p>
          </div>
        </div>

        {/* Metric 2: Nutrition Targets */}
        <div
          onClick={() => onNavigate("nutrition")}
          className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#c1f100] text-[#546b00] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">restaurant</span>
              </div>
              <span className="text-xs font-bold text-[#546b00]">
                {userProfile.diet}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#737688] uppercase tracking-wider block">
              Daily Macro Target
            </span>
            <div className="font-headline font-extrabold text-2xl text-[#131b2e] mt-1">
              {totalCaloriesPlanned}{" "}
              <span className="text-sm font-normal text-[#737688]">
                / {userProfile.calorieTarget} kcal
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#434656] mb-1 font-medium">
              <span>Protein: {totalProteinPlanned}g</span>
              <span>Target: {userProfile.proteinTarget}g</span>
            </div>
            <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#506600] rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (totalProteinPlanned / userProfile.proteinTarget) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Overall Goal Progress */}
        <div
          onClick={() => onNavigate("progress")}
          className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#c02f09]/10 text-[#c02f09] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl">monitoring</span>
            </div>
            <span className="text-xs font-semibold text-[#737688] uppercase tracking-wider block">
              Goal Progress
            </span>
            <div className="font-headline font-extrabold text-2xl text-[#131b2e] mt-1">
              68%
            </div>
            <p className="text-[11px] text-[#506600] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +2.4% vs last week
            </p>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#eaedff]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#003ec7]"
                strokeDasharray="68, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-headline font-bold text-sm text-[#131b2e]">
              68%
            </span>
          </div>
        </div>
      </div>

      {/* AI Coach Banner */}
      <div className="bg-[#eaedff]/70 border border-[#003ec7]/20 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#003ec7] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-[#003ec7] flex items-center gap-1.5">
              FitAI Smart Coach Insight
              <Sparkles className="w-3.5 h-3.5 text-[#506600]" />
            </h4>
            <p className="text-xs text-[#434656] mt-0.5 leading-relaxed max-w-2xl">
              "High-protein post-workout accelerates myofibrillar repair. Have your paneer & dal meal within 90 minutes of today's strength session."
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("assistant")}
          className="bg-white text-[#003ec7] border border-[#003ec7]/30 text-xs font-bold px-4 py-2 rounded-full hover:bg-[#003ec7] hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0 active:scale-95 cursor-pointer"
        >
          Ask Coach <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Meal Preview & Log History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Meals Quick List */}
        <div className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-base text-[#131b2e] flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#003ec7]" />
              Today's Meals
            </h3>
            <button
              onClick={() => onNavigate("nutrition")}
              className="text-xs font-bold text-[#003ec7] hover:underline"
            >
              Full Menu →
            </button>
          </div>

          <div className="space-y-3">
            {meals.slice(0, 3).map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMeal(m)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#faf8ff] border border-[#c3c5d9]/50 hover:border-[#003ec7]/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#737688]">
                      {m.type}
                    </span>
                    <h5 className="font-headline font-bold text-xs text-[#131b2e]">
                      {m.title}
                    </h5>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline font-bold text-xs text-[#003ec7]">
                    {m.calories} kcal
                  </span>
                  <span className="text-[10px] text-[#737688] block">
                    {m.protein}g pro
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white p-5 rounded-3xl border border-[#c3c5d9]/60 shadow-sm flex flex-col justify-between">
          <h3 className="font-headline font-bold text-base text-[#131b2e] mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3 flex-grow">
            <button
              onClick={() => onStartWorkout(todayWorkout)}
              className="p-4 rounded-2xl bg-[#eaedff] hover:bg-[#dde1ff] text-[#003ec7] flex flex-col items-center justify-center text-center transition-all cursor-pointer"
            >
              <Dumbbell className="w-6 h-6 mb-1.5" />
              <span className="font-headline font-bold text-xs">Start Today's Workout</span>
            </button>

            <button
              onClick={() => onNavigate("nutrition")}
              className="p-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#546b00] flex flex-col items-center justify-center text-center transition-all cursor-pointer"
            >
              <Utensils className="w-6 h-6 mb-1.5 text-[#506600]" />
              <span className="font-headline font-bold text-xs text-[#131b2e]">
                Log / Swap Meal
              </span>
            </button>

            <button
              onClick={() => onNavigate("progress")}
              className="p-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#971f00] flex flex-col items-center justify-center text-center transition-all cursor-pointer"
            >
              <TrendingUp className="w-6 h-6 mb-1.5" />
              <span className="font-headline font-bold text-xs text-[#131b2e]">
                Log Weight & Stats
              </span>
            </button>

            <button
              onClick={() => onNavigate("assistant")}
              className="p-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#003ec7] flex flex-col items-center justify-center text-center transition-all cursor-pointer"
            >
              <Bot className="w-6 h-6 mb-1.5" />
              <span className="font-headline font-bold text-xs text-[#131b2e]">
                Ask Fitness Coach
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
