import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation';
import Link from 'next/link'
import React, { ReactNode } from 'react'
import ScrollNavbar from '@/components/ScrollNavbar'
import UserAvatar from '@/components/UserAvatar'



const Rootlayout = async ({children}:{children:ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated) redirect('/sign-in');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      {/* Enhanced Navbar - Fixed with Scroll Effects */}
      <ScrollNavbar>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo and Brand */}
            <Link href='/dashboard' className="flex items-center space-x-4 group flex-shrink-0">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#03A062] rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-lime-500 leading-tight">
                  InterVo
                </h1>
                <p className="text-gray-400 text-xs leading-tight">AI-Powered Interviews</p>
              </div>
            </Link>

            {/* Navigation Links - Centered */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-8">
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-lime-400 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/interview" 
                  className="text-gray-300 hover:text-lime-400 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50"
                >
                  Generate Interview
                </Link>
                <Link 
                  href="/feedbacks" 
                  className="text-gray-300 hover:text-lime-400 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50"
                >
                  Feedbacks
                </Link>
              </div>
            </div>

            {/* User Status - Right Aligned */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-[#03A062] rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>
              
              {/* User Avatar with Logout */}
              <UserAvatar />
            </div>
          </div>
        </div>
      </ScrollNavbar>

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        {children}
      </main>
    </div>
  )
}

export default Rootlayout
