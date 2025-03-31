import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        // Parse the request body
        const { interviewId, questions, totalScore, maxScore, status } = await req.json();

        if (!interviewId) {
            return NextResponse.json({ message: "Interview ID is required" }, { status: 400 });
        }

        // Connect to the database
        const { db } = await connectToDatabase();

        // Update the interview in the database
        const result = await db.collection("interviews").updateOne(
            { _id: new ObjectId(interviewId) },
            {
                $set: {
                    questions,
                    totalScore,
                    maxScore,
                    status,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Interview not found" }, { status: 404 });
        }

        // Respond with a success message
        return NextResponse.json({ message: "Interview updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating interview:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}