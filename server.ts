import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  validateRecommendationInput,
  generateServerRecommendation,
} from "./server/recommendationService";
import {
  getGeminiClient,
  generateContentWithFallback,
} from "./server/aiService";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Recommendation Engine Endpoint
  app.post("/api/recommendation", async (req, res) => {
    try {
      const validation = validateRecommendationInput(req.body);
      if (!validation.isValid || !validation.normalized) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const client = getGeminiClient();
      const recommendation = await generateServerRecommendation(
        validation.normalized,
        client
      );

      return res.status(200).json({
        success: true,
        recommendation,
      });
    } catch (error: any) {
      console.error("Recommendation API Error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error generating recommendation",
        message: error?.message || "An unexpected error occurred",
      });
    }
  });

  // Assistant Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userProfile } = req.body;

      const getFallbackReply = () => {
        const fallbackResponses: Record<string, string> = {
          "why did you recommend this workout?":
            `This plan was specifically selected for your goal of ${userProfile?.goal || "building muscle"} and your ${userProfile?.experience || "intermediate"} experience level. We balanced compound exercises with calculated recovery across your ${userProfile?.scheduleDays || 4} training days/week to ensure progressive overload without excessive fatigue.`,
          "alternative exercise":
            "For Barbell Squats, excellent alternatives include Dumbbell Goblet Squats or Leg Press to reduce spinal compression while maintaining quadricep tension. For Pushups, Incline Dumbbell Bench Press or Chest Dips provide a great chest and tricep stimulus.",
          "another vegetarian meal":
            "A fantastic high-protein vegetarian alternative is Tofu & Broccoli Stir-Fry with Edamame and Quinoa (420 kcal, 28g protein, 35g carbs, 14g fats), or Greek Yogurt Bowl with Mixed Berries, Chia Seeds, and Whey/Plant Protein.",
          "how to optimize recovery on rest days":
            "Prioritize 7.5 to 8.5 hours of sleep, light active recovery (such as a 20-minute brisk walk or gentle mobility flow), maintain hydration (~2.5-3L water), and hit your daily protein target to fuel muscle protein synthesis.",
          "should i do cardio before or after weights?":
            "Perform weights before cardio if your primary goal is strength or muscle hypertrophy; this preserves glycogen stores and central nervous system output for heavy resistance training. Keep post-workout cardio to moderate intensity.",
        };

        const lowerMsg = (message || "").toLowerCase().trim();
        let reply = fallbackResponses[lowerMsg];

        if (!reply) {
          if (lowerMsg.includes("why") || lowerMsg.includes("recommend")) {
            reply = `This plan was designed around your goal of ${userProfile?.goal || "General Fitness"}, your ${userProfile?.experience || "Beginner"} level, and ${userProfile?.scheduleDays || 4} weekly sessions. It delivers targeted volume and progressive stimulus suited to your available equipment.`;
          } else if (lowerMsg.includes("meal") || lowerMsg.includes("diet") || lowerMsg.includes("food") || lowerMsg.includes("protein")) {
            reply = `For your ${userProfile?.diet || "Vegetarian"} nutrition plan, aim for consistent protein distribution across your meals (target ~${userProfile?.proteinTarget || 120}g daily). Focus on whole foods like Paneer, Tofu, Greek Yogurt, Lentils, Chickpeas, and quality protein supplements.`;
          } else if (lowerMsg.includes("exercise") || lowerMsg.includes("workout") || lowerMsg.includes("swap") || lowerMsg.includes("squat")) {
            reply = "To substitute any exercise safely, choose a movement that trains the same primary movement pattern (e.g. goblet squat for barbell squat, dumbbell press for bench press) and maintain controlled cadence.";
          } else {
            reply = `Here to support your fitness journey, ${userProfile?.name || "Athlete"}! Ask me about exercise substitutions, macro targets, or form pointers whenever you need guidance.`;
          }
        }
        return reply;
      };

      const systemInstruction = `You are FitAI, an elite, encouraging, and science-backed AI personal fitness and nutrition coach.
User Profile:
- Name: ${userProfile?.name || "Athlete"}
- Goal: ${userProfile?.goal || "General Fitness"}
- Experience Level: ${userProfile?.experience || "Beginner"}
- Workout Days/Week: ${userProfile?.scheduleDays || 4}
- Location: ${userProfile?.locations?.join(", ") || "Gym"}
- Available Equipment: ${userProfile?.equipment?.join(", ") || "Dumbbells, Machines"}
- Limitations/Injuries: ${userProfile?.limitations?.join(", ") || "None"}
- Diet: ${userProfile?.diet || "Vegetarian"} (${userProfile?.dietPreferences?.join(", ") || "High Protein"})
- Daily Targets: ~${userProfile?.calorieTarget || 1800} kcal, ${userProfile?.proteinTarget || 120}g protein.

Guidelines:
1. Provide concise, actionable, and encouraging fitness & nutrition advice.
2. If the user asks why a workout was recommended, explain the specific rationale referencing their profile.
3. Suggest concrete exercise substitutions and delicious macro-friendly meal ideas.
4. Keep answers friendly, crisp, and formatted cleanly.`;

      const contents = [
        ...(history || []).map((h: { role: string; content: string }) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];

      const aiResponse = await generateContentWithFallback({
        contents,
        systemInstruction,
      });

      const reply = aiResponse?.text || getFallbackReply();
      res.json({ reply, model: aiResponse?.modelUsed || "structured-coach" });
    } catch (error: any) {
      const fallbackReply =
        "This plan was selected based on your stated goal of building lean muscle, your intermediate experience level, and the availability of your workout facilities. We prioritized compound movements to maximize training efficiency.";
      res.json({ reply: fallbackReply, isFallback: true });
    }
  });

  // AI Plan Generation Endpoint
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const userProfile = req.body;
      const prompt = `Generate a brief 1-sentence motivational coaching summary for ${userProfile?.name || "the athlete"} based on their goal "${userProfile?.goal || "General Fitness"}", training ${userProfile?.scheduleDays || 4} days/week with ${userProfile?.diet || "Balanced"} nutrition.`;

      const aiResponse = await generateContentWithFallback({
        contents: prompt,
      });

      const coachingTip =
        aiResponse?.text ||
        `Stay consistent with your ${userProfile?.scheduleDays || 4}-day split and ${userProfile?.diet || "tailored"} nutrition to achieve your ${userProfile?.goal || "fitness"} milestones.`;

      res.json({
        status: "success",
        coachingTip,
        model: aiResponse?.modelUsed || "fitai-engine",
      });
    } catch {
      res.json({ status: "success", fallback: true });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitAI server running on http://localhost:${PORT}`);
  });
}

startServer();
