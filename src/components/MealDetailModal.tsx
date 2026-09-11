import React from "react";
import { Meal } from "../types";
import { X, Check, Utensils, Flame, Sparkles, RefreshCw } from "lucide-react";

interface MealDetailModalProps {
  meal: Meal | null;
  onClose: () => void;
  onSelectAlternative: (newMeal: Meal) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  onClose,
  onSelectAlternative,
}) => {
  if (!meal) return null;

  const alternativeMeals: Meal[] = [
    {
      id: "alt-1",
      type: meal.type,
      title: "Tofu Scramble & Avocado Toast",
      description: "Organic crumbled firm tofu spiced with turmeric, black pepper, and nutritional yeast over artisanal sourdough toast.",
      calories: 380,
      protein: 22,
      carbs: 35,
      fat: 14,
      proteinProgressPercent: 40,
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
      tags: ["Vegetarian", "High-protein", "Quick"],
      ingredients: ["Firm Tofu 150g", "Whole Grain Sourdough (1 slice)", "Avocado 40g", "Turmeric, Garlic Powder, Nutritional Yeast"],
      instructions: "Sauté crumbled tofu in olive oil with turmeric, garlic powder, and nutritional yeast. Toast sourdough bread and top with sliced avocado and warm tofu scramble.",
    },
    {
      id: "alt-2",
      type: meal.type,
      title: "Greek Yogurt Bowl with Chia & Berries",
      description: "High-protein strained yogurt with antioxidants, fresh organic blueberries, soaked chia seeds, and raw honey.",
      calories: 290,
      protein: 24,
      carbs: 28,
      fat: 6,
      proteinProgressPercent: 35,
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
      tags: ["Vegetarian", "No-cook", "High-protein"],
      ingredients: ["0% Greek Yogurt 200g", "Blueberries & Strawberries 80g", "Chia Seeds 1 tbsp", "Almonds 10g"],
      instructions: "Scoop Greek yogurt into bowl. Layer with fresh berries, soaked chia seeds, and chopped roasted almonds.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#c3c5d9] shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#131b2e] flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Meal Image Banner */}
        <div className="relative h-56 w-full">
          <img
            src={meal.imageUrl}
            alt={meal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="bg-[#003ec7] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {meal.type}
            </span>
            <span className="bg-[#c1f100] text-[#546b00] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {meal.tags[0] || "Nutritious"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-headline font-extrabold text-2xl text-[#131b2e] mb-1">
            {meal.title}
          </h2>
          <p className="text-xs text-[#434656] leading-relaxed mb-6">
            {meal.description}
          </p>

          {/* Macro Breakdown */}
          <div className="grid grid-cols-4 gap-2 text-center mb-6">
            <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
              <span className="text-[10px] font-bold text-[#737688] uppercase block">
                Calories
              </span>
              <span className="font-headline font-bold text-base text-[#003ec7]">
                {meal.calories}
              </span>
            </div>
            <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
              <span className="text-[10px] font-bold text-[#737688] uppercase block">
                Protein
              </span>
              <span className="font-headline font-bold text-base text-[#506600]">
                {meal.protein}g
              </span>
            </div>
            <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
              <span className="text-[10px] font-bold text-[#737688] uppercase block">
                Carbs
              </span>
              <span className="font-headline font-bold text-base text-[#131b2e]">
                {meal.carbs}g
              </span>
            </div>
            <div className="bg-[#f2f3ff] p-3 rounded-2xl border border-[#c3c5d9]/40">
              <span className="text-[10px] font-bold text-[#737688] uppercase block">
                Fat
              </span>
              <span className="font-headline font-bold text-base text-[#131b2e]">
                {meal.fat}g
              </span>
            </div>
          </div>

          {/* Ingredients */}
          {meal.ingredients && (
            <div className="mb-6">
              <h4 className="font-headline font-bold text-sm text-[#131b2e] mb-2.5 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#003ec7]" />
                Ingredients & Quantities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meal.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-[#faf8ff] rounded-xl border border-[#c3c5d9]/40 text-xs font-medium text-[#434656] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#003ec7]" />
                    {ing}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {meal.instructions && (
            <div className="mb-6">
              <h4 className="font-headline font-bold text-sm text-[#131b2e] mb-2">
                Preparation Guide
              </h4>
              <p className="text-xs text-[#434656] leading-relaxed bg-[#faf8ff] p-3.5 rounded-2xl border border-[#c3c5d9]/40">
                {meal.instructions}
              </p>
            </div>
          )}

          {/* Alternative Swap Suggestions */}
          <div className="mb-6">
            <h4 className="font-headline font-bold text-sm text-[#131b2e] mb-3 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-[#506600]" />
              Smart Meal Substitutes
            </h4>
            <div className="space-y-2.5">
              {alternativeMeals.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onSelectAlternative(alt)}
                  className="p-3 rounded-2xl border border-[#c3c5d9]/60 hover:border-[#003ec7] bg-[#faf8ff] hover:bg-[#eaedff]/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={alt.imageUrl}
                      alt={alt.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h5 className="font-headline font-bold text-xs text-[#131b2e] group-hover:text-[#003ec7]">
                        {alt.title}
                      </h5>
                      <span className="text-[11px] text-[#737688]">
                        {alt.calories} kcal • {alt.protein}g protein
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#003ec7] group-hover:underline">
                    Swap to This
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#003ec7] text-white font-headline font-bold py-3 rounded-full hover:bg-[#0052ff] transition-all cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
