"use client";

import { useState } from "react";
import { AnalysisResult, ChallengeResult, ArgueResult, UIState } from "@/lib/types";
import ResultDisplay from "./ResultDisplay";

const PRIORITIES = [
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

type Priority = (typeof PRIORITIES)[number];

const DEMO_SCENARIOS = {
  internship: {
    title: "Internship vs Academics",
    decision: "Should I accept a 6-month internship offer?",
    reasoning: "The stipend is good, the company is close to home, and it gives me industry experience.",
    priorities: ["Career", "Education", "Money", "Time"] as Priority[],
    constraints: "I'm currently a full-time student with classes 3 days a week.",
  },
  startup: {
    title: "Startup vs Stable Job",
    decision: "Should I join this early-stage startup or stay at my stable corporate job?",
    reasoning: "The startup offers exciting work, equity, and fast growth but lower salary and less job security.",
    priorities: ["Career", "Money", "Growth", "Stability", "Experience"] as Priority[],
    constraints: "I have a mortgage and two young children.",
  },
  laptop: {
    title: "Laptop Purchase",
    decision: "Should I buy the expensive laptop now or wait and save money?",
    reasoning: "I need a powerful laptop for my design work, and the current model has a great discount.",
    priorities: ["Money", "Experience", "Growth", "Practicality"] as Priority[],
    constraints: "My budget is tight this month due to car repairs.",
  },
  career: {
    title: "Career Paths",
    decision: "Should I specialize in frontend development or move into full-stack engineering?",
    reasoning: "I enjoy frontend work but worry about limiting my opportunities long-term.",
    priorities: ["Career", "Growth", "Experience", "Freedom"] as Priority[],
    constraints: "I need to make a decision within the next month for my performance review.",
  },
};

export default function AnalyzeForm() {
  const [state, setState] = useState<UIState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);
  const [argueResult, setArgueResult] = useState<ArgueResult | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [argueSide, setArgueSide] = useState<"FOR" | "AGAINST" | null>(null);

  const [formData, setFormData] = useState<{
    decision: string;
    reasoning: string;
    priorities: Priority[];
    constraints: string;
  }>({
    decision: "",
    reasoning: "",
    priorities: [],
    constraints: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.decision.trim().length < 5) {
      setError("Please describe your decision (at least 5 characters)");
      return;
    }
    if (formData.reasoning.trim().length < 10) {
      setError("Please share your reasoning (at least 10 characters)");
      return;
    }
    if (formData.priorities.length === 0) {
      setError("Please select at least one priority");
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result);
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  const handleDemo = (scenario: keyof typeof DEMO_SCENARIOS) => {
    const demo = DEMO_SCENARIOS[scenario];
    setFormData({
      decision: demo.decision,
      reasoning: demo.reasoning,
      priorities: demo.priorities,
      constraints: demo.constraints,
    });
  };

  const togglePriority = (priority: Priority) => {
    setFormData((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter((p) => p !== priority)
        : [...prev.priorities, priority],
    }));
  };

  const resetForm = () => {
    setFormData({
      decision: "",
      reasoning: "",
      priorities: [],
      constraints: "",
    });
    setAnalysis(null);
    setChallengeResult(null);
    setArgueResult(null);
    setActionLoading(null);
    setError(null);
    setState("idle");
  };

  const handleChallenge = async () => {
    setActionLoading("challenge");
    try {
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to challenge thinking");
      const result = await response.json();
      setChallengeResult(result);
      setArgueResult(null);
    } catch (err) {
      console.error(err);
      alert("Error challenging thinking");
    } finally {
      setActionLoading(null);
    }
  };

  const handleArgue = async (side: "FOR" | "AGAINST") => {
    setActionLoading(`argue-${side}`);
    try {
      const response = await fetch("/api/argue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, side }),
      });
      if (!response.ok) throw new Error(`Failed to argue ${side}`);
      const result = await response.json();
      setArgueResult(result);
      setChallengeResult(null);
    } catch (err) {
      console.error(err);
      alert(`Error arguing ${side}`);
    } finally {
      setActionLoading(null);
    }
  };

  const loadingMessages = [
    "Examining your reasoning...",
    "Looking for hidden assumptions...",
    "Checking what might be missing...",
    "Stress-testing the trade-offs...",
    "Preparing your blind-spot report...",
  ];

  // Show results if we have them
  if (state === "result" && analysis) {
    return (
      <div className="min-h-screen bg-texture relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-pattern" aria-hidden="true" />

        <header className="relative z-10 border-b border-border-subtle pb-6">
          <h1 className="font-display text-2xl font-bold text-ink-primary">ANALYSIS COMPLETE</h1>
          <p className="text-sm text-ink-muted mt-1">Your reasoning has been examined</p>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 pb-12 space-y-8">
          {/* Decision Snapshot */}
          <section className="bg-glass rounded-xl p-5">
            <h2 className="font-display text-xl font-semibold text-ink-primary mb-3">Decision Snapshot</h2>
            <p className="text-ink-secondary">{analysis.decisionSnapshot.summary}</p>
            {analysis.decisionSnapshot.mainDrivers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {analysis.decisionSnapshot.mainDrivers.map((driver, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm bg-accent-primary/10 text-accent-primary font-medium">
                    {driver}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Blind Spots */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.036 9.036a9 9 0 0012.728 12.728m-1.414-1.414L12 12l3.036-3.036" />
              </svg>
              Blind Spots
            </h2>
            {analysis.blindSpots.map((spot, i) => (
              <div key={i} className="bg-glass rounded-xl p-5 border-l-4" style={{ borderLeftColor: "#6366f1" }}>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                  <div>
                    <h3 className="font-semibold text-ink-primary">{spot.title}</h3>
                    <p className="text-ink-secondary text-sm">{spot.description}</p>
                    <p className="text-xs text-ink-muted mt-2">{spot.whyItMatters}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Hidden Assumptions */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Hidden Assumptions
            </h2>
            {analysis.assumptions.map((a, i) => (
              <div key={i} className="bg-glass rounded-xl p-5">
                <h3 className="font-semibold text-ink-primary text-sm">{a.assumption}</h3>
                <p className="text-xs text-ink-muted mt-1">Test: {a.howToTest}</p>
              </div>
            ))}
          </section>

          {/* Missing Information */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 12h16M4 16h16" />
              </svg>
              Missing Information
            </h2>
            {analysis.missingInformation.map((m, i) => (
              <div key={i} className="bg-glass rounded-xl p-5">
                <h3 className="font-semibold text-ink-primary text-sm">{m.item}</h3>
                <p className="text-xs text-ink-muted mt-1">Why it matters: {m.whyItMatters}</p>
              </div>
            ))}
          </section>

          {/* Counter-Arguments */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.206 8.894l2.394 1.394a5.5 5.5 0 011.406 5.006l1.028.598a9 9 0 106.122-3.555M12 15a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
              Counter-Arguments
            </h2>
            {analysis.counterArguments.map((c, i) => (
              <div key={i} className="bg-glass rounded-xl p-5">
                <p className="text-sm text-ink-secondary">{c.argument}</p>
                <p className="text-xs text-ink-muted mt-2 italic">Response: {c.response}</p>
              </div>
            ))}
          </section>

          {/* Opportunity Costs */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4c1.11 0 2-.89 2-2h-1c0 .66-.55 1.2-1.2 1.67" />
              </svg>
              Opportunity Costs
            </h2>
            {analysis.opportunityCosts.map((o, i) => (
              <div key={i} className="bg-glass rounded-xl p-5">
                <p className="text-sm text-ink-secondary">{o.cost}</p>
                <p className="text-xs text-ink-muted mt-1">Trade-off: {o.tradeoff}</p>
              </div>
            ))}
          </section>

          {/* Perspectives */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4c1.11 0 2-.89 2-2h-1c0 .66-.55 1.2-1.2 1.67" />
              </svg>
              Perspectives
            </h2>
            {analysis.perspectives.map((p, i) => (
              <div key={i} className="bg-glass rounded-xl p-5">
                <h3 className="font-semibold text-ink-primary text-sm">{p.perspective}</h3>
                <p className="text-xs text-ink-secondary mt-1">{p.insight}</p>
              </div>
            ))}
          </section>

          {/* Critical Questions */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 4c1.11 0 2-.89 2-2h-1c0 .66-.55 1.2-1.2 1.67" />
              </svg>
              Critical Questions
            </h2>
            {analysis.criticalQuestions.map((q, i) => (
              <div key={i} className="bg-glass rounded-xl p-5 flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-accent-primary font-bold">{i + 1}</span>
                </span>
                <p className="text-ink-secondary text-sm">{q}</p>
              </div>
            ))}
          </section>

          {/* Think Again */}
          <section className="space-y-4 pt-6 border-t border-border-subtle">
            <h2 className="font-display text-2xl font-semibold text-ink-primary flex items-center gap-3">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
              </svg>
              THINK AGAIN
            </h2>
            <div className="bg-glass rounded-xl p-5 space-y-4">
              {analysis.thinkAgain.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-accent-primary font-bold">{i + 1}.</span>
                  <p className="text-ink-secondary text-sm">{t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Action buttons */}
          <div className="pt-6 border-t border-border-subtle flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
                setChallengeResult(null);
                setArgueResult(null);
                setState("idle");
              }}
              className="px-6 py-3 rounded-xl font-medium transition-colors border border-border-subtle bg-glass text-ink-secondary hover:bg-accent-primary/10"
            >
              ANALYZE AGAIN
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-xl font-medium text-lg transition-colors text-white bg-accent-primary hover:bg-accent-primary/90"
            >
              START NEW DECISION
            </button>
            <button
              onClick={handleChallenge}
              disabled={!!actionLoading}
              className="px-4 py-3 rounded-xl font-medium text-sm transition-colors border border-border-subtle bg-glass text-ink-secondary hover:bg-accent-primary/10 disabled:opacity-50"
            >
              {actionLoading === "challenge" ? "LOADING..." : "CHALLENGE MY THINKING"}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleArgue("FOR")}
                disabled={!!actionLoading}
                className="px-4 py-3 rounded-xl font-medium text-sm transition-colors border border-border-subtle bg-glass text-ink-secondary hover:bg-accent-primary/10 disabled:opacity-50"
              >
                {actionLoading === "argue-FOR" ? "LOADING..." : "ARGUE FOR"}
              </button>
              <button
                onClick={() => handleArgue("AGAINST")}
                disabled={!!actionLoading}
                className="px-4 py-3 rounded-xl font-medium text-sm transition-colors border border-border-subtle bg-glass text-ink-secondary hover:bg-accent-primary/10 disabled:opacity-50"
              >
                {actionLoading === "argue-AGAINST" ? "LOADING..." : "ARGUE AGAINST"}
              </button>
            </div>
          </div>

          {/* Challenge Result Display */}
          {challengeResult && (
            <section className="space-y-4 pt-6 border-t border-border-subtle">
              <h2 className="font-display text-2xl font-semibold text-ink-primary">Challenge Snapshot</h2>
              <div className="bg-glass rounded-xl p-5 space-y-4">
                <p className="text-ink-secondary text-sm">{challengeResult.challengeSnapshot}</p>
                
                <h3 className="font-semibold text-ink-primary mt-4">Hardest Challenges</h3>
                {challengeResult.hardestChallenges.map((c, i) => (
                  <div key={i}>
                    <p className="font-medium text-ink-primary text-sm">{c.question}</p>
                    <p className="text-xs text-ink-secondary">{c.explanation}</p>
                  </div>
                ))}
                
                <h3 className="font-semibold text-ink-primary mt-4">Strongest Assumption At Risk</h3>
                <p className="font-medium text-ink-primary text-sm">{challengeResult.strongestAssumptionAtRisk.assumption}</p>
                <p className="text-xs text-ink-secondary">{challengeResult.strongestAssumptionAtRisk.whatIfWrong}</p>
                
                <h3 className="font-semibold text-ink-primary mt-4">Overweighting / Underweighting</h3>
                <p className="text-xs text-ink-secondary"><span className="font-medium">Over:</span> {challengeResult.whatYouMightBeOverweighting}</p>
                <p className="text-xs text-ink-secondary"><span className="font-medium">Under:</span> {challengeResult.whatYouMightBeUnderweighting}</p>
                
                <h3 className="font-semibold text-ink-primary mt-4">Evidence That Could Change Your Mind</h3>
                <ul className="list-disc pl-5 text-xs text-ink-secondary">
                  {challengeResult.evidenceThatCouldChangeYourMind.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                
                <h3 className="font-semibold text-ink-primary mt-4">Final Question</h3>
                <p className="text-sm font-medium text-accent-primary">{challengeResult.finalQuestion}</p>
              </div>
            </section>
          )}

          {/* Argue Result Display */}
          {argueResult && (
            <section className="space-y-4 pt-6 border-t border-border-subtle">
              <h2 className="font-display text-2xl font-semibold text-ink-primary">Argument: {argueResult.side}</h2>
              <div className="bg-glass rounded-xl p-5 space-y-4">
                <p className="text-ink-secondary text-sm"><span className="font-medium">Executive Case:</span> {argueResult.executiveCase}</p>
                
                <h3 className="font-semibold text-ink-primary mt-4">Key Points</h3>
                {argueResult.keyPoints.map((p, i) => (
                  <div key={i} className="mt-2">
                    <p className="font-medium text-ink-primary text-sm">{p.point}</p>
                    <p className="text-xs text-ink-secondary">{p.supportingReasoning}</p>
                  </div>
                ))}
                
                <h3 className="font-semibold text-ink-primary mt-4">Weakest Link</h3>
                <p className="text-xs text-ink-secondary">{argueResult.weakestLink}</p>
                
                <h3 className="font-semibold text-ink-primary mt-4">Reminder</h3>
                <p className="text-sm font-medium text-accent-primary">{argueResult.reminder}</p>
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div className="text-center text-xs text-ink-muted py-4">
            This analysis supports critical thinking. It does not make the decision for you.
          </div>
        </main>
      </div>
    );
  }

  // Show form
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-pattern" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto pt-20 pb-24 px-4">
        <div className="space-y-4 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink-primary">
            Analyze a Decision
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl">
            Tell us about your decision and our AI will help reveal blind spots in your reasoning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Decision */}
          <div className="space-y-2">
            <label htmlFor="decision" className="text-sm font-medium text-ink-secondary block">
              Decision
            </label>
            <textarea
              id="decision"
              value={formData.decision}
              onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
              placeholder="Should I accept this 6-month internship?"
              className="w-full rounded-xl border border-transparent bg-secondary px-6 py-4 text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none"
              rows={2}
            />
          </div>

          {/* Reasoning */}
          <div className="space-y-2">
            <label htmlFor="reasoning" className="text-sm font-medium text-ink-secondary block">
              My reasoning
            </label>
            <textarea
              id="reasoning"
              value={formData.reasoning}
              onChange={(e) => setFormData({ ...formData, reasoning: e.target.value })}
              placeholder="Tell us why you are leaning toward this decision..."
              className="w-full rounded-xl border border-transparent bg-secondary px-6 py-4 text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none"
              rows={5}
            />
          </div>

          {/* Priorities */}
          <div className="space-y-2">
            <label htmlFor="priorities" className="text-sm font-medium text-ink-secondary block">
              What matters most?
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriority(p)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    formData.priorities.includes(p)
                      ? "bg-accent-primary text-white"
                      : "bg-secondary text-ink-secondary hover:bg-accent-primary/10 hover:text-accent-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <label htmlFor="constraints" className="text-sm font-medium text-ink-secondary block">
              Context / constraints (optional)
            </label>
            <textarea
              id="constraints"
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              placeholder="Examples: college schedule, budget, deadlines..."
              className="w-full rounded-xl border border-transparent bg-secondary px-6 py-4 text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none"
              rows={3}
            />
          </div>

          {/* Demo scenarios */}
          <div className="pt-4 border-t border-border-subtle">
            <p className="text-xs text-ink-muted mb-2">Try a demo scenario</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleDemo("internship")} className="px-3 py-1.5 text-xs rounded-full bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20">
                Internship vs Academics
              </button>
              <button type="button" onClick={() => handleDemo("startup")} className="px-3 py-1.5 text-xs rounded-full bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20">
                Startup vs Stable Job
              </button>
              <button type="button" onClick={() => handleDemo("laptop")} className="px-3 py-1.5 text-xs rounded-full bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20">
                Laptop Purchase
              </button>
              <button type="button" onClick={() => handleDemo("career")} className="px-3 py-1.5 text-xs rounded-full bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20">
                Career Paths
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-100/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
          >
            {state === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-pulse w-2 h-2 bg-accent-primary rounded-full" />
                Analyzing your reasoning...
              </span>
            ) : (
              "REVEAL MY BLIND SPOTS"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}