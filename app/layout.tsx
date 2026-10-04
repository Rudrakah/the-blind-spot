import "./globals.css";

export const metadata = {
  title: "THE BLIND SPOT · AI Reasoning Debugger",
  description: "See what your reasoning might be missing. An AI-powered critical thinking assistant that challenges assumptions, reveals overlooked factors, and helps you examine important decisions from multiple perspectives.",
  keywords: "AI, critical thinking, decision analysis, blind spots, reasoning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700 800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-texture text-ink transition-colors duration-300">
        <div className="relative min-h-screen bg-background">
          {children}
        </div>
        <div id="portal" />
      </body>
    </html>
  );
}