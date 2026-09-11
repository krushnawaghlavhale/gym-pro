import React from "react";
import { Exercise } from "../types";
import { X, CheckCircle2, Target, Dumbbell, Clock } from "lucide-react";

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#c3c5d9] shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#131b2e] flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Header */}
        <div className="relative h-56 w-full">
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="bg-[#003ec7] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {exercise.level}
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-[#131b2e] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {exercise.equipment}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          <h2 className="font-headline font-extrabold text-2xl text-[#131b2e] mb-2">
            {exercise.name}
          </h2>
          <p className="text-sm text-[#434656] leading-relaxed mb-6">
            {exercise.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#f2f3ff] p-3 rounded-2xl text-center border border-[#c3c5d9]/40">
              <span className="text-[11px] font-bold text-[#737688] uppercase block">
                Target Sets
              </span>
              <span className="font-headline font-bold text-lg text-[#003ec7]">
                {exercise.sets} Sets
              </span>
            </div>
            <div className="bg-[#f2f3ff] p-3 rounded-2xl text-center border border-[#c3c5d9]/40">
              <span className="text-[11px] font-bold text-[#737688] uppercase block">
                Reps
              </span>
              <span className="font-headline font-bold text-lg text-[#131b2e]">
                {exercise.reps}
              </span>
            </div>
            <div className="bg-[#f2f3ff] p-3 rounded-2xl text-center border border-[#c3c5d9]/40">
              <span className="text-[11px] font-bold text-[#737688] uppercase block">
                Rest Period
              </span>
              <span className="font-headline font-bold text-lg text-[#506600]">
                {exercise.rest}
              </span>
            </div>
          </div>

          {/* Target Muscles */}
          <div className="mb-6">
            <h4 className="font-headline font-bold text-sm text-[#131b2e] mb-2.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#003ec7]" />
              Targeted Muscles
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="bg-[#eaedff] text-[#003ec7] text-xs font-semibold px-3 py-1 rounded-full border border-[#c3c5d9]/50"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Technique Instructions */}
          <div className="mb-6">
            <h4 className="font-headline font-bold text-sm text-[#131b2e] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#506600]" />
              Form & Execution Cues
            </h4>
            <div className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-[#faf8ff] p-3 rounded-2xl border border-[#c3c5d9]/40"
                >
                  <span className="w-6 h-6 rounded-full bg-[#003ec7] text-white font-headline font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-[#434656] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full bg-[#003ec7] text-white font-headline font-bold py-3 rounded-full hover:bg-[#0052ff] transition-all cursor-pointer shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
