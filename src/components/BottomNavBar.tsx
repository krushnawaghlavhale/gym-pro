import React from "react";
import { ScreenType } from "../types";

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Suppress on landing and onboarding
  if (
    currentScreen === "landing" ||
    currentScreen === "onboarding" ||
    currentScreen === "analyzing"
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#faf8ff] border-t border-[#c3c5d9] flex justify-around items-center h-20 px-2 pb-safe md:hidden shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
      {/* Home */}
      <button
        onClick={() => onNavigate("home")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          currentScreen === "home"
            ? "text-[#003ec7] bg-[#c1f100]/25 rounded-xl px-3 py-1 scale-105"
            : "text-[#434656] hover:text-[#003ec7] w-16"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: currentScreen === "home" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          home
        </span>
        <span
          className={`text-xs mt-0.5 ${
            currentScreen === "home" ? "font-bold text-[#003ec7]" : "font-medium"
          }`}
        >
          Home
        </span>
      </button>

      {/* Workout */}
      <button
        onClick={() => onNavigate("workout")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          currentScreen === "workout"
            ? "text-[#003ec7] bg-[#c1f100]/25 rounded-xl px-3 py-1 scale-105"
            : "text-[#434656] hover:text-[#003ec7] w-16"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: currentScreen === "workout" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          fitness_center
        </span>
        <span
          className={`text-xs mt-0.5 ${
            currentScreen === "workout" ? "font-bold text-[#003ec7]" : "font-medium"
          }`}
        >
          Workout
        </span>
      </button>

      {/* Nutrition */}
      <button
        onClick={() => onNavigate("nutrition")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          currentScreen === "nutrition"
            ? "text-[#003ec7] bg-[#c1f100]/25 rounded-xl px-3 py-1 scale-105"
            : "text-[#434656] hover:text-[#003ec7] w-16"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: currentScreen === "nutrition" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          restaurant
        </span>
        <span
          className={`text-xs mt-0.5 ${
            currentScreen === "nutrition" ? "font-bold text-[#003ec7]" : "font-medium"
          }`}
        >
          Nutrition
        </span>
      </button>

      {/* Progress */}
      <button
        onClick={() => onNavigate("progress")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          currentScreen === "progress"
            ? "text-[#003ec7] bg-[#c1f100]/25 rounded-xl px-3 py-1 scale-105"
            : "text-[#434656] hover:text-[#003ec7] w-16"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: currentScreen === "progress" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          monitoring
        </span>
        <span
          className={`text-xs mt-0.5 ${
            currentScreen === "progress" ? "font-bold text-[#003ec7]" : "font-medium"
          }`}
        >
          Progress
        </span>
      </button>

      {/* Assistant */}
      <button
        onClick={() => onNavigate("assistant")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          currentScreen === "assistant"
            ? "text-[#003ec7] bg-[#c1f100]/25 rounded-xl px-3 py-1 scale-105"
            : "text-[#434656] hover:text-[#003ec7] w-16"
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{
            fontVariationSettings: currentScreen === "assistant" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          smart_toy
        </span>
        <span
          className={`text-xs mt-0.5 ${
            currentScreen === "assistant" ? "font-bold text-[#003ec7]" : "font-medium"
          }`}
        >
          Assistant
        </span>
      </button>
    </nav>
  );
};
