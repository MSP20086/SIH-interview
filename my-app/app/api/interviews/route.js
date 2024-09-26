import { connectToDatabase } from '@/lib/mongodb';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { name, email, jobPosition, interviewTime, HostLink, candidateLink, interviewLink, skillSets, resumeLink, expertId } = await req.json();

    if (!name || !email || !jobPosition || !interviewTime || !HostLink || !candidateLink || !expertId) {
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
      interviewLink,
      skillSets,
      resumeLink,
      expertId,
      status: 'pending',
      createdAt: new Date(),
    });

    const newInterview = await db.collection('interviews').findOne({ _id: result.insertedId });

    return new Response(JSON.stringify({ message: 'Interview created successfully', interview: newInterview }), { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Extract the expertId from the request URL query parameters
    const url = new URL(req.url)
    const expertId = url.searchParams.get('userid')

    if (!expertId) {
      return new Response(JSON.stringify({ message: 'expertId is required' }), {
        status: 400,
      })
    }

    const { db } = await connectToDatabase()

    // Find all users with the given expertId
    const users = await db.collection('interviews').find({ expertId }).toArray()

    return new Response(
      JSON.stringify({ message: 'Users fetched successfully', users }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    })
  }
}