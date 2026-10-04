import { NextRequest, NextResponse } from "next/server";
import { analyzeDecision } from "@/lib/ai";
import { InputSchema } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parseResult = InputSchema.safeParse(body);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map(i => i.message).join("; ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please set OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const result = await analyzeDecision(parseResult.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Analysis error:", err);

    if (err instanceof Error) {
      if (err.message.includes("AI service unavailable")) {
        return NextResponse.json({ error: err.message }, { status: 503 });
      }
      if (err.message.includes("AI response format")) {
        return NextResponse.json({ error: err.message }, { status: 502 });
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}