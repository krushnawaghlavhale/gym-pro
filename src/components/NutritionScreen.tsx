import React, { useState } from "react";
import { Meal, UserProfile } from "../types";
import { IMAGES } from "../data/mockData";
import { Plus, Sparkles, RefreshCw, CheckCircle, Flame, ChevronRight, Info } from "lucide-react";

interface NutritionScreenProps {
  userProfile: UserProfile;
  meals: Meal[];
  onSelectMeal: (meal: Meal) => void;
  onSwapMeal: (meal: Meal) => void;
}

export const NutritionScreen: React.FC<NutritionScreenProps> = ({
  userProfile,
  meals,
  onSelectMeal,
  onSwapMeal,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("Vegetarian");
  const [loggedMeals, setLoggedMeals] = useState<string[]>(["meal-1"]);

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  const filterChips = [
    "Vegetarian",
    "Non-Vegetarian",
    "Vegan",
    "Indian",
    "High-protein",
    "Budget-friendly",
  ];

  const handleToggleLogMeal = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (loggedMeals.includes(mealId)) {
      setLoggedMeals(loggedMeals.filter((id) => id !== mealId));
    } else {
      setLoggedMeals([...loggedMeals, mealId]);
    }
  };

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-10 max-w-6xl mx-auto min-h-screen text-[#131b2e] animate-fadeIn">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#131b2e]">
            Today's Nutrition Plan
          </h1>
          <p className="text-sm text-[#434656] mt-0.5">
            Optimal macros calculated for your {userProfile.goal} goal.
          </p>
        </div>

        {/* Daily Macros Banner */}
        <div className="bg-white px-4 py-2 rounded-2xl border border-[#c3c5d9]/60 shadow-sm flex items-center gap-4 text-xs font-semibold">
          <div>
            <span className="text-[#737688] block text-[10px] uppercase">Calories</span>
            <span className="font-headline font-bold text-sm text-[#003ec7]">
              {totalCalories} kcal
            </span>
          </div>
          <div className="w-px h-6 bg-[#c3c5d9]" />
          <div>
            <span className="text-[#737688] block text-[10px] uppercase">Protein</span>
            <span className="font-headline font-bold text-sm text-[#506600]">
              {totalProtein}g
            </span>
          </div>
          <div className="w-px h-6 bg-[#c3c5d9]" />
          <div>
            <span className="text-[#737688] block text-[10px] uppercase">Carbs / Fat</span>
            <span className="font-headline font-bold text-sm text-[#131b2e]">
              {totalCarbs}g / {totalFat}g
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {filterChips.map((chip) => {
          const isSelected = activeFilter === chip;
          return (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#c1f100] text-[#546b00] border-[#c1f100] shadow-sm scale-105"
                  : "bg-white text-[#434656] border-[#c3c5d9] hover:border-[#003ec7]"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Meal Cards Grid */}
      <div className="space-y-5">
        {/* Breakfast Card */}
        {meals
          .filter((m) => m.type === "Breakfast")
          .map((meal) => (
            <div
              key={meal.id}
              onClick={() => onSelectMeal(meal)}
              className="bg-white rounded-3xl p-5 md:p-6 border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover flex-shrink-0 border border-[#c3c5d9]/40"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003ec7] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
                    {meal.type}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-[#131b2e] mt-1">
                    {meal.title}
                  </h3>
                  <p className="text-xs text-[#434656] mt-0.5 max-w-md line-clamp-2">
                    {meal.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                    <span className="text-[#003ec7] font-bold">
                      🔥 {meal.calories} kcal
                    </span>
                    <span className="text-[#506600]">
                      ⚡ {meal.protein}g protein
                    </span>
                    <span className="text-[#737688]">
                      🌾 {meal.carbs}g carbs
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#c3c5d9]/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapMeal(meal);
                  }}
                  className="p-2.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#434656] hover:text-[#003ec7] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Swap meal"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Swap</span>
                </button>

                <button
                  onClick={(e) => handleToggleLogMeal(meal.id, e)}
                  className={`p-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    loggedMeals.includes(meal.id)
                      ? "bg-[#eaedff] text-[#003ec7]"
                      : "bg-[#003ec7] text-white hover:bg-[#0052ff]"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {loggedMeals.includes(meal.id) ? "Logged" : "Log Meal"}
                </button>
              </div>
            </div>
          ))}

        {/* Lunch Card */}
        {meals
          .filter((m) => m.type === "Lunch")
          .map((meal) => (
            <div
              key={meal.id}
              onClick={() => onSelectMeal(meal)}
              className="bg-white rounded-3xl p-5 md:p-6 border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover flex-shrink-0 border border-[#c3c5d9]/40"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003ec7] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
                    {meal.type}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-[#131b2e] mt-1">
                    {meal.title}
                  </h3>
                  <p className="text-xs text-[#434656] mt-0.5 max-w-md line-clamp-2">
                    {meal.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                    <span className="text-[#003ec7] font-bold">
                      🔥 {meal.calories} kcal
                    </span>
                    <span className="text-[#506600]">
                      ⚡ {meal.protein}g pro
                    </span>
                    <span className="text-[#737688]">
                      🌾 {meal.carbs}g carbs • 🥑 {meal.fat}g fat
                    </span>
                  </div>

                  {/* Protein progress bar */}
                  <div className="mt-2 w-48">
                    <div className="flex justify-between text-[10px] text-[#737688] mb-0.5">
                      <span>Protein Share</span>
                      <span>45% of daily target</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden">
                      <div className="h-full bg-[#506600] w-[45%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#c3c5d9]/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapMeal(meal);
                  }}
                  className="p-2.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#434656] hover:text-[#003ec7] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Swap meal"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Swap</span>
                </button>

                <button
                  onClick={(e) => handleToggleLogMeal(meal.id, e)}
                  className={`p-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    loggedMeals.includes(meal.id)
                      ? "bg-[#eaedff] text-[#003ec7]"
                      : "bg-[#003ec7] text-white hover:bg-[#0052ff]"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {loggedMeals.includes(meal.id) ? "Logged" : "Log Meal"}
                </button>
              </div>
            </div>
          ))}

        {/* Snack & Dinner Cards */}
        {meals
          .filter((m) => m.type === "Snack" || m.type === "Dinner")
          .map((meal) => (
            <div
              key={meal.id}
              onClick={() => onSelectMeal(meal)}
              className="bg-white rounded-3xl p-5 md:p-6 border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover flex-shrink-0 border border-[#c3c5d9]/40"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003ec7] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
                    {meal.type}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-[#131b2e] mt-1">
                    {meal.title}
                  </h3>
                  <p className="text-xs text-[#434656] mt-0.5 max-w-md line-clamp-2">
                    {meal.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                    <span className="text-[#003ec7] font-bold">
                      🔥 {meal.calories} kcal
                    </span>
                    <span className="text-[#506600]">
                      ⚡ {meal.protein}g pro
                    </span>
                    <span className="text-[#737688]">
                      🌾 {meal.carbs}g carbs • 🥑 {meal.fat}g fat
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#c3c5d9]/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapMeal(meal);
                  }}
                  className="p-2.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#434656] hover:text-[#003ec7] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Swap meal"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Swap</span>
                </button>

                <button
                  onClick={(e) => handleToggleLogMeal(meal.id, e)}
                  className={`p-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    loggedMeals.includes(meal.id)
                      ? "bg-[#eaedff] text-[#003ec7]"
                      : "bg-[#003ec7] text-white hover:bg-[#0052ff]"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {loggedMeals.includes(meal.id) ? "Logged" : "Log Meal"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
