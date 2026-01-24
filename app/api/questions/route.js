// app/api/questions/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// POST: save questions array for an interviewId
export async function POST(req) {
  try {
    const { interviewId, questions } = await req.json();
    if (!interviewId || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Missing interviewId or questions" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // sanitize questions: only keep question, response, rating
    const sanitized = questions.map((q) => ({
      question: String(q.question ?? ""),
      response: String(q.response ?? ""),
      rating: Number(q.rating ?? 0),
    }));

    const result = await db.collection("questions").updateOne(
      { interviewId },
      { $set: { questions: sanitized, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (err) {
    console.error("questions POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: return questions array for an interviewId
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const interviewId = url.searchParams.get("interviewId");
    if (!interviewId) {
      return NextResponse.json({ error: "Missing interviewId" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const doc = await db.collection("questions").findOne({ interviewId });
    return NextResponse.json({ questions: doc?.questions || [] }, { status: 200 });
  } catch (err) {
    console.error("questions GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
