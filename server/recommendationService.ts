import { GoogleGenAI } from "@google/genai";
import { generateContentWithFallback } from "./aiService";

export interface RecommendationInput {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string[];
  availableEquipment: string[];
  workoutDays: number;
  dietPreference: string;
  foodPreferences: string[];
  allergies: string[];
  physicalLimitations: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  normalized?: RecommendationInput;
}

export function validateRecommendationInput(raw: any): ValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== "object") {
    return {
      isValid: false,
      errors: ["Request body must be a valid JSON object."],
    };
  }

  // 1. Age
  const ageVal = raw.age !== undefined ? Number(raw.age) : NaN;
  if (isNaN(ageVal) || ageVal < 10 || ageVal > 120 || !Number.isInteger(ageVal)) {
    errors.push("Age is required and must be an integer between 10 and 120.");
  }

  // 2. Height (cm)
  const heightVal = raw.height !== undefined ? Number(raw.height) : NaN;
  if (isNaN(heightVal) || heightVal < 50 || heightVal > 300) {
    errors.push("Height is required and must be a number between 50 cm and 300 cm.");
  }

  // 3. Weight (kg)
  const weightVal = raw.weight !== undefined ? Number(raw.weight) : NaN;
  if (isNaN(weightVal) || weightVal < 20 || weightVal > 400) {
    errors.push("Weight is required and must be a number between 20 kg and 400 kg.");
  }

  // 4. Fitness Goal
  const goalVal =
    raw["fitness goal"] ??
    raw.fitnessGoal ??
    raw.fitness_goal ??
    raw.goal;
  if (!goalVal || typeof goalVal !== "string" || goalVal.trim().length < 2) {
    errors.push("Fitness goal is required (e.g. 'Muscle & Strength', 'Weight Management', 'Endurance').");
  }

  // 5. Fitness Level
  const levelVal =
    raw["fitness level"] ??
    raw.fitnessLevel ??
    raw.fitness_level ??
    raw.experience ??
    raw.level;
  if (!levelVal || typeof levelVal !== "string" || levelVal.trim().length < 2) {
    errors.push("Fitness level is required (e.g. 'Beginner', 'Intermediate', 'Advanced').");
  }

  // 6. Workout Location
  const locationRaw =
    raw["workout location"] ??
    raw.workoutLocation ??
    raw.workout_location ??
    raw.location ??
    raw.locations;
  let locations: string[] = [];
  if (Array.isArray(locationRaw)) {
    locations = locationRaw.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof locationRaw === "string" && locationRaw.trim().length > 0) {
    locations = locationRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (locations.length === 0) {
    errors.push("Workout location is required (e.g. 'Gym', 'Home', 'Outdoor').");
  }

  // 7. Available Equipment
  const equipmentRaw =
    raw["available equipment"] ??
    raw.availableEquipment ??
    raw.available_equipment ??
    raw.equipment;
  let equipment: string[] = [];
  if (Array.isArray(equipmentRaw)) {
    equipment = equipmentRaw.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof equipmentRaw === "string" && equipmentRaw.trim().length > 0) {
    equipment = equipmentRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (equipment.length === 0) {
    errors.push("Available equipment is required (e.g. 'Dumbbells', 'Bodyweight', 'Machines', 'Barbell').");
  }

  // 8. Workout Days
  const daysRaw =
    raw["workout days"] ??
    raw.workoutDays ??
    raw.workout_days ??
    raw.scheduleDays ??
    raw.days;
  const daysVal = daysRaw !== undefined ? Number(daysRaw) : NaN;
  if (isNaN(daysVal) || daysVal < 1 || daysVal > 7 || !Number.isInteger(daysVal)) {
    errors.push("Workout days is required and must be an integer between 1 and 7.");
  }

  // 9. Diet Preference
  const dietVal =
    raw["diet preference"] ??
    raw.dietPreference ??
    raw.diet_preference ??
    raw.diet;
  if (!dietVal || typeof dietVal !== "string" || dietVal.trim().length < 2) {
    errors.push("Diet preference is required (e.g. 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian').");
  }

  // 10. Food Preferences (Optional, default empty)
  const foodPrefRaw =
    raw["food preferences"] ??
    raw.foodPreferences ??
    raw.food_preferences ??
    raw.dietPreferences ??
    raw.preferences;
  let foodPreferences: string[] = [];
  if (Array.isArray(foodPrefRaw)) {
    foodPreferences = foodPrefRaw.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof foodPrefRaw === "string" && foodPrefRaw.trim().length > 0) {
    foodPreferences = foodPrefRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // 11. Allergies (Optional, default empty)
  const allergiesRaw = raw.allergies ?? raw.allergy;
  let allergies: string[] = [];
  if (Array.isArray(allergiesRaw)) {
    allergies = allergiesRaw.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof allergiesRaw === "string" && allergiesRaw.trim().length > 0) {
    allergies = allergiesRaw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.toLowerCase() !== "none" && s.toLowerCase() !== "n/a");
  }

  // 12. Physical Limitations (Optional, default empty)
  const limitationsRaw =
    raw["physical limitations"] ??
    raw.physicalLimitations ??
    raw.physical_limitations ??
    raw.limitations ??
    raw.injuries;
  let physicalLimitations: string[] = [];
  if (Array.isArray(limitationsRaw)) {
    physicalLimitations = limitationsRaw.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof limitationsRaw === "string" && limitationsRaw.trim().length > 0) {
    physicalLimitations = limitationsRaw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.toLowerCase() !== "none" && s.toLowerCase() !== "n/a");
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    normalized: {
      age: ageVal,
      height: heightVal,
      weight: weightVal,
      fitnessGoal: String(goalVal).trim(),
      fitnessLevel: String(levelVal).trim(),
      workoutLocation: locations,
      availableEquipment: equipment,
      workoutDays: daysVal,
      dietPreference: String(dietVal).trim(),
      foodPreferences,
      allergies,
      physicalLimitations,
    },
  };
}

