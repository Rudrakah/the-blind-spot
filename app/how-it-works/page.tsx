import Link from "next/link";

export default function HowItWorks() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-texture">
      {/* Background elements */}
      <div className="absolute inset-0 bg-pattern" aria-hidden="true" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/70 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/70 rounded-full blur-3xl" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-10 border-b border-border-subtle pb-12">
        <div className="flex items-center gap-4 px-4 pt-12">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors"
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Back
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink-primary">
            HOW IT WORKS
          </h1>
        </div>
        <p className="text-center text-sm text-ink-muted max-w-2xl mx-auto">
          Turn your decision into better thinking with AI-powered analysis.
        </p>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
        {/* Visual process */}
        <div className="space-y-12 pt-6">
          {/* Decision step */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-accent-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-accent-primary font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink-primary mb-2">Describe Your Decision</h3>
              <p className="text-ink-secondary">
                Clearly state what you're trying to decide. Be specific about the options and context.
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Example: "Should I accept a 6-month internship offer at this tech company?"
              </p>
            </div>
          </div>

          {/* Reasoning step */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-accent-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-accent-primary font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink-primary mb-2">Share Your Reasoning</h3>
              <p className="text-ink-secondary">
                Explain why you're leaning toward a particular choice. Include your priorities, assumptions, and any concerns.
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Example: "I want the experience and the pay is good, but I'm worried about how it affects my studies."
              </p>
            </div>
          </div>

          {/* AI Analysis step */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-accent-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-accent-primary font-bold text-xl">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink-primary mb-2">AI Analysis</h3>
              <p className="text-ink-secondary">
                Our reasoning engine examines your input from multiple angles, identifying blind spots, assumptions, and missing information.
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                It never tells you what to choose — it helps you see what you might be overlooking.
              </p>
            </div>
          </div>

          {/* Results step */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-accent-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-accent-primary font-bold text-xl">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink-primary mb-2">Explore Your Blind Spots</h3>
              <p className="text-ink-secondary">
                Review the structured analysis: hidden assumptions, opportunity costs, counter-arguments, and critical questions to consider.
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Use this insight to make a more informed decision — the final choice remains yours.
              </p>
            </div>
          </div>
        </div>

        {/* Key features */}
        <section className="mt-16 pt-8 border-t border-border-subtle">
          <h2 className="font-display text-2xl font-bold text-ink-primary text-center mb-8">
            KEY FEATURES
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-glass rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-xl text-ink-primary">Critical Thinking Focus</h3>
              <p className="text-ink-secondary">
                Unlike chatbots that give advice, THE BLIND SPOT helps you improve your own reasoning process by revealing what you might be missing.
              </p>
            </div>
            <div className="bg-glass rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-xl text-ink-primary">Structured Analysis</h3>
              <p className="text-ink-secondary">
                Results are organized into clear sections: blind spots, assumptions, missing information, opportunity costs, and more — making insights actionable.
              </p>
            </div>
            <div className="bg-glass rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-xl text-ink-primary">Reasoning Exercises</h3>
              <p className="text-ink-secondary">
                Challenge your thinking with "For/Against" arguments and critical questions designed to stress-test your assumptions from multiple perspectives.
              </p>
            </div>
            <div className="bg-glass rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-xl text-ink-primary">Privacy First</h3>
              <p className="text-ink-secondary">
                Your decision data stays private. Analysis happens server-side with no storage of personal information or decision history.
              </p>
            </div>
          </div>
        </section>

        {/* Trust statement */}
        <div className="mt-16 text-center py-8 border-t border-border-subtle">
          <p className="text-lg text-ink-primary font-semibold">
            THE BLIND SPOT does not make decisions for you.
          </p>
          <p className="text-sm text-ink-muted mt-2">
            It helps you see what your reasoning might be missing so you can think more clearly and choose with greater confidence.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-subtle px-4 py-8 text-xs text-ink-muted">
        <p className="text-center">
          This analysis supports critical thinking. It does not make the decision for you.
        </p>
      </footer>
    </main>
  );
}