import { z } from "zod";

export const ImpactLevel = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const BlindSpotSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  whyItMatters: z.string().min(1).max(400),
  evidenceFromReasoning: z.string().min(1).max(400),
  impact: ImpactLevel,
});

export const AssumptionSchema = z.object({
  assumption: z.string().min(1).max(200),
  whyItMayExist: z.string().min(1).max(300),
  howToTest: z.string().min(1).max(300),
});

export const MissingInfoSchema = z.object({
  item: z.string().min(1).max(200),
  whyItMatters: z.string().min(1).max(300),
  howToFindIt: z.string().min(1).max(300),
});

export const CounterArgSchema = z.object({
  argument: z.string().min(1).max(400),
  response: z.string().min(1).max(400),
});

export const OpportunityCostSchema = z.object({
  cost: z.string().min(1).max(300),
  tradeoff: z.string().min(1).max(400),
});

export const PerspectiveSchema = z.object({
  perspective: z.string().min(1).max(80),
  insight: z.string().min(1).max(400),
});

export const AnalysisSchema = z.object({
  decisionSnapshot: z.object({
    summary: z.string().min(1).max(400),
    mainDrivers: z.array(z.string().min(1).max(120)).min(1).max(8),
  }),
  blindSpots: z.array(BlindSpotSchema).min(1).max(8),
  assumptions: z.array(AssumptionSchema).min(1).max(8),
  missingInformation: z.array(MissingInfoSchema).min(1).max(8),
  counterArguments: z.array(CounterArgSchema).min(1).max(6),
  opportunityCosts: z.array(OpportunityCostSchema).min(1).max(6),
  perspectives: z.array(PerspectiveSchema).min(2).max(8),
  criticalQuestions: z.array(z.string().min(1).max(200)).min(3).max(8),
  thinkAgain: z.array(z.string().min(1).max(200)).length(3),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type BlindSpot = z.infer<typeof BlindSpotSchema>;
export type Assumption = z.infer<typeof AssumptionSchema>;
export type MissingInformation = z.infer<typeof MissingInfoSchema>;
export type CounterArgument = z.infer<typeof CounterArgSchema>;
export type OpportunityCost = z.infer<typeof OpportunityCostSchema>;
export type Perspective = z.infer<typeof PerspectiveSchema>;
export type ImpactLevelType = z.infer<typeof ImpactLevel>;

export const InputSchema = z.object({
  decision: z.string().min(5, "Please describe your decision").max(1200),
  reasoning: z.string().min(10, "Please share your reasoning").max(3000),
  priorities: z.array(z.string()).min(1, "Select at least one priority").max(12),
  constraints: z.string().max(3000).optional(),
});

export type AnalysisInput = z.infer<typeof InputSchema>;

export const PRIORITIES = [
  "Career",
  "Money",
  "Education",
  "Time",
  "Family",
  "Health",
  "Experience",
  "Growth",
  "Stability",
  "Location",
  "Freedom",
  "Other",
] as const;

export type Priority = (typeof PRIORITIES)[number];