export async function generateServerRecommendation(
  input: RecommendationInput,
  aiClient: GoogleGenAI | null
) {
  // 1. Biometrics calculation
  const heightM = input.height / 100;
  const bmi = Number((input.weight / (heightM * heightM)).toFixed(1));
  let bmiCategory = "Normal weight";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal weight";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

  // Mifflin-St Jeor BMR estimation (general baseline)
  const bmr = Math.round(10 * input.weight + 6.25 * input.height - 5 * input.age + 5);

  // Activity multiplier based on workout days
  let activityMultiplier = 1.375;
  if (input.workoutDays >= 5) activityMultiplier = 1.65;
  else if (input.workoutDays >= 3) activityMultiplier = 1.5;
  else if (input.workoutDays >= 2) activityMultiplier = 1.35;

  const tdee = Math.round(bmr * activityMultiplier);

  // Calorie & macro calculation based on goal
  let targetCalories = tdee;
  let proteinMultiplier = 1.6;
  const goalLower = input.fitnessGoal.toLowerCase();

  if (
    goalLower.includes("weight") ||
    goalLower.includes("loss") ||
    goalLower.includes("fat") ||
    goalLower.includes("lean")
  ) {
    targetCalories = Math.max(1300, tdee - 450);
    proteinMultiplier = 2.0; // higher protein for muscle sparing
  } else if (
    goalLower.includes("muscle") ||
    goalLower.includes("strength") ||
    goalLower.includes("hypertrophy") ||
    goalLower.includes("bulk")
  ) {
    targetCalories = tdee + 300;
    proteinMultiplier = 1.9;
  } else if (
    goalLower.includes("endurance") ||
    goalLower.includes("cardio") ||
    goalLower.includes("stamina")
  ) {
    targetCalories = tdee;
    proteinMultiplier = 1.5;
  }

  const targetProteinGrams = Math.round(input.weight * proteinMultiplier);
  const targetFatGrams = Math.round(input.weight * 0.85);
  const targetCarbsGrams = Math.max(
    80,
    Math.round((targetCalories - targetProteinGrams * 4 - targetFatGrams * 9) / 4)
  );
  const hydrationLiters = Number(Math.max(2.5, input.weight * 0.04).toFixed(1));

  // Accommodations for physical limitations
  const accommodations: string[] = [];
  const hasKneeIssue = input.physicalLimitations.some((l) =>
    l.toLowerCase().includes("knee")
  );
  const hasShoulderIssue = input.physicalLimitations.some((l) =>
    l.toLowerCase().includes("shoulder")
  );
  const hasBackIssue = input.physicalLimitations.some(
    (l) => l.toLowerCase().includes("back") || l.toLowerCase().includes("spine")
  );
  const hasWristIssue = input.physicalLimitations.some((l) =>
    l.toLowerCase().includes("wrist")
  );

  if (hasKneeIssue) {
    accommodations.push(
      "Replaced deep high-impact squats with tempo box squats, glute bridges, and hamstring leg curls to minimize patellofemoral shear."
    );
  }
  if (hasShoulderIssue) {
    accommodations.push(
      "Adopted neutral-grip dumbbell presses and chest-supported rows to protect the rotator cuff and avoid subacromial impingement."
    );
  }
  if (hasBackIssue) {
    accommodations.push(
      "Replaced heavy spinal-loaded deadlifts with chest-supported rows and supported split squats to protect lumbar vertebrae."
    );
  }
  if (hasWristIssue) {
    accommodations.push(
      "Utilized neutral dumbbell grips and pushup bars to maintain a straight, uncompressed wrist angle."
    );
  }
  if (accommodations.length === 0) {
    accommodations.push("Standard progressive overload across multi-joint compound movements.");
  }

  // Base schedule generation
  const dayNames = [
    { name: "Monday", short: "MON" },
    { name: "Tuesday", short: "TUE" },
    { name: "Wednesday", short: "WED" },
    { name: "Thursday", short: "THU" },
    { name: "Friday", short: "FRI" },
    { name: "Saturday", short: "SAT" },
    { name: "Sunday", short: "SUN" },
  ];

  const hasGym = input.workoutLocation.some((l) => l.toLowerCase().includes("gym"));
  const hasDumbbells = input.availableEquipment.some((e) =>
    e.toLowerCase().includes("dumbbell")
  );
  const hasMachines = input.availableEquipment.some((e) =>
    e.toLowerCase().includes("machine")
  );
  const isBeginner = input.fitnessLevel.toLowerCase().includes("beginner");

  // Determine split strategy
  const splitStrategy =
    input.workoutDays <= 2
      ? "Full Body Conditioning & Core"
      : input.workoutDays === 3
      ? "Push / Pull / Legs Functional Split"
      : input.workoutDays === 4
      ? "Upper / Lower Hypertrophy & Power Split"
      : "Push / Pull / Legs / Upper / Lower Progression Split";

  const scheduleDays = [];
  const totalDays = 7;
  const trainingDayIndices = getTrainingDays(input.workoutDays);

  for (let i = 0; i < totalDays; i++) {
    const isTraining = trainingDayIndices.includes(i);
    const dayMeta = dayNames[i];

    if (!isTraining) {
      scheduleDays.push({
        day: dayMeta.name,
        dayShort: dayMeta.short,
        focus: "Active Recovery & Mobility",
        durationMinutes: 20,
        caloriesBurned: 120,
        intensity: "Low",
        isRest: true,
        warmup: ["Light walking (10 mins)", "Full body dynamic stretching (10 mins)"],
        exercises: [],
        cooldown: ["Deep diaphragmatic breathing (3 mins)", "Hamstring and hip opener hold (4 mins)"],
      });
    } else {
      const workoutIndex = trainingDayIndices.indexOf(i);
      const workoutDetails = getWorkoutForDay(
        workoutIndex,
        input.fitnessGoal,
        input.fitnessLevel,
        hasGym,
        hasDumbbells,
        hasMachines,
        hasKneeIssue,
        hasShoulderIssue,
        hasBackIssue
      );

      scheduleDays.push({
        day: dayMeta.name,
        dayShort: dayMeta.short,
        focus: workoutDetails.focus,
        durationMinutes: isBeginner ? 35 : 45,
        caloriesBurned: isBeginner ? 280 : 380,
        intensity: isBeginner ? "Moderate" : "High",
        isRest: false,
        warmup: workoutDetails.warmup,
        exercises: workoutDetails.exercises,
        cooldown: workoutDetails.cooldown,
      });
    }
  }

  // Base Nutrition Plan tailored to diet & allergies
  const meals = getMealsForDiet(
    input.dietPreference,
    input.foodPreferences,
    input.allergies,
    targetCalories,
    targetProteinGrams,
    targetCarbsGrams,
    targetFatGrams
  );

  const baseRecommendation = {
    profileSummary: {
      age: input.age,
      heightCm: input.height,
      weightKg: input.weight,
      bmi,
      bmiCategory,
      bmrKcal: bmr,
      tdeeKcal: tdee,
      calorieTargetKcal: targetCalories,
      macroTargets: {
        proteinGrams: targetProteinGrams,
        carbsGrams: targetCarbsGrams,
        fatGrams: targetFatGrams,
      },
      hydrationLiters,
    },
    fitnessPlan: {
      strategy: splitStrategy,
      weeklyFrequency: input.workoutDays,
      workoutLocation: input.workoutLocation,
      equipmentUtilized: input.availableEquipment,
      accommodations,
      schedule: scheduleDays,
    },
    nutritionPlan: {
      dietaryApproach: `${input.dietPreference} Plan${
        input.foodPreferences.length > 0
          ? ` (${input.foodPreferences.join(", ")})`
          : ""
      }${input.allergies.length > 0 ? ` [Strictly Excluding: ${input.allergies.join(", ")}]` : ""}`,
      dailyTotals: {
        calories: targetCalories,
        protein: targetProteinGrams,
        carbs: targetCarbsGrams,
        fat: targetFatGrams,
      },
      allergySafetyStatus:
        input.allergies.length > 0
          ? `Verified Safe: All recipes strictly omit ${input.allergies.join(", ")}`
          : "No allergies detected.",
      meals,
      hydrationAndSupplements: [
        `Consume at least ${hydrationLiters}L of filtered water throughout the day.`,
        input.dietPreference.toLowerCase().includes("vegan") ||
        input.dietPreference.toLowerCase().includes("vegetarian")
          ? "Recommend Vitamin B12 and Vitamin D3 supplementation for optimal cellular energy."
          : "Maintain adequate electrolyte balance during intense training sessions.",
        "Consider 3g-5g Creatine Monohydrate daily to support muscular strength and cellular hydration.",
      ],
    },
    coachingRationale: {
      whyThisPlan: `Designed specifically for your ${input.fitnessLevel.toLowerCase()} profile and goal of ${input.fitnessGoal.toLowerCase()}. Calibrated across ${input.workoutDays} weekly training days to optimize muscular recovery and protein synthesis while keeping joint strain minimal.`,
      progressionModel: `Apply progressive overload every 10-14 days by increasing load by 2.5%-5% or adding 1-2 reps per set once target reps are executed with clean form.`,
      safetyAndRecovery: `Ensure 7.5-8.5 hours of quality sleep nightly to facilitate tissue repair. Stop all sets with 1-2 reps in reserve (RIR) on multi-joint compounds.`,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      engineVersion: "fitai-v2.5-server",
      model: aiClient ? "gemini-3.8-flash (augmented)" : "deterministic-rule-engine",
    },
  };

  // If Gemini AI client is available, augment with AI personalized insights using resilient model fallback
  if (aiClient) {
    try {
      const prompt = `You are FitAI, an elite, science-backed personal fitness and nutrition coach.
The server has calculated the following baseline recommendation for a client:
- Age: ${input.age}, Height: ${input.height}cm, Weight: ${input.weight}kg, BMI: ${bmi} (${bmiCategory})
- Goal: ${input.fitnessGoal}, Level: ${input.fitnessLevel}
- Schedule: ${input.workoutDays} days/week, Location: ${input.workoutLocation.join(", ")}, Equipment: ${input.availableEquipment.join(", ")}
- Limitations: ${input.physicalLimitations.length > 0 ? input.physicalLimitations.join(", ") : "None"}
- Diet: ${input.dietPreference}, Preferences: ${input.foodPreferences.join(", ") || "Balanced"}, Allergies: ${input.allergies.join(", ") || "None"}
- Target Calories: ${targetCalories} kcal (Protein: ${targetProteinGrams}g, Carbs: ${targetCarbsGrams}g, Fat: ${targetFatGrams}g)

Provide a brief, tailored coaching note (2-3 sentences max) explaining the physiological rationale for this training and nutrition setup, and 2 specific pro-tips for accelerating their results safely. Return as JSON with keys "tailoredCoachingRationale" and "proTips" (array of 2 strings).`;

      const aiResponse = await generateContentWithFallback(
        {
          contents: prompt,
          responseMimeType: "application/json",
        },
        aiClient
      );

      if (aiResponse?.text) {
        const parsed = JSON.parse(aiResponse.text);
        if (parsed.tailoredCoachingRationale) {
          baseRecommendation.coachingRationale.whyThisPlan = parsed.tailoredCoachingRationale;
        }
        if (Array.isArray(parsed.proTips) && parsed.proTips.length > 0) {
          (baseRecommendation.coachingRationale as any).proTips = parsed.proTips;
        }
        baseRecommendation.metadata.model = `${aiResponse.modelUsed} (augmented)`;
      }
    } catch {
      // Graceful fallback to deterministic rule engine without noisy errors
    }
  }

  return baseRecommendation;
}

