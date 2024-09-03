import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const data = await req.json()
    console.log('Received data:', data)

    const { role, qualifications, difficulty, feedback_score } = data

    let prompt = ''
    if (feedback_score === undefined) {
      prompt = `You are an AI interviewer conducting an interview for the position of ${role}. The candidate has the following qualifications: ${qualifications}. Start with an icebreaker question with a default difficulty of 1.`
    } else {
      let newDifficulty =
        feedback_score <= 4
          ? Math.max(1, difficulty - 1)
          : Math.min(10, difficulty + 1)
      prompt = `The interviewer has rated the response with a score of ${feedback_score}. Generate a ${
        feedback_score <= 4 ? 'easier' : 'tougher'
      } question related to the ${role} position and the candidate's qualifications: ${qualifications}. The next question should be relevant to the role, and the difficulty level is ${newDifficulty}.`
    }

    // Pass prompt in the correct format
       const result = await model.generateContent(prompt)
       const response = await result.response
       const output = await response.text()
       console.log('Generated output:', output)

     return NextResponse.json({ output: output })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
