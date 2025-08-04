import Agent from '@/components/Agent'
import InterviewForm from '@/components/InterviewForm'
import React from 'react'
import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400/10 via-black to-lime-400/10 text-white font-mono">
      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
              Generate Your Interview
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Choose your preferred method to create a personalized interview experience.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Interview Form */}
            <div className="bg-gradient-to-br from-lime-400/10 via-black to-lime-400/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-lime-400 mb-2">Form-Based Generation</h2>
                <p className="text-gray-400 text-sm sm:text-base">Fill out the form to create a custom interview tailored to your needs.</p>
              </div>
              <InterviewForm userId={user?.id!} />
            </div>

            {/* AI Voice Agent */}
            <div className="bg-gradient-to-br from-lime-400/10 via-black to-lime-400/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-lime-400 mb-2">AI Voice Generation</h2>
                <p className="text-gray-400 text-sm sm:text-base">Use your voice to generate an interview through conversation with our AI agent.</p>
              </div>
              <Agent type="generate" userName={user?.name!} userId={user?.id!} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live AI Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span>Real-time Feedback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
