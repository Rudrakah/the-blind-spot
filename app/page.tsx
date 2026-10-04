import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-texture">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-pattern" aria-hidden="true" />
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-primary/50 rounded-full blur-3xl opacity-30 animate-float" aria-hidden="true" />
      <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-primary/50 rounded-full blur-3xl opacity-20 animate-float" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/50 rounded-full blur-3xl opacity-20 animate-float" aria-hidden="true" />

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16 text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink-primary">
            THE BLIND SPOT
          </h1>
          <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            "See what your reasoning might be missing."
          </p>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
          An AI-powered critical thinking assistant that challenges assumptions, reveals overlooked factors,
          and helps you examine important decisions from multiple perspectives.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 text-primary text-lg font-semibold hover:bg-primary/10 transition-colors duration-200"
          >
            Analyze a Decision
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-transparent bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors duration-200"
          >
            See How It Works
          </Link>
        </div>

        {/* Visual process */}
        <div className="pt-8 border-t border-border-subtle max-w-3xl mx-auto">
          <p className="text-sm text-ink-muted mb-4">
            Decision → Reasoning → AI Analysis → Blind Spots → Questions → Better Thinking
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary">
                ↓
              </div>
              <span className="text-xs text-ink-muted">Decision</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary">
                ↓
              </div>
              <span className="text-xs text-ink-muted">Reasoning</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary">
                ↓
              </div>
              <span className="text-xs text-ink-muted">AI Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary">
                ↓
              </div>
              <span className="text-xs text-ink-muted">Blind Spots</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary">
                ↓
              </div>
              <span className="text-xs text-ink-muted">Questions</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary">
                ↓
              </div>
              <span className="text-xs text-ink-muted">Better Thinking</span>
            </div>
          </div>
        </div>

        {/* Trust statement */}
        <div className="pt-8 text-center">
          <p className="text-sm text-ink-muted">
            AI-assisted reflection. The final decision is always yours.
          </p>
        </div>
      </div>
    </main>
  );
}