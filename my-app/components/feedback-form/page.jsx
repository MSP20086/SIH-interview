'use client'

import { useState } from 'react'
import { Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export default function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const [questionRelevance, setQuestionRelevance] = useState(0)
  const [difficultyLevel, setDifficultyLevel] = useState(0)
  const [questionClarity, setQuestionClarity] = useState(0)
  const [expertFeedback, setExpertFeedback] = useState(0)
  const [recommendation, setRecommendation] = useState(0)
  const [questionsFeedback, setQuestionsFeedback] = useState('')
  const [improvements, setImprovements] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    setIsSubmitting(true)

    const feedbackData = []
    feedbackData.push({ rating: rating })
    feedbackData.push({ questionRelevance: questionRelevance })
    feedbackData.push({ difficultyLevel: difficultyLevel })
    feedbackData.push({ questionClarity: questionClarity })
    feedbackData.push({ expertFeedback: expertFeedback })
    feedbackData.push({ recommendation: recommendation })
    feedbackData.push({ questionsFeedback: questionsFeedback })
    feedbackData.push({ improvements: improvements })

    // console logging for now
    console.log(feedbackData)
    setIsSubmitting(false)
    router.push('/')
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen md:h-screen pt-16 md:pt-20 bg-gray-50 overflow-y-auto'>
      {/* Left side with a welcome message and decorative elements */}
      <div className='md:w-1/2 p-8 md:p-16 bg-indigo-600 text-white shadow-lg rounded-lg md:rounded-none md:rounded-l-lg flex flex-col justify-center items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold mb-4'>Interview Portal</h1>
          <p className='text-lg mb-6'>
            Join us to take the next step in your career!
          </p>
          <div className='bg-white text-indigo-600 font-bold rounded-full px-6 py-2 inline-block'>
            <p>FAQ</p>
          </div>
        </div>
      </div>

      {/* Right side with feedback form */}
      <div className='md:w-1/2 p-10 md:p-20 bg-white shadow-lg rounded-lg md:rounded-none md:rounded-r-lg overflow-y-auto'>
        <h2 className='text-3xl font-bold mb-6 text-gray-800'>
          We would love to hear your thoughts, suggestions, concerns or problems
          with anything so we can improve!
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='overall-experience'>
              How would you rate your overall experience with the interview
              process? <span className='text-red-500'>*</span>
            </label>
            <div
              id='overall-experience'
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
              required
            >
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setRating(index + 1)}
                  style={{
                    cursor: 'pointer',
                    color: rating > index ? '#ffd700' : '#ccc',
                    fontSize: '30px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='question-relevance'>
              How relevant were the questions to your skillset and experience as
              mentioned in your resume? <span className='text-red-500'>*</span>
            </label>
            <div
              id='question-relevance'
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
              required
            >
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setQuestionRelevance(index + 1)}
                  style={{
                    cursor: 'pointer',
                    color: questionRelevance > index ? '#ffd700' : '#ccc',
                    fontSize: '30px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='difficulty-level'>
              How would you rate the difficulty level of the questions?{' '}
              <span className='text-red-500'>*</span>
            </label>
            <div
              id='difficulty-level'
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
              required
            >
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setDifficultyLevel(index + 1)}
                  style={{
                    cursor: 'pointer',
                    color: difficultyLevel > index ? '#ffd700' : '#ccc',
                    fontSize: '30px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='question-clarity'>
              How clear and understandable were the questions posed during the
              interview? <span className='text-red-500'>*</span>
            </label>
            <div
              id='question-clarity'
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
              required
            >
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setQuestionClarity(index + 1)}
                  style={{
                    cursor: 'pointer',
                    color: questionClarity > index ? '#ffd700' : '#ccc',
                    fontSize: '30px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor='questions-feedback'
              style={{ marginBottom: '10px' }}
            >
              Please provide specific feedback on any question(s) that you felt
              were not relevant to your skills.{' '}
              <span className='text-red-500'>*</span>
            </label>
            <Textarea
              placeholder='Enter your feedback'
              onChange={(e) => setQuestionsFeedback(e.target.value)}
              className='max-w-xs'
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='expert-feedback'>
              How would you rate your interaction with the expert?{' '}
              <span className='text-red-500'>*</span>
            </label>
            <div
              id='expert-feedback'
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
              required
            >
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setExpertFeedback(index + 1)}
                  style={{
                    cursor: 'pointer',
                    color: expertFeedback > index ? '#ffd700' : '#ccc',
                    fontSize: '30px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='improvements' style={{ marginBottom: '10px' }}>
              Do you have any suggestions for improving the interview process or
              the questions generated? <span className='text-red-500'>*</span>
            </label>
            <Textarea
              placeholder='Enter your feedback'
              onChange={(e) => setImprovements(e.target.value)}
              className='max-w-xs'
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='recommendation'>
              How likely are you to recommend this interview simulator to others
              applying for similar roles?{' '}
              <span className='text-red-500'>*</span>
            </label>
            <div
              id='recommendation'
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
              required
            >
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setRecommendation(index + 1)}
                  style={{
                    cursor: 'pointer',
                    color: recommendation > index ? '#ffd700' : '#ccc',
                    fontSize: '30px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div>
            <button
              type='submit'
              className={`w-full p-2 rounded-lg font-semibold transition-all duration-300 
                ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 mr-2 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 1116 0A8 8 0 014 12z'
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
