import OpenAI from "openai";
import { z } from "zod";
import { AnalysisSchema, type Analysis, InputSchema, type AnalysisInput } from "./schema";
import { SYSTEM_PROMPT, CHALLENGE_SYSTEM_PROMPT, ARGUE_SYSTEM_PROMPT, buildAnalyzePrompt, buildChallengePrompt, buildArguePrompt } from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
  dangerouslyAllowBrowser: false // We'll call this from API routes, not client
});

const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

export class AIAnalysisError extends Error {
  constructor(public readonly type: "network" | "malformed" | "validation" | "timeout", message: string) {
    super(message);
    this.name = "AIAnalysisError";
  }
}

async function callOpenAIWithRetry(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: { maxRetries?: number; temperature?: number } = {}
): Promise<string> {
  const { maxRetries = 2, temperature = 0.7 } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        response_format: { type: "json_object" }, // Forces JSON output
      }, { timeout: 15000 }); // 15 second timeout

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response from AI");
      }
      return content;
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  // If we get here, all retries failed
  if (lastError instanceof Error) {
    if (lastError.message.includes("timeout") || lastError.message.includes("Timeout")) {
      throw new AIAnalysisError("timeout", "AI analysis took too long. Please try again.");
    }
    if (lastError.message.includes("network") || lastError.message.includes("fetch failed") || lastError.message.includes("ECONNREFUSED")) {
      throw new AIAnalysisError("network", "Unable to connect to AI service. Please check your connection.");
    }
  }
  throw new AIAnalysisError("network", "AI service unavailable. Please try again later.");
}

function safeParseJSON<T>(content: string, schema: z.ZodType<T>): T {
  // Clean potential markdown code fences
  let cleaned = content.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Try to parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    // If JSON parsing fails, attempt to extract JSON from text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        throw new AIAnalysisError("malformed", "AI returned invalid JSON. Please try again.");
      }
    } else {
      throw new AIAnalysisError("malformed", "AI did not return JSON. Please try again.");
    }
  }

  // Validate against schema
  const result = schema.safeParse(parsed);
  if (!result.success) {
    // Log validation errors for debugging
    console.error("Validation errors:", result.error.format());
    throw new AIAnalysisError("validation", "AI response format invalid. Please try again.");
  }

  return result.data;
}

export async function analyzeDecision(input: AnalysisInput): Promise<Analysis> {
  // Validate input
  const parsedInput = InputSchema.parse(input);

  const prompt = buildAnalyzePrompt(parsedInput);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ];

  const rawResponse = await callOpenAIWithRetry(messages, { temperature: 0.7 });
  return safeParseJSON(rawResponse, AnalysisSchema);
}

export async function challengeThinking(input: AnalysisInput) {
  const parsedInput = InputSchema.parse(input);
  const prompt = buildChallengePrompt(parsedInput);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: CHALLENGE_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ];

  const rawResponse = await callOpenAIWithRetry(messages, { temperature: 0.8 });
  return safeParseJSON(rawResponse, z.object({
    challengeSnapshot: z.string(),
    hardestChallenges: z.array(z.object({
      question: z.string(),
      explanation: z.string()
    })),
    strongestAssumptionAtRisk: z.object({
      assumption: z.string(),
      whatIfWrong: z.string()
    }),
    whatYouMightBeOverweighting: z.string(),
    whatYouMightBeUnderweighting: z.string(),
    evidenceThatCouldChangeYourMind: z.array(z.string()),
    finalQuestion: z.string()
  }));
}

export async function argueSide(input: AnalysisInput, side: "FOR" | "AGAINST") {
  const parsedInput = InputSchema.parse(input);
  const prompt = buildArguePrompt(parsedInput, side);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: ARGUE_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ];

  const rawResponse = await callOpenAIWithRetry(messages, { temperature: 0.7 });
  return safeParseJSON(rawResponse, z.object({
    side: z.enum(["FOR", "AGAINST"]),
    executiveCase: z.string(),
    keyPoints: z.array(z.object({
      point: z.string(),
      supportingReasoning: z.string()
    })),
    weakestLink: z.string(),
    reminder: z.string()
  }));
}

// Demo scenarios for one-click examples
export const DEMO_SCENARIOS = [
  {
    id: "internship-vs-academics",
    title: "Internship vs Academics",
    decision: "Should I accept a 6-month internship offer?",
    reasoning: "The stipend is good, the company is close to home, and it gives me industry experience.",
    priorities: ["Career", "Education", "Money", "Time"],
    constraints: "I'm currently a full-time student with classes 3 days a week.",
  },
  {
    id: "startup-vs-stable",
    title: "Startup vs Stable Job",
    decision: "Should I join this early-stage startup or stay at my stable corporate job?",
    reasoning: "The startup offers exciting work, equity, and fast growth but lower salary and less job security.",
    priorities: ["Career", "Money", "Growth", "Stability", "Experience"],
    constraints: "I have a mortgage and two young children.",
  },
  {
    id: "laptop-purchase",
    title: "Laptop Purchase Decision",
    decision: "Should I buy the expensive laptop now or wait and save money?",
    reasoning: "I need a powerful laptop for my design work, and the current model has a great discount.",
    priorities: ["Money", "Experience", "Growth", "Practicality"],
    constraints: "My budget is tight this month due to car repairs.",
  },
  {
    id: "career-paths",
    title: "Two Career Paths",
    decision: "Should I specialize in frontend development or move into full-stack engineering?",
    reasoning: "I enjoy frontend work but worry about limiting my opportunities long-term.",
    priorities: ["Career", "Growth", "Experience", "Freedom"],
    constraints: "I need to make a decision within the next month for my performance review."
  }
];