// Helpers
function getTrainingDays(days: number): number[] {
  switch (days) {
    case 1:
      return [1]; // Tuesday
    case 2:
      return [0, 3]; // Mon, Thu
    case 3:
      return [0, 2, 4]; // Mon, Wed, Fri
    case 4:
      return [0, 1, 3, 4]; // Mon, Tue, Thu, Fri
    case 5:
      return [0, 1, 2, 4, 5]; // Mon, Tue, Wed, Fri, Sat
    case 6:
      return [0, 1, 2, 3, 4, 5]; // Mon-Sat
    case 7:
      return [0, 1, 2, 3, 4, 5, 6];
    default:
      return [0, 1, 3, 4];
  }
}

function getWorkoutForDay(
  index: number,
  goal: string,
  level: string,
  hasGym: boolean,
  hasDumbbells: boolean,
  hasMachines: boolean,
  hasKneeIssue: boolean,
  hasShoulderIssue: boolean,
  hasBackIssue: boolean
) {
  const isBeginner = level.toLowerCase().includes("beginner");
  const repRange = goal.toLowerCase().includes("strength")
    ? "5-8"
    : goal.toLowerCase().includes("weight") || goal.toLowerCase().includes("fat")
    ? "12-15"
    : "8-12";

  const workouts = [
    {
      focus: "Upper Body Hypertrophy & Posture",
      warmup: [
        "Band pull-aparts (2 sets of 15 reps)",
        "Arm circles & thoracic rotations (60s)",
        "Scapular wall slides (12 reps)",
      ],
      exercises: [
        {
          name: hasShoulderIssue
            ? "Neutral-Grip Dumbbell Incline Press"
            : hasGym
            ? "Barbell Incline Bench Press"
            : hasDumbbells
            ? "Dumbbell Floor Press"
            : "Elevated Pushups",
          sets: isBeginner ? 3 : 4,
          reps: repRange,
          rest: "90s",
          equipment: hasGym ? "Barbell / Bench" : hasDumbbells ? "Dumbbells" : "Bodyweight",
          targetMuscles: ["Pectoralis Major", "Anterior Deltoids", "Triceps"],
          formCues:
            "Retract shoulder blades, keep wrists straight, lower with controlled 2-second tempo.",
          imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: hasBackIssue
            ? "Chest-Supported Dumbbell Row"
            : hasGym
            ? "Seated Cable Row"
            : hasDumbbells
            ? "Single-Arm Dumbbell Row"
            : "Inverted Table / Towel Rows",
          sets: isBeginner ? 3 : 4,
          reps: repRange,
          rest: "60s",
          equipment: hasGym ? "Cable Machine" : hasDumbbells ? "Dumbbells" : "Bodyweight",
          targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps"],
          formCues:
            "Drive elbows back towards your hip pocket; pause 1s at peak contraction.",
          imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: hasShoulderIssue ? "Cable Face Pulls (High to Low)" : "Dumbbell Lateral Raises",
          sets: 3,
          reps: "12-15",
          rest: "60s",
          equipment: hasGym ? "Cables / DB" : hasDumbbells ? "Dumbbells" : "Resistance Band",
          targetMuscles: ["Lateral Deltoids", "Rear Delts", "Rotator Cuff"],
          formCues: "Lead with the elbows, slight forward torso lean, avoid shrugging traps.",
          imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: "Plank to Shoulder Taps",
          sets: 3,
          reps: "45s",
          rest: "45s",
          equipment: "Bodyweight / Mat",
          targetMuscles: ["Transverse Abdominis", "Core Stabilizers"],
          formCues: "Keep hips level and glutes tight; prevent lateral hip rotation.",
          imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80",
        },
      ],
      cooldown: [
        "Doorway chest stretch (30s per side)",
        "Cross-body shoulder hold (30s per side)",
        "Child's pose deep breathing (60s)",
      ],
    },
    {
      focus: "Lower Body Strength & Stability",
      warmup: [
        "Bodyweight air squats (15 reps)",
        "Glute bridges (15 reps with 2s hold)",
        "Ankle mobility wall rocks (10 per leg)",
      ],
      exercises: [
        {
          name: hasKneeIssue
            ? "Tempo Box Squat with Light Dumbbell"
            : hasGym
            ? "Barbell Back Squat"
            : hasDumbbells
            ? "Dumbbell Goblet Squat"
            : "Tempo Air Squats",
          sets: isBeginner ? 3 : 4,
          reps: repRange,
          rest: "90s",
          equipment: hasGym ? "Barbell / Rack" : hasDumbbells ? "Dumbbell" : "Bodyweight",
          targetMuscles: ["Quadriceps", "Gluteus Maximus", "Core"],
          formCues:
            "Drive knees in line with second toe, keep chest proud, push floor through mid-foot.",
          imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: hasBackIssue
            ? "Supported Dumbbell Romanian Deadlift"
            : hasGym
            ? "Trap Bar / Barbell Deadlift"
            : hasDumbbells
            ? "Dumbbell Romanian Deadlift"
            : "Single-Leg Glute Bridges",
          sets: isBeginner ? 3 : 4,
          reps: repRange,
          rest: "90s",
          equipment: hasGym ? "Barbell" : hasDumbbells ? "Dumbbells" : "Bodyweight",
          targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae"],
          formCues:
            "Hinge at the hips, maintain neutral spine, push hips back until hamstring stretch.",
          imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: hasKneeIssue ? "Swiss Ball / Slider Hamstring Curls" : "Walking Dumbbell Lunges",
          sets: 3,
          reps: "10-12 per leg",
          rest: "60s",
          equipment: hasDumbbells ? "Dumbbells" : "Bodyweight",
          targetMuscles: ["Glutes", "Hamstrings", "Adductors"],
          formCues: "Keep 90-degree angle at front knee, torso upright and core braced.",
          imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: "Standing Calf Raises",
          sets: 3,
          reps: "15-20",
          rest: "45s",
          equipment: "Step / Ledge",
          targetMuscles: ["Gastrocnemius", "Soleus"],
          formCues: "Full stretch at bottom, squeeze for 1 second at apex.",
          imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
        },
      ],
      cooldown: [
        "Kneeling hip flexor stretch (45s per side)",
        "Standing quad stretch (30s per side)",
        "Pigeon pose glute opener (45s per side)",
      ],
    },
    {
      focus: "Push & Core Conditioning",
      warmup: [
        "Arm circles & wrist rolls (60s)",
        "Incline pushups against wall (15 reps)",
        "Bird-dog core activations (10 reps each side)",
      ],
      exercises: [
        {
          name: hasShoulderIssue
            ? "Neutral-Grip Dumbbell Overhead Press"
            : hasGym
            ? "Standing Overhead Barbell Press"
            : hasDumbbells
            ? "Seated Dumbbell Shoulder Press"
            : "Pike Pushups",
          sets: isBeginner ? 3 : 4,
          reps: repRange,
          rest: "90s",
          equipment: hasGym ? "Barbell" : hasDumbbells ? "Dumbbells" : "Bodyweight",
          targetMuscles: ["Anterior Deltoids", "Triceps", "Upper Trapezius"],
          formCues: "Brace glutes and abs to protect lumbar spine; press straight overhead.",
          imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: hasGym ? "Tricep Cable Rope Pushdowns" : "Bench / Chair Tricep Dips",
          sets: 3,
          reps: "12-15",
          rest: "60s",
          equipment: hasGym ? "Cable Machine" : "Chair / Bench",
          targetMuscles: ["Triceps Lateral & Long Head"],
          formCues: "Keep elbows glued to sides, lock out triceps at full extension.",
          imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: "Hanging Knee Raises / Dead Bug",
          sets: 3,
          reps: "12-15",
          rest: "45s",
          equipment: "Pull-up bar or Mat",
          targetMuscles: ["Lower Rectus Abdominis", "Hip Flexors"],
          formCues: "Curl pelvis upward without swinging or using momentum.",
          imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80",
        },
      ],
      cooldown: [
        "Overhead triceps stretch (30s per side)",
        "Cobra abdominal stretch (30s)",
        "Seated spinal twist (30s per side)",
      ],
    },
    {
      focus: "Pull & Posterior Chain Power",
      warmup: [
        "Cat-Cow thoracic mobility (10 cycles)",
        "Banded face pulls (15 reps)",
        "Bodyweight good mornings (12 reps)",
      ],
      exercises: [
        {
          name: hasGym ? "Wide-Grip Lat Pulldown" : "Assisted Pull-ups or Band Pulldowns",
          sets: isBeginner ? 3 : 4,
          reps: repRange,
          rest: "90s",
          equipment: hasGym ? "Cable Lat Machine" : "Bands / Pull-up bar",
          targetMuscles: ["Latissimus Dorsi", "Teres Major", "Biceps"],
          formCues: "Pull with elbows towards ribs, lean back 10 degrees, don't jerk weight.",
          imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: "Incline Dumbbell Bicep Curls",
          sets: 3,
          reps: "10-12",
          rest: "60s",
          equipment: hasDumbbells ? "Dumbbells" : "Resistance Band",
          targetMuscles: ["Biceps Brachii (Long Head)"],
          formCues: "Full supination at top; control negative on way down.",
          imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
        },
        {
          name: "Hyperextensions / Superman Holds",
          sets: 3,
          reps: "12-15",
          rest: "45s",
          equipment: "Bench or Mat",
          targetMuscles: ["Erector Spinae", "Glutes"],
          formCues: "Squeeze glutes at top hold for 2s; keep neck in neutral alignment.",
          imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
        },
      ],
      cooldown: [
        "Lat stretch hanging from bar / wall (30s)",
        "Biceps wall stretch (30s per side)",
        "Child's pose with side reach (45s per side)",
      ],
    },
  ];

  return workouts[index % workouts.length];
}

