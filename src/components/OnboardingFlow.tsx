import React, { useState } from "react";
import { UserProfile } from "../types";
import { ArrowLeft, ArrowRight, Sparkles, Check, AlertCircle } from "lucide-react";

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({ ...initialProfile });

  const totalSteps = 6;
  const progressPercent = Math.round((step / totalSteps) * 100);

  // BMI Calculation helper
  const heightMeters = (profile.height || 170) / 100;
  const bmi = (profile.weight / (heightMeters * heightMeters)).toFixed(1);
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { text: "Underweight", color: "text-blue-600" };
    if (val < 25) return { text: "Normal weight", color: "text-green-600" };
    if (val < 30) return { text: "Overweight", color: "text-amber-600" };
    return { text: "Obese", color: "text-red-600" };
  };

  const bmiCategory = getBmiCategory(parseFloat(bmi));

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Calculate daily macro targets based on goal & weight
      let cal = 2000;
      let pro = Math.round(profile.weight * 1.6);
      let fat = Math.round(profile.weight * 0.8);

      if (profile.goal === "Weight Management") {
        cal = Math.round(profile.weight * 22);
        pro = Math.round(profile.weight * 1.8);
      } else if (profile.goal === "Muscle & Strength") {
        cal = Math.round(profile.weight * 28);
        pro = Math.round(profile.weight * 2.0);
      } else if (profile.goal === "Improve Endurance") {
        cal = Math.round(profile.weight * 26);
        pro = Math.round(profile.weight * 1.5);
      }

      const carbs = Math.max(100, Math.round((cal - pro * 4 - fat * 9) / 4));

      const updated: UserProfile = {
        ...profile,
        proteinTarget: pro,
        carbTarget: carbs,
        fatTarget: fat,
        calorieTarget: cal,
        onboardingCompleted: true,
      };

      onComplete(updated);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onCancel();
    }
  };

  const toggleLocation = (loc: string) => {
    const exists = profile.locations.includes(loc);
    setProfile({
      ...profile,
      locations: exists
        ? profile.locations.filter((l) => l !== loc)
        : [...profile.locations, loc],
    });
  };

  const toggleEquipment = (eq: string) => {
    const exists = profile.equipment.includes(eq);
    setProfile({
      ...profile,
      equipment: exists
        ? profile.equipment.filter((e) => e !== eq)
        : [...profile.equipment, eq],
    });
  };

  const toggleLimitation = (lim: string) => {
    const exists = profile.limitations.includes(lim);
    setProfile({
      ...profile,
      limitations: exists
        ? profile.limitations.filter((l) => l !== lim)
        : [...profile.limitations, lim],
    });
  };

  const toggleDietPref = (pref: string) => {
    const exists = profile.dietPreferences.includes(pref);
    setProfile({
      ...profile,
      dietPreferences: exists
        ? profile.dietPreferences.filter((p) => p !== pref)
        : [...profile.dietPreferences, pref],
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center py-6 px-4 md:px-8">
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-[#eaedff] text-[#003ec7] transition-colors cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#003ec7] text-2xl material-symbols-fill">
            fitness_center
          </span>
          <span className="font-headline font-bold text-xl text-[#003ec7]">FitAI</span>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-[#737688] font-medium hover:text-[#131b2e] px-2 py-1"
        >
          Cancel
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xl bg-white p-4 rounded-2xl border border-[#c3c5d9]/60 shadow-sm mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-[#434656] mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-[#003ec7] font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#eaedff] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#003ec7] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#c3c5d9]/60 shadow-sm p-6 sm:p-8 flex flex-col flex-grow mb-20">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] mb-1.5">
                Let's get to know you
              </h2>
              <p className="text-sm text-[#434656] leading-relaxed">
                We use this data to calibrate your baseline metabolic rate and tailor your workouts.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Alex"
                className="w-full px-4 py-3 rounded-xl border border-[#c3c5d9] focus:outline-none focus:ring-2 focus:ring-[#003ec7] text-[#131b2e] font-medium"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, age: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#c3c5d9] focus:outline-none focus:ring-2 focus:ring-[#003ec7] text-[#131b2e] font-medium"
                  min="12"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#eaedff]/60 p-1 rounded-xl border border-[#c3c5d9]/60">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: g })}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        profile.gender === g
                          ? "bg-[#003ec7] text-white shadow-sm"
                          : "text-[#434656] hover:text-[#003ec7]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profile.height || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, height: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#c3c5d9] focus:outline-none focus:ring-2 focus:ring-[#003ec7] text-[#131b2e] font-medium"
                  min="100"
                  max="250"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#c3c5d9] focus:outline-none focus:ring-2 focus:ring-[#003ec7] text-[#131b2e] font-medium"
                  min="30"
                  max="250"
                  step="0.5"
                />
              </div>
            </div>

            {/* BMI Card */}
            <div className="bg-[#f2f3ff] rounded-2xl p-4 border border-[#c3c5d9]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#003ec7]/10 text-[#003ec7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">speed</span>
                </div>
                <div>
                  <span className="text-xs text-[#434656] font-medium">Calculated BMI</span>
                  <div className="font-headline font-bold text-lg text-[#131b2e]">
                    {bmi}{" "}
                    <span className={`text-xs font-semibold ml-1.5 ${bmiCategory.color}`}>
                      • {bmiCategory.text}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[#737688] font-medium text-right max-w-[130px]">
                Normal range: 18.5 – 24.9
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Main Goal */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] mb-1.5">
                What's your main goal?
              </h2>
              <p className="text-sm text-[#434656] leading-relaxed">
                Select the primary objective you want to achieve with FitAI.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "Weight Management",
                  title: "Weight Management",
                  desc: "Burn fat, tone up, and optimize body composition",
                  icon: "local_fire_department",
                  color: "text-amber-600 bg-amber-50",
                },
                {
                  id: "Muscle & Strength",
                  title: "Muscle & Strength",
                  desc: "Build lean muscle mass and progressive strength",
                  icon: "fitness_center",
                  color: "text-[#003ec7] bg-[#eaedff]",
                },
                {
                  id: "Improve Endurance",
                  title: "Improve Endurance",
                  desc: "Boost cardiovascular fitness, stamina, and VO2 max",
                  icon: "directions_run",
                  color: "text-emerald-600 bg-emerald-50",
                },
                {
                  id: "Flexibility & Mobility",
                  title: "Flexibility & Mobility",
                  desc: "Enhance range of motion, recovery, and joint health",
                  icon: "self_improvement",
                  color: "text-purple-600 bg-purple-50",
                },
                {
                  id: "General Fitness",
                  title: "General Fitness",
                  desc: "Stay active, healthy, energized, and consistent daily",
                  icon: "favorite",
                  color: "text-rose-600 bg-rose-50",
                },
              ].map((g) => {
                const selected = profile.goal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setProfile({ ...profile, goal: g.id })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selected
                        ? "border-[#003ec7] bg-[#eaedff]/60 shadow-sm ring-1 ring-[#003ec7]"
                        : "border-[#c3c5d9]/80 hover:border-[#003ec7]/40 hover:bg-[#faf8ff]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${g.color}`}>
                        <span className="material-symbols-outlined text-2xl">{g.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-headline font-bold text-[#131b2e] text-base">
                          {g.title}
                        </h4>
                        <p className="text-xs text-[#434656] mt-0.5">{g.desc}</p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected
                          ? "border-[#003ec7] bg-[#003ec7] text-white"
                          : "border-[#c3c5d9]"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Commitment & Experience */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] mb-1.5">
                Commitment level
              </h2>
              <p className="text-sm text-[#434656] leading-relaxed">
                How experienced are you and how many days can you commit per week?
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Beginner", label: "Beginner", sub: "0 - 1 years" },
                  { id: "Intermediate", label: "Intermediate", sub: "1 - 3 years" },
                  { id: "Advanced", label: "Advanced", sub: "3+ years" },
                ].map((lvl) => {
                  const selected = profile.experience === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          experience: lvl.id as "Beginner" | "Intermediate" | "Advanced",
                        })
                      }
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        selected
                          ? "border-[#003ec7] bg-[#003ec7] text-white shadow-md"
                          : "border-[#c3c5d9] bg-white text-[#131b2e] hover:border-[#003ec7]/40"
                      }`}
                    >
                      <div className="font-headline font-bold text-sm">{lvl.label}</div>
                      <div
                        className={`text-[11px] mt-1 ${
                          selected ? "text-white/80" : "text-[#737688]"
                        }`}
                      >
                        {lvl.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
                Workout Days per Week
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((days) => {
                  const selected = profile.scheduleDays === days;
                  return (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setProfile({ ...profile, scheduleDays: days })}
                      className={`py-3.5 rounded-2xl border font-headline font-bold text-base transition-all ${
                        selected
                          ? "border-[#003ec7] bg-[#003ec7] text-white shadow-md scale-105"
                          : "border-[#c3c5d9] bg-white text-[#131b2e] hover:border-[#003ec7]"
                      }`}
                    >
                      {days}
                      <span className="block text-[10px] font-normal opacity-80">
                        {days === 2 ? "min" : "days"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 bg-[#f2f3ff] p-3.5 rounded-xl border border-[#c3c5d9]/60 flex items-start gap-2.5 text-xs text-[#434656]">
                <span className="material-symbols-outlined text-[#003ec7] text-lg flex-shrink-0">
                  info
                </span>
                <span>
                  <strong>Recommended:</strong> 4 days/week offers the optimal balance of muscle stimulation, cardio conditioning, and nervous system recovery.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Training Environment & Equipment */}
        {step === 4 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] mb-1.5">
                Where do you train?
              </h2>
              <p className="text-sm text-[#434656] leading-relaxed">
                Choose your primary environment and select the equipment at your disposal.
              </p>
            </div>

            {/* Environments */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
                Training Environment
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "home", title: "Home", icon: "home" },
                  { id: "gym", title: "Gym", icon: "fitness_center" },
                  { id: "outdoor", title: "Outdoor", icon: "park" },
                ].map((env) => {
                  const selected = profile.locations.includes(env.id);
                  return (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => toggleLocation(env.id)}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        selected
                          ? "border-[#003ec7] bg-[#eaedff] text-[#003ec7] font-bold shadow-sm ring-1 ring-[#003ec7]"
                          : "border-[#c3c5d9] bg-white text-[#434656] hover:border-[#003ec7]/40"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{env.icon}</span>
                      <span className="text-xs">{env.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Equipment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
                Available Equipment
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "No equipment",
                  "Dumbbells",
                  "Resistance bands",
                  "Machines",
                  "Barbell",
                  "Kettlebells",
                  "Pull-up bar",
                ].map((eq) => {
                  const selected = profile.equipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        selected
                          ? "border-[#003ec7] bg-[#003ec7] text-white shadow-sm"
                          : "border-[#c3c5d9] bg-white text-[#434656] hover:border-[#003ec7]"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Physical Limitations */}
        {step === 5 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] mb-1.5">
                Physical limitations
              </h2>
              <p className="text-sm text-[#434656] leading-relaxed">
                Help us keep your workouts safe by identifying any existing injuries or joint pain.
              </p>
            </div>

            {/* Toggle switch */}
            <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#c3c5d9]/60 flex items-center justify-between">
              <div>
                <h4 className="font-headline font-bold text-[#131b2e] text-sm">
                  I have physical limitations or injuries
                </h4>
                <p className="text-xs text-[#737688] mt-0.5">
                  AI will substitute aggravating movements automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setProfile({
                    ...profile,
                    hasLimitations: !profile.hasLimitations,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  profile.hasLimitations ? "bg-[#003ec7]" : "bg-[#c3c5d9]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    profile.hasLimitations ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {profile.hasLimitations && (
              <div className="space-y-3 animate-fadeIn">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#434656]">
                  Select Affected Areas
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {["Knee", "Shoulder", "Lower Back", "Wrist", "Hip", "Neck"].map((area) => {
                    const selected = profile.limitations.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleLimitation(area)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                          selected
                            ? "border-[#ba1a1a] bg-[#ffdad6]/40 text-[#93000a]"
                            : "border-[#c3c5d9] bg-white text-[#434656] hover:border-[#737688]"
                        }`}
                      >
                        <span>{area}</span>
                        {selected && <Check className="w-4 h-4 text-[#ba1a1a]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-[#ffdad2]/30 border border-[#ffdad2] p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#971f00] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#971f00] leading-relaxed">
                <strong>Medical Disclaimer:</strong> FitAI provides fitness and nutrition guidance for healthy individuals. If you have acute pain or chronic conditions, always seek clearance from your physician.
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Dietary Profile */}
        {step === 6 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e] mb-1.5">
                Dietary profile
              </h2>
              <p className="text-sm text-[#434656] leading-relaxed">
                Tell us about your eating habits so we can craft delicious, macro-balanced meal recommendations.
              </p>
            </div>

            {/* Base Diet */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
                Base Diet
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "Vegetarian", label: "Vegetarian", icon: "eco" },
                  { id: "Non-Vegetarian", label: "Non-Veg", icon: "restaurant" },
                  { id: "Vegan", label: "Vegan", icon: "psychiatry" },
                  { id: "Eggetarian", label: "Eggetarian", icon: "egg_alt" },
                ].map((d) => {
                  const selected = profile.diet === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          diet: d.id as any,
                        })
                      }
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selected
                          ? "border-[#003ec7] bg-[#003ec7] text-white shadow-md font-bold"
                          : "border-[#c3c5d9] bg-white text-[#434656] hover:border-[#003ec7]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{d.icon}</span>
                      <span className="text-xs">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-3">
                Diet Preferences & Style
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Indian",
                  "High-protein",
                  "Home-cooked",
                  "Budget-friendly",
                  "Low Carb",
                  "Keto",
                  "Meal Prep Friendly",
                ].map((pref) => {
                  const selected = profile.dietPreferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => toggleDietPref(pref)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        selected
                          ? "border-[#003ec7] bg-[#003ec7] text-white shadow-sm"
                          : "border-[#c3c5d9] bg-white text-[#434656] hover:border-[#003ec7]"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#434656] mb-2">
                Allergies or Dislikes (Optional)
              </label>
              <input
                type="text"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                placeholder="e.g. Peanuts, lactose, mushrooms"
                className="w-full px-4 py-3 rounded-xl border border-[#c3c5d9] focus:outline-none focus:ring-2 focus:ring-[#003ec7] text-[#131b2e] font-medium text-sm"
              />
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#c3c5d9]/40 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-bold text-[#434656] hover:text-[#003ec7] px-4 py-2.5 rounded-xl hover:bg-[#eaedff] transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className={`px-8 py-3.5 rounded-full font-headline font-bold text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md ${
              step === totalSteps
                ? "bg-[#c1f100] text-[#546b00] hover:bg-[#c3f400] text-base"
                : "bg-[#003ec7] text-white hover:bg-[#0052ff]"
            }`}
          >
            {step === totalSteps ? (
              <>
                <Sparkles className="w-4 h-4" />
                Generate My Plan
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
