import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs"; // make sure this route uses Node

export async function POST(req) {
  try {
    const { interviewId } = await req.json();
    if (!interviewId)
      return NextResponse.json(
        { error: "Missing interviewId" },
        { status: 400 }
      );

    // Instead of reading actual resume, we hardcode the text:
    const resumeText = `
This is a test resume replacement.
Generate interview questions about:
- Next.js (routing, rendering, API routes, server components, RSC, build pipeline)
- HTTP protocol (status codes, headers, methods, caching, cookies, sessions)
`;

    const apiKey =
      process.env.GENAI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Generate 10 interview questions related to Next.js and the HTTP protocol.
Questions must be sorted from easy → medium → hard.
Return ONLY a JSON array of objects: 
[
  { "question": "...", "difficulty": "easy" | "medium" | "hard" }
]

Use the following context:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response?.text;
    if (!rawText)
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 500 }
      );

    let questions;
    try {
      questions = JSON.parse(rawText);
    } catch {
      // Debug output for malformed JSON
      return NextResponse.json({ raw: rawText }, { status: 200 });
    }

    const order = { easy: 0, medium: 1, hard: 2 };
    const sorted = questions
      .map((q) => ({
        question: String(q.question || ""),
        difficulty: String(q.difficulty || "").toLowerCase(),
        response: "",
        rating: 0,
      }))
      .sort(
        (a, b) => (order[a.difficulty] ?? 99) - (order[b.difficulty] ?? 99)
      );

    return NextResponse.json({ ok: true, questions: sorted }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const interviewId = url.searchParams.get("interviewId");
  if (!interviewId)
    return NextResponse.json({ error: "Missing interviewId" }, { status: 400 });

  const { db } = await connectToDatabase();
  const doc = await db.collection("questions").findOne({ interviewId });
  return NextResponse.json(
    { questions: doc?.questions || [] },
    { status: 200 }
  );
}
