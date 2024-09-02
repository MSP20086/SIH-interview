'use client'
import { useState } from 'react'

function InterviewPage() {
  const [role, setRole] = useState('Software Engineer')
  const [qualifications, setQualifications] = useState(
    'Python, Java, basic knowledge of machine learning'
  )
  const [difficulty, setDifficulty] = useState(1)
  const [feedbackScore, setFeedbackScore] = useState(undefined)
  const [response, setResponse] = useState('')
  const [totalScore, setTotalScore] = useState(0.0)

  const generateQue = async () => {
    try {
      console.log('Sending request to backend...')
      const res = await fetch('/api/generateQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          qualifications,
          difficulty,
          feedback_score: feedbackScore,
        }),
      })

      // Check if the fetch response is OK
      if (!res.ok) {
        console.error('Failed to fetch question:', res.statusText)
        setResponse('Failed to fetch question')
        return
      }

      const data = await res.json()
      console.log('Response data:', data)

      // Set response content
      setResponse(data.output || 'No question generated')

      // Update total score based on feedback
      if (feedbackScore !== undefined && feedbackScore !== null) {
        setTotalScore(totalScore + feedbackScore * difficulty)
      }
    } catch (error) {
      console.error('Error generating question:', error)
    }
  }

  return (
    <div className='pt-10'>
      <h1>Interview Simulator</h1>
      <p>Current Question: {response || 'No question generated'}</p>
      <button onClick={generateQue}>Start/Next Question</button>

      <div>
        <label>
          Enter Feedback Score (0 to 1):
          <input
            type='number'
            step='0.1'
            min='0'
            max='1'
            value={feedbackScore || ''}
            onChange={(e) => setFeedbackScore(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={generateQue}>Submit Feedback</button>
      </div>

      <p>Total Score: {totalScore.toFixed(2)}</p>
    </div>
  )
}

export default InterviewPage
