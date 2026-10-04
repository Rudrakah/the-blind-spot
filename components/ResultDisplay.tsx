"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import {
  BlindSpot,
  Assumption,
  MissingInformation,
  CounterArgument,
  OpportunityCost,
  Perspective,
  AnalysisResult,
  ChallengeResult,
  ArgueResult,
  UIState,
} from "@/lib/types";

const PRIORITY_LABELS: Record<string, string> = {
  Career: "Career",
  Money: "Money",
  Education: "Education",
  Time: "Time",
  Family: "Family",
  Health: "Health",
  Experience: "Experience",
  Growth: "Growth",
  Stability: "Stability",
  Location: "Location",
  Freedom: "Freedom",
  Other: "Other",
};

const IMPACT_COLORS: Record<BlindSpot["impact"], string> = {
  LOW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

interface ResultDisplayProps {
  analysis: AnalysisResult;
  onAnalyzeAgain: () => void;
  onNewDecision: () => void;
  onChallengeThinking: () => void;
  onArgueFor: () => void;
  onArgueAgainst: () => void;
}

export default function ResultDisplay({
  analysis,
  onAnalyzeAgain,
  onNewDecision,
  onChallengeThinking,
  onArgueFor,
  onArgueAgainst,
}: ResultDisplayProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("blind-spots");
  const [showChallenge, setShowChallenge] = useState<boolean>(false);
  const [showArgue, setShowArgue] = useState<boolean>(false);
  const [argueSide, setArgueSide] = useState<"FOR" | "AGAINST">("FOR");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleChallenge = async () => {
    setShowChallenge(true);
    // We'll implement the challenge flow after form submission data is available
  };

  const handleArgue = (side: "FOR" | "AGAINST") => {
    setArgueSide(side);
    setShowArgue(true);
  };

  const renderImpactBadge = (impact: BlindSpot["impact"]) => {
    const colors = IMPACT_COLORS[impact];
    const [bgClass, textClass] = colors.split(" ");
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bgClass} ${textClass}`}
      >
        {impact}
      </span>
    );
  };

  // Decision Snapshot section
  const renderDecisionSnapshot = () => {
    const { summary, mainDrivers } = analysis.decisionSnapshot;
    return (
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          Decision Snapshot
        </h2>
        <div className="bg-glass rounded-xl p-6">
          <p className="text-ink-secondary space-y-2">{summary}</p>
          {mainDrivers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mainDrivers.map((driver, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-accent-primary/10 text-accent-primary">
                  {driver}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Blind Spots section
  const renderBlindSpots = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.036 9.036a9 9 0 0012.728 12.728m-1.414-1.414L12 12l3.036-3.036" />
          </svg>
          Blind Spots
        </h2>
        <div className="space-y-4">
          {analysis.blindSpots.map((spot, index) => (
            <div
              key={index}
              className="bg-glass rounded-xl p-5 space-y-3 border-l-4"
              style={{ borderLeftColor: `#6366f1` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${renderImpactBadge(spot.impact)}`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-ink-primary">{spot.title}</h3>
                  <p className="text-ink-secondary line-clamp-2">{spot.description}</p>
                  <div className="mt-2 space-y-2 text-sm">
                    <p className="font-medium text-ink-muted">Why it matters:</p>
                    <p className="text-ink-secondary">{spot.whyItMatters}</p>
                    <p className="font-medium text-ink-muted">Evidence from your reasoning:</p>
                    <p className="text-ink-secondary italic">{spot.evidenceFromReasoning}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Hidden Assumptions section
  const renderAssumptions = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Hidden Assumptions
        </h2>
        <div className="space-y-4">
          {analysis.assumptions.map((assumption, index) => (
            <div key={index} className="bg-glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-ink-primary">Assumption</h3>
              <p className="text-ink-secondary">{assumption.assumption}</p>
              <div className="mt-4 space-y-2 text-xs">
                <p className="font-medium text-ink-muted">Why it may exist:</p>
                <p className="text-ink-secondary">{assumption.whyItMayExist}</p>
                <p className="font-medium text-ink-muted">How to test it:</p>
                <p className="text-ink-secondary">{assumption.howToTest}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Missing Information section
  const renderMissingInformation = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 12h16M4 16h16" />
          </svg>
          Missing Information
        </h2>
        <div className="space-y-4">
          {analysis.missingInformation.map((info, index) => (
            <div key={index} className="bg-glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-ink-primary">Missing Information</h3>
              <p className="text-ink-secondary">{info.item}</p>
              <div className="mt-4 space-y-2 text-xs">
                <p className="font-medium text-ink-muted">Why it matters:</p>
                <p className="text-ink-secondary">{info.whyItMatters}</p>
                <p className="font-medium text-ink-muted">How to find it:</p>
                <p className="text-ink-secondary">{info.howToFindIt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Counter-Arguments section
  const renderCounterArguments = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.206 8.894l2.394 1.394a5.5 5.5 0 011.406 5.006l1.028.598a9 9 0 106.122-3.555M12 15a3 3 0 110-6 3 3 0 010 6z" />
          </svg>
          Counter-Arguments
        </h2>
        <div className="space-y-4">
          {analysis.counterArguments.map((arg, index) => (
            <div key={index} className="bg-glass rounded-xl p-5 space-y-3">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-shrink-0 w-2 h-2 bg-accent-primary/20 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-semibold text-ink-primary">Counter-Argument</h3>
                  <p className="text-ink-secondary">{arg.argument}</p>
                </div>
              </div>
              <div className="border-t border-border-subtle pt-4">
                <h3 className="font-semibold text-ink-primary">Response</h3>
                <p className="text-ink-secondary">{arg.response}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Opportunity Costs section
  const renderOpportunityCosts = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4c1.11 0 2-.89 2-2h-1c0 .66-.55 1.2-1.2 1.67" />
          </svg>
          Opportunity Costs
        </h2>
        <div className="space-y-4">
          {analysis.opportunityCosts.map((cost, index) => (
            <div key={index} className="bg-glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-ink-primary">Opportunity Cost</h3>
              <p className="text-ink-secondary">{cost.cost}</p>
              <div className="mt-4 space-y-2 text-xs">
                <p className="font-medium text-ink-muted">Trade-off:</p>
                <p className="text-ink-secondary">{cost.tradeoff}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Perspectives section
  const renderPerspectives = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4c1.11 0 2-.89 2-2h-1c0 .66-.55 1.2-1.2 1.67" />
          </svg>
          Perspectives
        </h2>
        <div className="space-y-4">
          {analysis.perspectives.map((persp, index) => (
            <div key={index} className="bg-glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-ink-primary">{persp.perspective}</h3>
              <p className="text-ink-secondary">{persp.insight}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Critical Questions section
  const renderCriticalQuestions = () => {
    return (
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4c1.11 0 2-.89 2-2h-1c0 .66-.55 1.2-1.2 1.67" />
          </svg>
          Critical Questions
        </h2>
        <div className="space-y-4">
          {analysis.criticalQuestions.map((question, index) => (
            <div key={index} className="bg-glass rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-accent-primary font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-ink-secondary">{question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Think Again section
  const renderThinkAgain = () => {
    return (
      <section className="space-y-6 pt-8 border-t border-border-subtle">
        <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
          </svg>
          THINK AGAIN
        </h2>
        <div className="bg-glass rounded-xl p-6 space-y-4">
          {analysis.thinkAgain.map((thought, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-accent-primary font-bold">{index + 1}.</span>
              </div>
              <div className="flex-1">
                <p className="text-ink-secondary">{thought}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Challenge My Thinking card
  const renderChallengeCard = (challenge: ChallengeResult) => {
    return (
      <div className="bg-glass rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-accent-primary">Challenge My Thinking</h3>
        <p className="text-ink-secondary">{challenge.challengeSnapshot}</p>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-ink-muted">Strongest assumption at risk:</p>
            <p className="text-ink-secondary break-all">{challenge.strongestAssumptionAtRisk.assumption}</p>
            <p className="text-xs text-ink-muted">What if wrong:</p>
            <p className="text-xs text-ink-secondary break-all">{challenge.strongestAssumptionAtRisk.whatIfWrong}</p>
          </div>
          <div>
            <p className="font-medium text-ink-muted">You might be over-weighting:</p>
            <p className="text-ink-secondary break-all">{challenge.whatYouMightBeOverweighting}</p>
          </div>
          <div>
            <p className="font-medium text-ink-muted">You might be under-weighting:</p>
            <p className="text-ink-secondary break-all">{challenge.whatYouMightBeUnderweighting}</p>
          </div>
          <div>
            <p className="font-medium text-ink-muted">Evidence that could change your mind:</p>
            <div className="space-y-1">
              {challenge.evidenceThatCouldChangeYourMind.map((ev, i) => (
                <p key={i} className="text-ink-secondary text-xs break-all">{ev}</p>
              ))}
            </div>
          </div>
          <p className="font-medium text-accent-primary">{challenge.finalQuestion}</p>
        </div>
      </div>
    );
  };

  // Argue For/Against card
  const renderArgueCard = (result: ArgueResult) => {
    return (
      <div className="bg-glass rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-accent-primary">{result.side === "FOR" ? "MAKE THE STRONGEST CASE FOR" : "MAKE THE STRONGEST CASE AGAINST"}</h3>
        <p className="text-ink-secondary">{result.executiveCase}</p>
        <div className="mt-4 space-y-3 text-sm">
          {result.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="w-1 h-1 rounded-full bg-accent-primary flex-shrink-0"/>
              <div className="flex-1">
                <p className="font-medium text-ink-primary">{point.point}</p>
                <p className="text-ink-secondary break-all">{point.supportingReasoning}</p>
              </div>
            </div>
          ))}
          <div>
            <p className="font-medium text-ink-muted">Weakest link:</p>
            <p className="text-ink-secondary break-all">{result.weakestLink}</p>
          </div>
          <p className="text-xs text-ink-muted italic">{result.reminder}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-texture relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-pattern" aria-hidden="true" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/70 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/70 rounded-full blur-3xl" aria-hidden="true" />

      {/* Header with back button and title */}
      <header className="relative z-10 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors text-sm font-medium"
            aria-label="Back to decision input"
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Back to Analysis
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink-primary">
            {activeTab === "decision-snapshot"
              ? "Decision Snapshot"
              : activeTab === "blind-spots"
              ? "Blind Spots"
              : activeTab === "assumptions"
              ? "Hidden Assumptions"
              : activeTab === "missing-info"
              ? "Missing Information"
              : activeTab === "counter-args"
              ? "Counter-Arguments"
              : activeTab === "opportunity-costs"
              ? "Opportunity Costs"
              : activeTab === "perspectives"
              ? "Perspectives"
              : activeTab === "critical-questions"
              ? "Critical Questions"
              : activeTab === "think-again"
              ? "Think Again"
              : "THE BLIND SPOT"}
          </h1>
        </div>
      </header>

      {/* Main content area */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-12">
        {/* Tabs navigation */}
        <nav className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleTabChange("decision-snapshot")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "decision-snapshot"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Decision Snapshot
          </button>
          <button
            onClick={() => handleTabChange("blind-spots")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "blind-spots"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Blind Spots
          </button>
          <button
            onClick={() => handleTabChange("assumptions")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "assumptions"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Hidden Assumptions
          </button>
          <button
            onClick={() => handleTabChange("missing-info")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "missing-info"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Missing Information
          </button>
          <button
            onClick={() => handleTabChange("counter-args")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "counter-args"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Counter-Arguments
          </button>
          <button
            onClick={() => handleTabChange("opportunity-costs")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "opportunity-costs"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Opportunity Costs
          </button>
          <button
            onClick={() => handleTabChange("perspectives")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "perspectives"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Perspectives
          </button>
          <button
            onClick={() => handleTabChange("critical-questions")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "critical-questions"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            Critical Questions
          </button>
          <button
            onClick={() => handleTabChange("think-again")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "think-again"
                ? "bg-accent-primary/10 text-accent-primary border-border-subtle"
                : "text-ink-secondary hover:text-accent-primary hover:bg-accent-primary/10"
            }`}
          >
            THINK AGAIN
          </button>
        </nav>

        {/* Active tab content */}
        <section className="space-y-8">
          {activeTab === "decision-snapshot" && renderDecisionSnapshot()}
          {activeTab === "blind-spots" && renderBlindSpots()}
          {activeTab === "assumptions" && renderAssumptions()}
          {activeTab === "missing-info" && renderMissingInformation()}
          {activeTab === "counter-args" && renderCounterArguments()}
          {activeTab === "opportunity-costs" && renderOpportunityCosts()}
          {activeTab === "perspectives" && renderPerspectives()}
          {activeTab === "critical-questions" && renderCriticalQuestions()}
          {activeTab === "think-again" && renderThinkAgain()}
        </section>
      </main>

      {/* Bottom action bar */}
      <div className="relative z-10 border-t border-border-subtle px-4 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => onAnalyzeAgain()}
            className="flex-1 sm:w-auto px-6 py-3 bg-glass text-ink-primary font-medium rounded-xl hover:bg-accent-primary/10 transition-colors border border-border-subtle"
          >
            ANALYZE AGAIN
          </button>
          <button
            onClick={() => onNewDecision()}
            className="flex-1 sm:w-auto px-6 py-3 text-lg font-medium rounded-xl bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
          >
            START NEW DECISION
          </button>
          <button
            onClick={() => setShowChallenge(true)}
            className="flex-1 sm:w-auto px-6 py-3 text-sm font-medium rounded-xl bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors border border-border-subtle"
          >
            CHALLENGE MY THINKING
          </button>
          {showChallenge && (
            <div className="mt-4 max-w-xl mx-auto">
              <button
                onClick={() => {
                  // Trigger the challenge API - in a full app this would call /api/challenge
                  // with the analysis data from the original submission
                  setShowChallenge(false);
                  // For now, navigate back to analyze with a "challenge" mode
                  router.push("/analyze?challenge=true");
                }}
                className="w-full px-4 py-2 text-sm font-medium rounded-xl bg-glass text-ink-primary hover:bg-accent-primary/10 transition-colors"
              >
                Close Challenge
              </button>
            </div>
          )}
          <button
            onClick={() => setShowArgue(true)}
            className="flex-1 sm:w-auto px-6 py-3 text-sm font-medium rounded-xl bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors border border-border-subtle"
          >
            {argueSide === "FOR" ? "MAKE THE STRONGEST CASE FOR" : "MAKE THE STRONGEST CASE AGAINST"}
          </button>
          {showArgue && (
            <div className="mt-4 max-w-xl mx-auto">
              <button
                onClick={() => {
                  setShowArgue(false);
                  router.push("/analyze?argue=true");
                }}
                className="w-full px-4 py-2 text-sm font-medium rounded-xl bg-glass text-ink-primary hover:bg-accent-primary/10 transition-colors"
              >
                Close Reasoning Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}