import { NextRequest, NextResponse } from "next/server";
import { argueSide } from "@/lib/ai";
import { InputSchema } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parseResult = InputSchema.safeParse(body);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map(i => i.message).join("; ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    const { side } = body;
    if (side !== "FOR" && side !== "AGAINST") {
      return NextResponse.json({ error: "Side must be 'FOR' or 'AGAINST'" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please set OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const result = await argueSide(parseResult.data, side);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Argue error:", err);

    if (err instanceof Error && err.message.includes("AI service unavailable")) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}