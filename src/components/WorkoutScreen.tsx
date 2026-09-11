import React, { useState } from "react";
import { Exercise, WorkoutDay, UserProfile } from "../types";
import { IMAGES } from "../data/mockData";
import { Play, Check, Sparkles, ChevronRight, Info, Plus } from "lucide-react";

interface WorkoutScreenProps {
  userProfile: UserProfile;
  workoutDays: WorkoutDay[];
  onStartWorkout: (workout: WorkoutDay) => void;
  onViewExercise: (exercise: Exercise) => void;
  onToggleWorkoutCompleted: (dayId: string) => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  userProfile,
  workoutDays,
  onStartWorkout,
  onViewExercise,
  onToggleWorkoutCompleted,
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>("mon");

  const selectedWorkout =
    workoutDays.find((w) => w.id === selectedDayId) || workoutDays[0];

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-10 max-w-6xl mx-auto min-h-screen text-[#131b2e] animate-fadeIn">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#131b2e]">
            Your Weekly Plan
          </h1>
          <p className="text-sm text-[#434656] mt-0.5">
            Phase 1: Hypertrophy & Recomposition • {userProfile.scheduleDays} Sessions / Week
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#f2f3ff] text-[#003ec7] border border-[#c3c5d9]/60 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">fitness_center</span>
            {userProfile.experience} Level
          </div>
        </div>
      </div>

      {/* Day Selector Pills Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {workoutDays.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-center transition-all cursor-pointer min-w-[90px] ${
                isSelected
                  ? "bg-[#003ec7] text-white border-[#003ec7] shadow-md scale-105"
                  : day.completed
                  ? "bg-[#eaedff] text-[#003ec7] border-[#c3c5d9]"
                  : "bg-white text-[#434656] border-[#c3c5d9] hover:border-[#003ec7]"
              }`}
            >
              <div className="text-[11px] font-bold tracking-wider opacity-80">
                {day.dayShort}
              </div>
              <div className="font-headline font-bold text-xs mt-0.5">
                {day.focus}
              </div>
              {day.completed && (
                <div className="mt-1 flex justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      isSelected ? "bg-white text-[#003ec7]" : "bg-[#003ec7] text-white"
                    }`}
                  >
                    ✓
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day Overview Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#c3c5d9]/60 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#eaedff] text-[#003ec7] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-sm">event</span>
              {selectedWorkout.dayShort} Focus
            </div>
            <h2 className="font-headline font-extrabold text-2xl text-[#131b2e]">
              {selectedWorkout.focus} Workout
            </h2>
            <p className="text-xs text-[#434656] mt-1 flex items-center gap-3">
              {selectedWorkout.isRest ? (
                <span>Active recovery & optimal nutrient absorption</span>
              ) : (
                <>
                  <span>⏱ {selectedWorkout.durationMinutes} mins</span>
                  <span>•</span>
                  <span>🔥 {selectedWorkout.caloriesBurned} kcal</span>
                  <span>•</span>
                  <span>⚡ {selectedWorkout.intensity}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!selectedWorkout.isRest && (
              <>
                <button
                  onClick={() => onToggleWorkoutCompleted(selectedWorkout.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedWorkout.completed
                      ? "bg-[#eaedff] text-[#003ec7] border-[#003ec7]"
                      : "bg-white text-[#434656] border-[#c3c5d9] hover:border-[#003ec7]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {selectedWorkout.completed ? "Completed" : "Mark as Done"}
                </button>

                <button
                  onClick={() => onStartWorkout(selectedWorkout)}
                  className="bg-[#c1f100] text-[#546b00] font-headline font-bold px-6 py-3 rounded-full hover:bg-[#c3f400] transition-all flex items-center gap-2 active:scale-95 shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exercises Section */}
      {selectedWorkout.isRest ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#c3c5d9]/60 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#c1f100]/30 text-[#546b00] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">self_improvement</span>
          </div>
          <h3 className="font-headline font-bold text-xl text-[#131b2e] mb-1">
            Rest & Recovery Day
          </h3>
          <p className="text-sm text-[#434656] max-w-md leading-relaxed">
            Muscles grow during recovery periods. Hydrate well, hit your protein goals, and get 7-8 hours of quality sleep.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg text-[#131b2e]">
              Exercises ({selectedWorkout.exercises.length})
            </h3>
            <span className="text-xs text-[#737688] font-medium">
              Click to view technique & muscle activation
            </span>
          </div>

          <div className="space-y-4">
            {selectedWorkout.exercises.map((exercise, idx) => (
              <div
                key={exercise.id}
                className="bg-white rounded-3xl p-5 border border-[#c3c5d9]/60 shadow-sm hover:border-[#003ec7]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Exercise Info & Image */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-[#c3c5d9]/40">
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-[#131b2e]/80 text-white font-headline font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                      0{exercise.orderNumber || idx + 1}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#003ec7] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
                        {exercise.level}
                      </span>
                      <span className="text-[11px] font-medium text-[#737688]">
                        • {exercise.equipment}
                      </span>
                    </div>

                    <h4 className="font-headline font-bold text-lg text-[#131b2e]">
                      {exercise.name}
                    </h4>

                    <p className="text-xs text-[#434656] mt-0.5 line-clamp-1 max-w-md">
                      {exercise.description}
                    </p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[#c3c5d9]/40">
                  <div className="flex items-center gap-4 text-center">
                    <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-[#737688] block">
                        Sets
                      </span>
                      <span className="font-headline font-bold text-sm text-[#131b2e]">
                        {exercise.sets}
                      </span>
                    </div>

                    <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-[#737688] block">
                        Reps
                      </span>
                      <span className="font-headline font-bold text-sm text-[#131b2e]">
                        {exercise.reps}
                      </span>
                    </div>

                    <div className="bg-[#f2f3ff] px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-[#737688] block">
                        Rest
                      </span>
                      <span className="font-headline font-bold text-sm text-[#003ec7]">
                        {exercise.rest}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewExercise(exercise)}
                    className="bg-[#003ec7] text-white hover:bg-[#0052ff] px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    View Exercise
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
