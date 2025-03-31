import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const interviewId = searchParams.get('interviewId'); // Correct way to extract in Next.js 13
        console.log('Interview ID: ', interviewId);

        const { db } = await connectToDatabase();

        if (!ObjectId.isValid(interviewId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const interview = await db.collection('interviews').findOne({ _id: new ObjectId(interviewId) });

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        return NextResponse.json(interview, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: e.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Export other methods if needed (e.g., POST, PUT, DELETE) with similar structure
