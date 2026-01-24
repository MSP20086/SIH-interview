import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Binary } from "mongodb";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("resume");
    const interviewId = data.get("interviewId");

    if (!file || !interviewId) {
      return NextResponse.json(
        { error: "Missing resume or interviewId" },
        { status: 400 }
      );
    }

    const filename = file.name || "resume.pdf";
    const contentType = file.type || "application/pdf";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { db } = await connectToDatabase();

    await db.collection("resumes").updateOne(
      { interviewId },
      {
        $set: {
          filename,
          contentType,
          data: buffer,
          uploadedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Resume uploaded successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const interviewId = url.searchParams.get("interviewId");

    if (!interviewId) {
      return NextResponse.json(
        { error: "Missing interviewId" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const doc = await db.collection("resumes").findOne({ interviewId });

    // If the client asked only for metadata (meta=true), return JSON instead of the binary file
    const meta = url.searchParams.get('meta');
    if (meta === 'true') {
      if (!doc) {
        return NextResponse.json({ exists: false }, { status: 200 });
      }
      return NextResponse.json(
        {
          exists: true,
          filename: doc.filename || null,
          contentType: doc.contentType || null,
        },
        { status: 200 }
      );
    }

    if (!doc) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    let fileData = doc.data;

    if (fileData instanceof Binary) {
      fileData = fileData.buffer;
    }

    if (!fileData) {
      return NextResponse.json(
        { error: "Invalid stored file format" },
        { status: 500 }
      );
    }

    return new Response(fileData, {
      status: 200,
      headers: {
        "Content-Type": doc.contentType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
          doc.filename
        )}`,
        "Content-Length": String(fileData.length),
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
