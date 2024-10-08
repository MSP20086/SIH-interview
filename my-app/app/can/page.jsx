'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button, Link } from '@nextui-org/react'
import { useUser } from '@/app/context/user'
import FeedbackForm from '@/components/feedback-form/page'
import animationDataload from '@/components/lottie/loading.json'
import Lottie from 'lottie-react'
import { toast } from 'react-hot-toast'

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()

  const [meetlink, setMeetLink] = useState('')
  const [showmeetlink, setShowMeetLink] = useState(false)
  const [showFeedbackPage, setShowFeedbackPage] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    skillSets: '',
    resume: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [isUser, setIsUser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const idFromURL = searchParams.get('id')
    if (idFromURL) {
      setFormData((prevFormData) => ({ ...prevFormData, id: idFromURL }))
    }

    if (!user) {
      setLoading(false)
      return
    }

    if (user.role !== 'candidate') {
      router.push('/')
      return
    }

    setIsUser(true)
    setLoading(false)
  }, [searchParams, user, router])

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-100 to-white h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Lottie
            animationData={animationDataload}
            style={{ height: '150px', width: '150px' }}
          />
          <p className="text-gray-800">Loading Interview data...</p>
        </div>
      </section>
    )
  }

  if (!isUser) {
    return (
      <section className='bg-gradient-to-b from-gray-100 to-white h-screen flex items-center justify-center'>
        <p className='text-gray-800'>
          Access denied. You must be a candidate to view this page.
        </p>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      resume: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResponseMessage('')

    const formDataToSend = new FormData()
    formDataToSend.append('id', formData.id)
    formDataToSend.append('name', formData.name)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('skillSets', formData.skillSets)
    if (formData.resume) {
      formDataToSend.append('resume', formData.resume)
    }

    try {
      const response = await fetch('/api/candidate', {
        method: 'PATCH',
        body: formDataToSend,
      })
      const result = await response.json()

      if (response.ok) {
        setResponseMessage('Submission successful')
        setMeetLink(result.interview.HostLink)
        setShowMeetLink(true)
        toast.success('Form submitted successfully! Meet link is ready.')
      } else {
        setResponseMessage(result.error || 'Submission failed')
        toast.error(result.error || 'Submission failed. Please try again.')
      }
    } catch (error) {
      setResponseMessage('An error occurred while submitting the form.')
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showFeedbackPage) return <FeedbackForm />

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

      {/* Right side with instructions and the form */}
      <div className='md:w-1/2 p-10 md:p-20 bg-white shadow-lg rounded-lg md:rounded-none md:rounded-r-lg overflow-y-auto'>
        <h2 className='text-3xl font-bold mb-6 text-gray-800'>
          Welcome to Interview!
        </h2>
        <p className='text-lg mb-6 text-gray-600'>
          Please fill in the form below with your details to proceed:
        </p>
        <ul className='list-disc list-inside text-gray-700 mb-8'>
          <li className='mb-2'>Enter your full name</li>
          <li className='mb-2'>Provide a valid email address</li>
          <li className='mb-2'>List your relevant skill sets</li>
          <li className='mb-2'>Upload your latest resume in PDF format</li>
          <li className='mb-2'>
            Before taking the interview, please go through the FAQs to resolve
            your queries related to the interview or the platform.
          </li>
        </ul>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='name' className='block text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg'
              required
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-gray-700'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg'
              required
            />
          </div>
          <div>
            <label htmlFor='skillSets' className='block text-gray-700'>
              Skill Sets
            </label>
            <textarea
              id='skillSets'
              name='skillSets'
              value={formData.skillSets}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg'
              required
            />
          </div>

          <div>
            <label htmlFor='resume' className='block text-gray-700'>
              Upload Resume
            </label>
            <input
              type='file'
              id='resume'
              name='resume'
              accept='.pdf'
              onChange={handleFileChange}
              className='w-full p-2 border border-gray-300 rounded-lg'
              required
            />
          </div>

          <div>
            <button
              type='submit'
              className={`w-full p-2 rounded-lg font-semibold transition-all duration-300 
                ${isSubmitting
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
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 4.418 3.582 8 8 8v-4.709z'
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

        {showmeetlink && (
          <Button
            as={Link}
            href={meetlink}
            onClick={() => setShowFeedbackPage(true)}
            target='_blank'
            className='w-full mt-4 p-2 rounded-lg font-semibold transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            Join the Interview
          </Button>
        )}
      </div>
    </div>
  )
}
