import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Models in priority order: gemini-3.8-flash (skill default) -> gemini-flash-latest -> gemini-3.1-flash-lite
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

export interface GenerateOptions {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
}

export async function generateContentWithFallback(
  options: GenerateOptions,
  clientOverride?: GoogleGenAI | null
): Promise<{ text: string | undefined; modelUsed: string } | null> {
  const client = clientOverride || getGeminiClient();
  if (!client) return null;

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: options.contents,
        config: {
          ...(options.systemInstruction
            ? { systemInstruction: options.systemInstruction }
            : {}),
          ...(options.responseMimeType
            ? { responseMimeType: options.responseMimeType }
            : {}),
        },
      });

      return { text: response.text, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isUnavailable =
        err?.status === 503 ||
        err?.code === 503 ||
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE");

      if (isUnavailable) {
        console.warn(`[FitAI] Model '${model}' experienced 503 high demand; falling back to next candidate.`);
        continue;
      }

      console.warn(`[FitAI] Model '${model}' attempt notice: ${errMsg}`);
    }
  }

  // Gracefully return null so caller falls back to deterministic structured engine
  return null;
}
