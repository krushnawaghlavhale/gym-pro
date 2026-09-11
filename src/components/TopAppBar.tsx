import React from "react";
import { ScreenType, UserProfile, NotificationItem } from "../types";
import { IMAGES } from "../data/mockData";
import { Dumbbell, Bell, User, Sparkles } from "lucide-react";

interface TopAppBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  userProfile: UserProfile;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onStartOnboarding: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  onNavigate,
  userProfile,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  onStartOnboarding,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (currentScreen === "landing") {
    return (
      <header className="fixed top-0 w-full z-50 bg-[#faf8ff] border-b border-[#c3c5d9] flex justify-between items-center px-4 md:px-10 h-16 transition-colors">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate("landing")}
        >
          <div className="text-[#003ec7] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl material-symbols-fill text-[#003ec7]">
              fitness_center
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl text-[#003ec7] tracking-tight">
            FitAI
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <a
              className="text-[#434656] text-sm font-semibold hover:text-[#003ec7] transition-colors"
              href="#how-it-works"
            >
              How it Works
            </a>
            <a
              className="text-[#434656] text-sm font-semibold hover:text-[#003ec7] transition-colors"
              href="#features"
            >
              Features
            </a>
            <button
              onClick={() => onNavigate("home")}
              className="text-[#434656] text-sm font-semibold hover:text-[#003ec7] transition-colors"
            >
              Dashboard Demo
            </button>
          </nav>
          <button
            onClick={() => onNavigate("home")}
            className="bg-[#003ec7] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#0052ff] transition-all active:scale-95 duration-100 hidden sm:block shadow-sm"
          >
            Dashboard
          </button>
          <button
            onClick={onStartOnboarding}
            className="bg-[#c1f100] text-[#546b00] text-sm font-bold px-5 py-2 rounded-full hover:bg-[#c3f400] transition-all active:scale-95 duration-100 shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Get Started
          </button>
        </div>
      </header>
    );
  }

  if (currentScreen === "onboarding" || currentScreen === "analyzing") {
    // Suppressed or minimal for onboarding flow
    return null;
  }

  // App screens (home, workout, nutrition, progress, assistant)
  return (
    <header className="fixed top-0 w-full z-50 bg-[#faf8ff] border-b border-[#c3c5d9]/60 flex justify-between items-center px-4 md:px-10 h-16 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center gap-3">
        {/* Profile Avatar / Trigger Profile Modal */}
        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#c3c5d9] cursor-pointer hover:ring-2 hover:ring-[#003ec7]/30 transition-all active:scale-95 duration-100 flex-shrink-0"
          title="User Profile & Settings"
        >
          <img
            src={IMAGES.avatar}
            alt={userProfile.name}
            className="w-full h-full object-cover"
          />
        </button>

        {/* Brand Logo & Name */}
        <div
          className="flex items-center gap-1.5 cursor-pointer active:scale-95 duration-100"
          onClick={() => onNavigate("home")}
        >
          <span className="material-symbols-outlined text-[#003ec7] text-2xl material-symbols-fill hidden sm:inline-block">
            fitness_center
          </span>
          <span className="font-headline font-bold text-2xl text-[#003ec7] tracking-tight">
            FitAI
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-[#eaedff]/60 px-2 py-1 rounded-full border border-[#c3c5d9]/40">
        <button
          onClick={() => onNavigate("home")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentScreen === "home"
              ? "bg-[#003ec7] text-white shadow-sm"
              : "text-[#434656] hover:text-[#003ec7] hover:bg-[#eaedff]"
          }`}
        >
          <span className="material-symbols-outlined text-base">home</span>
          Home
        </button>
        <button
          onClick={() => onNavigate("workout")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentScreen === "workout"
              ? "bg-[#003ec7] text-white shadow-sm"
              : "text-[#434656] hover:text-[#003ec7] hover:bg-[#eaedff]"
          }`}
        >
          <span className="material-symbols-outlined text-base">fitness_center</span>
          Workout
        </button>
        <button
          onClick={() => onNavigate("nutrition")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentScreen === "nutrition"
              ? "bg-[#003ec7] text-white shadow-sm"
              : "text-[#434656] hover:text-[#003ec7] hover:bg-[#eaedff]"
          }`}
        >
          <span className="material-symbols-outlined text-base">restaurant</span>
          Nutrition
        </button>
        <button
          onClick={() => onNavigate("progress")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentScreen === "progress"
              ? "bg-[#003ec7] text-white shadow-sm"
              : "text-[#434656] hover:text-[#003ec7] hover:bg-[#eaedff]"
          }`}
        >
          <span className="material-symbols-outlined text-base">monitoring</span>
          Progress
        </button>
        <button
          onClick={() => onNavigate("assistant")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currentScreen === "assistant"
              ? "bg-[#003ec7] text-white shadow-sm"
              : "text-[#434656] hover:text-[#003ec7] hover:bg-[#eaedff]"
          }`}
        >
          <span className="material-symbols-outlined text-base">smart_toy</span>
          Assistant
        </button>
      </nav>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("landing")}
          className="text-xs text-[#434656] font-medium hover:text-[#003ec7] px-2.5 py-1 rounded-lg hover:bg-[#eaedff] transition-colors hidden sm:block"
        >
          Landing Page
        </button>
        <button
          onClick={onOpenNotifications}
          className="relative text-[#003ec7] hover:bg-[#eaedff] transition-colors p-2 rounded-full active:scale-95 duration-100 flex items-center justify-center"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </header>
  );
};
