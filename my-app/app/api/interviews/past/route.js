import { connectToDatabase } from '@/lib/mongodb'

export async function GET(req) {
  try {
    const currentUserId = req.headers.get('userid')

    if (!currentUserId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
      })
    }

    const { db } = await connectToDatabase()
    const filter = { status: { $ne: 'pending' }, expertId: currentUserId }
    const candidates = await db.collection('interviews').find(filter).toArray()

    return new Response(
      JSON.stringify({
        message: 'Past interviews fetched successfully',
        candidates,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching past interviews:', error)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
