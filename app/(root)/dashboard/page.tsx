import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";

const Dashboard = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const userInterviews = await getInterviewsByUserId(user.id);
  const availableInterviews = await getLatestInterviews({
    userId: user.id,
    limit: 6,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400/10 via-black to-lime-400/10 text-white font-mono">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      {/* Header */}
      <div className="  relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed whitespace-nowrap">
            Ready to stop winging it and actually ace your next interview? <br/> Let’s get that brain sweating with some AI-powered prep.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link href="/interview">
              <Button className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Generate New Interview
              </Button>
            </Link>
            <Link href="/feedbacks">
              <Button variant="outline" className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-white font-bold py-3 px-8 rounded-xl transition-all duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                View Feedbacks
              </Button>
            </Link>
          </div>

          {/* Your Interviews Section */}
          <section className="py-12 px-4 md:px-10 bg-gradient-to-br from-lime-400/10 via-black to-lime-400/20 min-h-[60vh] rounded-3xl shadow-xl mt-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-extrabold text-lime-400 mb-2">Your Interviews</h2>
              <p className="text-gray-300 mb-8">Practice, review, and improve with your past interviews.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 interviews-section">
                {userInterviews && userInterviews.length > 0 ? (
                  userInterviews.map((interview) => (
                    <InterviewCard 
                      key={interview.id} 
                      interviewId={interview.id}
                      userId={interview.userId}
                      role={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      createdAt={interview.createdAt}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Interviews Yet</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Start your interview journey by creating your first practice session.
                    </p>
                    <Link href="/interview">
                      <Button className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                        Create Your First Interview
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Available Interviews Section */}
          <section className="py-12 px-4 md:px-10 bg-gradient-to-br from-lime-400/10 via-black to-lime-400/20 min-h-[60vh] rounded-3xl shadow-xl mt-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-extrabold text-lime-400 mb-2">Take Interviews</h2>
              <p className="text-gray-300 mb-8">Explore and practice with various interview scenarios.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 interviews-section">
                {availableInterviews && availableInterviews.length > 0 ? (
                  availableInterviews.map((interview) => (
                    <InterviewCard 
                      key={interview.id} 
                      interviewId={interview.id}
                      userId={interview.userId}
                      role={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      createdAt={interview.createdAt}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Available Interviews</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Check back later for new interview opportunities or create your own custom interview.
                    </p>
                    <Link href="/interview">
                      <Button className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                        Create Custom Interview
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <span>AI-Powered Practice</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span>Real-time Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Performance Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
