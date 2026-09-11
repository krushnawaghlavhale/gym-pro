import React, { useEffect, useState } from "react";
import { UserProfile } from "../types";
import { Check, Sparkles, ArrowRight, Activity, ShieldCheck } from "lucide-react";

interface PlanGeneratingScreenProps {
  userProfile: UserProfile;
  onFinish: (recommendationData?: any) => void;
}

export const PlanGeneratingScreen: React.FC<PlanGeneratingScreenProps> = ({
  userProfile,
  onFinish,
}) => {
  const [stage, setStage] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [serverData, setServerData] = useState<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Call the server-side recommendation endpoint
    const fetchRecommendation = async () => {
      try {
        const response = await fetch("/api/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: userProfile.age,
            height: userProfile.height,
            weight: userProfile.weight,
            "fitness goal": userProfile.goal,
            "fitness level": userProfile.experience,
            "workout location": userProfile.locations,
            "available equipment": userProfile.equipment,
            "workout days": userProfile.scheduleDays,
            "diet preference": userProfile.diet,
            "food preferences": userProfile.dietPreferences,
            allergies: userProfile.allergies,
            "physical limitations": userProfile.limitations,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (isMounted && result.success && result.recommendation) {
            setServerData(result.recommendation);
          }
        }
      } catch (err) {
        console.warn("Recommendation endpoint notice:", err);
      }
    };

    fetchRecommendation();

    // Step sequence animations
    const t1 = setTimeout(() => {
      if (!isMounted) return;
      setCompletedSteps((prev) => [...prev, 1]);
      setStage(2);
    }, 600);

    const t2 = setTimeout(() => {
      if (!isMounted) return;
      setCompletedSteps((prev) => [...prev, 2]);
      setStage(3);
    }, 1200);

    const t3 = setTimeout(() => {
      if (!isMounted) return;
      setCompletedSteps((prev) => [...prev, 3]);
      setStage(4);
    }, 1800);

    const t4 = setTimeout(() => {
      if (!isMounted) return;
      setCompletedSteps((prev) => [...prev, 4]);
      setStage(5);
      setIsReady(true);
    }, 2400);

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [userProfile]);

  const handleProceed = () => {
    onFinish(serverData);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center p-6 text-[#131b2e]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#c3c5d9]/60 shadow-xl p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#003ec7]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c1f100]/20 rounded-full blur-2xl" />

        {/* Pulse Ring Animation Center */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#003ec7]/10 absolute pulse-ring-anim" />
          <div className="w-20 h-20 rounded-full bg-[#0052ff] text-white flex items-center justify-center shadow-lg relative z-10">
            <span className="material-symbols-outlined text-4xl animate-pulse">
              psychology
            </span>
          </div>
        </div>

        {/* Status Headings */}
        <h2 className="font-headline text-2xl font-extrabold text-[#131b2e] mb-1">
          {stage < 5 ? "Analyzing your profile..." : "Your Custom Plan is Ready!"}
        </h2>
        <p className="text-xs text-[#434656] max-w-xs mb-6">
          Calibrating progressive overload and server-validated macro distribution.
        </p>

        {/* Real-time Checklist */}
        <div className="w-full space-y-3 text-left mb-6">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c3c5d9]/50">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003ec7] text-lg">flag</span>
              <span className="text-xs text-[#434656]">Fitness Goal:</span>
              <span className="text-xs font-bold text-[#131b2e]">{userProfile.goal}</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes(1)
                  ? "bg-[#003ec7] text-white scale-100"
                  : "border-2 border-[#c3c5d9] scale-90"
              }`}
            >
              {completedSteps.includes(1) && <Check className="w-3 h-3" />}
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c3c5d9]/50">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003ec7] text-lg">trending_up</span>
              <span className="text-xs text-[#434656]">Experience Level:</span>
              <span className="text-xs font-bold text-[#131b2e]">
                {userProfile.experience}
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes(2)
                  ? "bg-[#003ec7] text-white scale-100"
                  : "border-2 border-[#c3c5d9] scale-90"
              }`}
            >
              {completedSteps.includes(2) && <Check className="w-3 h-3" />}
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c3c5d9]/50">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003ec7] text-lg">fitness_center</span>
              <span className="text-xs text-[#434656]">Workout Split:</span>
              <span className="text-xs font-bold text-[#131b2e]">
                {userProfile.scheduleDays} days/wk ({userProfile.locations[0] || "Gym"})
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes(3)
                  ? "bg-[#003ec7] text-white scale-100"
                  : "border-2 border-[#c3c5d9] scale-90"
              }`}
            >
              {completedSteps.includes(3) && <Check className="w-3 h-3" />}
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c3c5d9]/50">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003ec7] text-lg">restaurant</span>
              <span className="text-xs text-[#434656]">Food Preference:</span>
              <span className="text-xs font-bold text-[#131b2e] truncate max-w-[150px]">
                {userProfile.diet}
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes(4)
                  ? "bg-[#003ec7] text-white scale-100"
                  : "border-2 border-[#c3c5d9] scale-90"
              }`}
            >
              {completedSteps.includes(4) && <Check className="w-3 h-3" />}
            </div>
          </div>
        </div>

        {/* Server AI Rationale Snippet if loaded */}
        {serverData?.coachingRationale?.whyThisPlan && (
          <div className="w-full bg-[#eaedff]/60 border border-[#003ec7]/20 p-3 rounded-xl mb-6 text-left text-xs text-[#131b2e] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#003ec7] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px] line-clamp-3">
              {serverData.coachingRationale.whyThisPlan}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleProceed}
          className="w-full bg-[#003ec7] text-white font-headline font-bold py-3.5 rounded-full hover:bg-[#0052ff] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
        >
          <span>Open My Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
