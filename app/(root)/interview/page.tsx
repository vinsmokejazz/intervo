import Agent from '@/components/Agent'
import InterviewForm from '@/components/InterviewForm'
import React from 'react'
import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Header Content */}
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
                AI Interview Generation
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Experience the future of interviewing with our advanced AI. 
                Get real-time feedback, insights, and maybe even a virtual pat on the back.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
        
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Interview Form */}
            <div>
              <InterviewForm userId={user?.id!} />
            </div>

            {/* Agent Component */}
            <div>
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
                <Agent
                  userName={user?.name!}
                  userId={user?.id!}
                  type="generate"
                />
              </div>
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
