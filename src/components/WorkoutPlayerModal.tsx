import React, { useState, useEffect } from "react";
import { WorkoutDay } from "../types";
import { X, Play, Pause, RotateCcw, CheckCircle, ChevronRight, Award, Flame } from "lucide-react";

interface WorkoutPlayerModalProps {
  workout: WorkoutDay | null;
  onClose: () => void;
  onFinishWorkout: (workoutId: string) => void;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  workout,
  onClose,
  onFinishWorkout,
}) => {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && !isFinished && workout) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, isFinished, workout]);

  if (!workout) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs
      .toString()
      .padStart(2, "0")}`;
  };

  const exercises = workout.exercises;
  const currentEx = exercises[currentExIndex] || exercises[0];

  const handleToggleSet = (exId: string, setNum: number) => {
    const current = completedSets[exId] || [];
    if (current.includes(setNum)) {
      setCompletedSets({
        ...completedSets,
        [exId]: current.filter((s) => s !== setNum),
      });
    } else {
      setCompletedSets({
        ...completedSets,
        [exId]: [...current, setNum],
      });
    }
  };

  const handleNextExercise = () => {
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleCompleteSession = () => {
    onFinishWorkout(workout.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#c3c5d9] shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#c3c5d9]/60 flex items-center justify-between sticky top-0 bg-white z-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#003ec7] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
              Live Workout Session
            </span>
            <h3 className="font-headline font-bold text-lg text-[#131b2e] mt-1">
              {workout.focus} Strength
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Display */}
            <div className="bg-[#131b2e] text-white px-3 py-1.5 rounded-xl font-headline font-bold text-sm flex items-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#c1f100] animate-pulse" />
              {formatTime(secondsElapsed)}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#eaedff] text-[#737688] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Finished State Celebration */}
        {isFinished ? (
          <div className="p-8 text-center flex flex-col items-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-[#c1f100] text-[#546b00] flex items-center justify-center mb-4 shadow-lg">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="font-headline font-extrabold text-2xl text-[#131b2e] mb-1">
              Workout Complete! 🔥
            </h2>
            <p className="text-sm text-[#434656] max-w-xs mb-6">
              Great job pushing through! Your session stats have been logged to your progress history.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              <div className="bg-[#f2f3ff] p-4 rounded-2xl border border-[#c3c5d9]/40">
                <span className="text-[11px] font-bold text-[#737688] uppercase block">
                  Total Time
                </span>
                <span className="font-headline font-bold text-xl text-[#003ec7]">
                  {formatTime(secondsElapsed)}
                </span>
              </div>
              <div className="bg-[#f2f3ff] p-4 rounded-2xl border border-[#c3c5d9]/40">
                <span className="text-[11px] font-bold text-[#737688] uppercase block">
                  Est. Calories
                </span>
                <span className="font-headline font-bold text-xl text-[#506600]">
                  ~{workout.caloriesBurned} kcal
                </span>
              </div>
            </div>

            <button
              onClick={handleCompleteSession}
              className="w-full bg-[#003ec7] text-white font-headline font-bold py-3.5 rounded-full hover:bg-[#0052ff] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Save & Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6 flex-grow flex flex-col justify-between">
            {/* Active Exercise Display */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#737688] font-bold mb-2">
                <span>
                  EXERCISE {currentExIndex + 1} OF {exercises.length}
                </span>
                <span className="text-[#003ec7]">
                  {currentEx?.equipment}
                </span>
              </div>

              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 border border-[#c3c5d9]/60">
                <img
                  src={currentEx?.imageUrl}
                  alt={currentEx?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h4 className="font-headline font-bold text-xl">
                    {currentEx?.name}
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    Target: {currentEx?.sets} Sets × {currentEx?.reps} Reps (Rest: {currentEx?.rest})
                  </p>
                </div>
              </div>

              {/* Set Checkboxes */}
              <div className="space-y-2.5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#434656] block">
                  Log Your Sets:
                </span>
                {Array.from({ length: currentEx?.sets || 3 }).map((_, i) => {
                  const setNum = i + 1;
                  const isDone = (completedSets[currentEx.id] || []).includes(setNum);
                  return (
                    <div
                      key={setNum}
                      onClick={() => handleToggleSet(currentEx.id, setNum)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        isDone
                          ? "bg-[#eaedff] border-[#003ec7] text-[#003ec7]"
                          : "bg-[#faf8ff] border-[#c3c5d9] text-[#131b2e] hover:border-[#003ec7]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white border border-[#c3c5d9] text-xs font-bold flex items-center justify-center">
                          {setNum}
                        </span>
                        <span className="font-headline font-bold text-sm">
                          Set {setNum}: {currentEx.reps} Reps
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isDone
                            ? "bg-[#003ec7] border-[#003ec7] text-white"
                            : "border-[#c3c5d9]"
                        }`}
                      >
                        {isDone && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-[#c3c5d9]/60 flex items-center justify-between gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-3 rounded-2xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Resume
                  </>
                )}
              </button>

              <button
                onClick={handleNextExercise}
                className="flex-grow bg-[#003ec7] text-white font-headline font-bold py-3.5 rounded-full hover:bg-[#0052ff] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                {currentExIndex < exercises.length - 1 ? (
                  <>
                    Next Exercise <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Finish Workout <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
