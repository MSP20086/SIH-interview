import { connectToDatabase } from '@/lib/mongodb'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try {
        const { interviewID, userEmail } = await req.json();

        if (!interviewID || !userEmail) {
            return NextResponse.json({ error: 'Interview ID and user email are required' }, { status: 400 });
        }

        console.log('Interview ID:', interviewID);
        console.log('User email:', userEmail);

        const { db } = await connectToDatabase();

        const interviewObjectId = ObjectId.isValid(interviewID) ? new ObjectId(interviewID) : interviewID;

        const interview = await db.collection('interviews').findOne({ _id: interviewObjectId });

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        if (interview.email !== userEmail) {
            return NextResponse.json({ error: 'You are not the candidate for this interview' }, { status: 403 });
        }

        return NextResponse.json({ message: 'Interview ID and user validated' }, { status: 200 });

    } catch (error) {
        console.error('Error validating interview ID or user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
