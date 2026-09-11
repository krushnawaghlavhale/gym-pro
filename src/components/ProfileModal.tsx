import React from "react";
import { UserProfile } from "../types";
import { IMAGES } from "../data/mockData";
import { X, RefreshCw, User, Settings, Sparkles, LogOut, Check } from "lucide-react";

interface ProfileModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRetakeOnboarding: () => void;
  onUpdateGoal: (newGoal: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onRetakeOnboarding,
  onUpdateGoal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto border border-[#c3c5d9] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#eaedff] text-[#737688]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#003ec7] mb-3 shadow-md">
            <img
              src={IMAGES.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-headline font-bold text-xl text-[#131b2e]">
            {userProfile.name}
          </h3>
          <span className="text-xs text-[#737688] font-medium">
            {userProfile.age} yrs • {userProfile.gender} • {userProfile.weight} kg • {userProfile.height} cm
          </span>
          <span className="inline-block mt-2 bg-[#c1f100] text-[#546b00] text-xs font-bold px-3 py-1 rounded-full">
            {userProfile.goal}
          </span>
        </div>

        {/* Current Plan Parameters */}
        <div className="bg-[#f2f3ff] rounded-2xl p-4 border border-[#c3c5d9]/60 space-y-2.5 mb-6 text-xs">
          <div className="flex justify-between">
            <span className="text-[#737688]">Experience Level:</span>
            <span className="font-bold text-[#131b2e]">{userProfile.experience}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#737688]">Training Schedule:</span>
            <span className="font-bold text-[#131b2e]">
              {userProfile.scheduleDays} Days / Week
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#737688]">Diet Style:</span>
            <span className="font-bold text-[#131b2e]">{userProfile.diet}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#737688]">Daily Targets:</span>
            <span className="font-bold text-[#003ec7]">
              {userProfile.calorieTarget} kcal • {userProfile.proteinTarget}g pro
            </span>
          </div>
        </div>

        {/* Retake Onboarding / Regenerate Plan Action */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onRetakeOnboarding();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#eaedff] hover:bg-[#dde1ff] text-[#003ec7] font-headline font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Recalibrate / Retake Onboarding
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#003ec7] text-white font-headline font-bold text-xs hover:bg-[#0052ff] transition-all shadow-md cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
