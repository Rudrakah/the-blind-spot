// Common types used across the application

export type Priority =
  | "Career"
  | "Money"
  | "Education"
  | "Time"
  | "Family"
  | "Health"
  | "Experience"
  | "Growth"
  | "Stability"
  | "Location"
  | "Freedom"
  | "Other";

export interface AnalysisInput {
  decision: string;
  reasoning: string;
  priorities: Priority[];
  constraints: string;
}

export interface DecisionSnapshot {
  summary: string;
  mainDrivers: string[];
}

export interface BlindSpot {
  title: string;
  description: string;
  whyItMatters: string;
  evidenceFromReasoning: string;
  impact: "LOW" | "MEDIUM" | "HIGH";
}

export interface Assumption {
  assumption: string;
  whyItMayExist: string;
  howToTest: string;
}

export interface MissingInformation {
  item: string;
  whyItMatters: string;
  howToFindIt: string;
}

export interface CounterArgument {
  argument: string;
  response: string;
}

export interface OpportunityCost {
  cost: string;
  tradeoff: string;
}

export interface Perspective {
  perspective: string;
  insight: string;
}

export interface AnalysisResult {
  decisionSnapshot: DecisionSnapshot;
  blindSpots: BlindSpot[];
  assumptions: Assumption[];
  missingInformation: MissingInformation[];
  counterArguments: CounterArgument[];
  opportunityCosts: OpportunityCost[];
  perspectives: Perspective[];
  criticalQuestions: string[];
  thinkAgain: string[];
}

export interface ChallengeResult {
  challengeSnapshot: string;
  hardestChallenges: Array<{ question: string; explanation: string }>;
  strongestAssumptionAtRisk: { assumption: string; whatIfWrong: string };
  whatYouMightBeOverweighting: string;
  whatYouMightBeUnderweighting: string;
  evidenceThatCouldChangeYourMind: string[];
  finalQuestion: string;
}

export interface ArgueResult {
  side: "FOR" | "AGAINST";
  executiveCase: string;
  keyPoints: Array<{ point: string; supportingReasoning: string }>;
  weakestLink: string;
  reminder: string;
}

export type UIState = "idle" | "loading" | "error" | "result";