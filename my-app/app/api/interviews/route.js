import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
    try {
        const { name, email, jobPosition, interviewTime, HostLink, candidateLink } = await req.json();

        if (!name || !email || !jobPosition || !interviewTime || !HostLink || !candidateLink) {
            return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
        }

        const { db } = await connectToDatabase();

        const result = await db.collection('interviews').insertOne({
            name,
            email,
            jobPosition,
            interviewTime,
            HostLink,
            candidateLink,
            createdAt: new Date(),
        });

        const newInterview = await db.collection('interviews').findOne({ _id: result.insertedId });

        return new Response(JSON.stringify({ message: 'Interview created successfully', interview: newInterview }), { status: 201 });
    } catch (error) {
        console.error('Error creating interview:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
