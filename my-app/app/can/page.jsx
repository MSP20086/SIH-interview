'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    skillSets: '',
    resume: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const idFromURL = searchParams.get('id');  // Get the 'id' parameter from the URL
    if (idFromURL) {
      setFormData((prevFormData) => ({ ...prevFormData, id: idFromURL }));
    }
  }, [searchParams]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage('');
    console.log(formData);
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('skillSets', formData.skillSets);
    if (formData.resume) {
      formDataToSend.append('resume', formData.resume);
    }

    try {
      const response = await fetch('/api/candidate', {
        method: 'PATCH',
        body: formDataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        setResponseMessage(`Submission successful`);
      } else {
        setResponseMessage(result.error || 'Submission failed');
      }
    } catch (error) {
      setResponseMessage('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen pt-16 md:pt-20 bg-gray-50 overflow-y-auto">
      {/* Left side with a welcome message and decorative elements */}
      <div className="md:w-1/2 p-8 md:p-16 bg-indigo-600 text-white shadow-lg rounded-lg md:rounded-none md:rounded-l-lg flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-4">Interview Portal</h1>
          <p className="text-lg mb-6">Join us to take the next step in your career!</p>
          <div className="bg-white text-indigo-600 font-bold rounded-full px-6 py-2 inline-block">
            <p>FAQ</p>
          </div>
        </div>
      </div>

      {/* Right side with instructions and the form */}
      <div className="md:w-1/2 p-10 md:p-20 bg-white shadow-lg rounded-lg md:rounded-none md:rounded-r-lg overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Interview!</h2>
        <p className="text-lg mb-6 text-gray-600">Please fill in the form below with your details to proceed:</p>
        <ul className="list-disc list-inside text-gray-700 mb-8">
          <li className="mb-2">Enter your full name</li>
          <li className="mb-2">Provide a valid email address</li>
          <li className="mb-2">List your relevant skill sets</li>
          <li className="mb-2">Upload your latest resume in PDF format</li>
          <li className="mb-2">Before taking the interview, please go through the FAQs to resolve your queries related to the interview or the platform.</li>
        </ul>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="skillSets" className="block text-gray-700">Skill Sets</label>
            <textarea
              id="skillSets"
              name="skillSets"
              value={formData.skillSets}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="resume" className="block text-gray-700">Upload Resume</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className={`w-full p-2 rounded-lg font-semibold transition-all duration-300 
      ${isSubmitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 014 12z"></path>
                    </svg>
                    Submitting...
                  </span>
                )
                : 'Submit'
              }
            </button>
          </div>

          {responseMessage && (
            <div className="text-center mt-4">
              <p className={`text - lg ${responseMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                {responseMessage}
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500 text-center mt-3">
            By submitting, you agree to the <a className="underline" href="#0">terms & conditions</a>, and our <a className="underline" href="#0">privacy policy</a>.
          </div>
        </form>
      </div>
    </div>
  );
}