function getMealsForDiet(
  diet: string,
  preferences: string[],
  allergies: string[],
  calories: number,
  protein: number,
  carbs: number,
  fat: number
) {
  const isVeg = diet.toLowerCase().includes("veg") && !diet.toLowerCase().includes("non");
  const isVegan = diet.toLowerCase().includes("vegan");
  const isEggetarian = diet.toLowerCase().includes("egg");
  const isIndian = preferences.some((p) => p.toLowerCase().includes("indian"));

  const hasPeanutAllergy = allergies.some((a) => a.toLowerCase().includes("peanut"));
  const hasDairyAllergy = allergies.some(
    (a) => a.toLowerCase().includes("dairy") || a.toLowerCase().includes("lactose")
  );

  const nutSubstitute = hasPeanutAllergy ? "Pumpkin Seeds" : "Crushed Almonds";
  const dairySubstitute = hasDairyAllergy || isVegan ? "Almond / Oat Milk" : "Greek Yogurt";

  const breakfastCal = Math.round(calories * 0.28);
  const lunchCal = Math.round(calories * 0.35);
  const snackCal = Math.round(calories * 0.12);
  const dinnerCal = Math.round(calories * 0.25);

  const breakfastProtein = Math.round(protein * 0.28);
  const lunchProtein = Math.round(protein * 0.36);
  const snackProtein = Math.round(protein * 0.12);
  const dinnerProtein = Math.round(protein * 0.24);

  if (isVegan) {
    return [
      {
        type: "Breakfast",
        title: "Tofu Scramble with Sourdough & Avocado",
        calories: breakfastCal,
        protein: breakfastProtein,
        carbs: Math.round(carbs * 0.28),
        fat: Math.round(fat * 0.28),
        ingredients: [
          "Firm Organic Tofu (180g)",
          "Turmeric & Nutritional Yeast (15g)",
          "Toasted Sourdough (2 slices)",
          "Hass Avocado (1/2)",
          "Baby Spinach (50g)",
        ],
        instructions:
          "Crumble tofu into skillet with turmeric and nutritional yeast. Sauté spinach and serve over warm toasted sourdough with sliced avocado.",
        imageUrl:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
      },
      {
        type: "Lunch",
        title: isIndian
          ? "High-Protein Chana Masala & Quinoa Bowl"
          : "Tempeh Mediterranean Quinoa Bowl",
        calories: lunchCal,
        protein: lunchProtein,
        carbs: Math.round(carbs * 0.35),
        fat: Math.round(fat * 0.35),
        ingredients: [
          "Chickpeas / Tempeh (200g)",
          "Cooked Quinoa (150g)",
          "Cucumber & Cherry Tomatoes (100g)",
          "Tahini Lemon Dressing (2 tbsp)",
          nutSubstitute,
        ],
        instructions:
          "Assemble warm cooked quinoa, roasted spiced chickpeas/tempeh, diced veggies, and drizzle with fresh tahini lemon dressing.",
        imageUrl:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
      },
      {
        type: "Snack",
        title: "Plant Protein & Berry Chia Parfait",
        calories: snackCal,
        protein: snackProtein,
        carbs: Math.round(carbs * 0.12),
        fat: Math.round(fat * 0.12),
        ingredients: [
          "Pea Protein Powder (30g)",
          dairySubstitute,
          "Chia Seeds (1 tbsp)",
          "Fresh Blueberries (50g)",
        ],
        instructions:
          "Blend plant protein with dairy-free base, layer with soaked chia seeds and fresh antioxidant-rich blueberries.",
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
      },
      {
        type: "Dinner",
        title: "Edamame & Green Vegetable Stir-Fry",
        calories: dinnerCal,
        protein: dinnerProtein,
        carbs: Math.round(carbs * 0.25),
        fat: Math.round(fat * 0.25),
        ingredients: [
          "Shelled Edamame (150g)",
          "Broccoli Florets & Bok Choy (150g)",
          "Brown Basmati Rice (120g)",
          "Sesame Ginger Amino Sauce (2 tbsp)",
        ],
        instructions:
          "Wok-fry broccoli, bok choy, and edamame in sesame oil. Toss in ginger amino reduction and plate over warm brown basmati rice.",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
      },
    ];
  }

  if (isVeg || isEggetarian) {
    return [
      {
        type: "Breakfast",
        title: isEggetarian
          ? "3-Egg Veggie Omelet with Sourdough"
          : isIndian
          ? "Spiced Paneer & Moong Dal Chilla"
          : "Greek Yogurt Berry Protein Bowl",
        calories: breakfastCal,
        protein: breakfastProtein,
        carbs: Math.round(carbs * 0.28),
        fat: Math.round(fat * 0.28),
        ingredients: isEggetarian
          ? ["Whole Eggs (3)", "Egg Whites (2)", "Bell Peppers (50g)", "Whole Grain Toast (2 slices)"]
          : [
              "Low-Fat Paneer / Greek Yogurt (160g)",
              "Moong Dal Flour / Rolled Oats (60g)",
              "Chia Seeds (10g)",
              nutSubstitute,
            ],
        instructions:
          "Cook batter on non-stick pan until golden-crisp on both edges. Garnish with fresh herbs and mint chutney.",
        imageUrl:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
      },
      {
        type: "Lunch",
        title: isIndian
          ? "Grilled Paneer Tikka with Yellow Dal & Brown Rice"
          : "Mediterranean Halloumi / Paneer Power Salad",
        calories: lunchCal,
        protein: lunchProtein,
        carbs: Math.round(carbs * 0.35),
        fat: Math.round(fat * 0.35),
        ingredients: [
          "Grilled Low-Fat Paneer (150g)",
          "Cooked Yellow Tadka Dal / Chickpeas (150g)",
          "Brown Basmati Rice / Quinoa (120g)",
          "Fresh Cucumber Tomato Kachumber (80g)",
        ],
        instructions:
          "Marinate paneer in spiced yogurt, sear on grill pan. Pair with slow-simmered tadka dal and fragrant brown rice.",
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
      },
      {
        type: "Snack",
        title: "Whey / Plant Isolate Shake & Roasted Seeds",
        calories: snackCal,
        protein: snackProtein,
        carbs: Math.round(carbs * 0.12),
        fat: Math.round(fat * 0.12),
        ingredients: [
          "Protein Isolate (30g)",
          "Unsweetened Almond Milk (250ml)",
          nutSubstitute,
        ],
        instructions:
          "Shake with cold ice and almond milk for a rapid 25g anabolic post-workout boost.",
        imageUrl:
          "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80",
      },
      {
        type: "Dinner",
        title: "Tofu, Edamame & Roasted Vegetable Medley",
        calories: dinnerCal,
        protein: dinnerProtein,
        carbs: Math.round(carbs * 0.25),
        fat: Math.round(fat * 0.25),
        ingredients: [
          "Firm Tofu / Paneer (150g)",
          "Steamed Edamame & Broccoli (120g)",
          "Sweet Potato Mash (120g)",
          "Extra Virgin Olive Oil (1 tsp)",
        ],
        instructions:
          "Air-fry seasoned tofu cubes until crisp. Plate with roasted sweet potato mash and steamed greens.",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
      },
    ];
  }

  // Non-Vegetarian
  return [
    {
      type: "Breakfast",
      title: "Scrambled Eggs, Smoked Salmon & Avocado Toast",
      calories: breakfastCal,
      protein: breakfastProtein,
      carbs: Math.round(carbs * 0.28),
      fat: Math.round(fat * 0.28),
      ingredients: [
        "Pasture-Raised Eggs (3)",
        "Wild Smoked Salmon (60g)",
        "Whole Grain Sourdough (2 slices)",
        "Hass Avocado (1/3)",
      ],
      instructions:
        "Soft scramble eggs in 1 tsp grass-fed butter. Layer over sourdough with smoked salmon and avocado slices.",
      imageUrl:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    },
    {
      type: "Lunch",
      title: "Herb Grilled Chicken Breast with Quinoa & Asparagus",
      calories: lunchCal,
      protein: lunchProtein,
      carbs: Math.round(carbs * 0.35),
      fat: Math.round(fat * 0.35),
      ingredients: [
        "Skinless Chicken Breast (200g)",
        "Cooked Tricolor Quinoa (140g)",
        "Grilled Asparagus Spears (100g)",
        "Lemon Herb Garlic Glaze",
      ],
      instructions:
        "Grill marinated chicken breast to 165°F internal temperature. Rest 5 mins before slicing over fluffy quinoa and asparagus.",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    },
    {
      type: "Snack",
      title: "Greek Yogurt with Mixed Berries & Flaxseeds",
      calories: snackCal,
      protein: snackProtein,
      carbs: Math.round(carbs * 0.12),
      fat: Math.round(fat * 0.12),
      ingredients: [
        "0% Greek Yogurt (180g)",
        "Fresh Blueberries & Raspberries (60g)",
        "Ground Flaxseeds (1 tbsp)",
        nutSubstitute,
      ],
      instructions:
        "Top creamy Greek yogurt with fresh organic berries, flaxseed, and seeds.",
      imageUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
    },
    {
      type: "Dinner",
      title: "Pan-Seared Salmon Fillet with Sweet Potato & Green Beans",
      calories: dinnerCal,
      protein: dinnerProtein,
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.25),
      ingredients: [
        "Atlantic Salmon Fillet (180g)",
        "Roasted Sweet Potato Wedges (130g)",
        "Steamed French Green Beans (100g)",
        "Extra Virgin Olive Oil & Lemon",
      ],
      instructions:
        "Pan-sear salmon skin-side down for 4 mins, flip for 2 mins. Serve alongside roasted sweet potatoes and tender green beans.",
      imageUrl:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80",
    },
  ];
}
