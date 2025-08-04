import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FeedbacksPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // Get all interviews for the current user
  const interviews = await getInterviewsByUserId(user.id);
  
  // Get feedback for each interview
  const interviewsWithFeedback = await Promise.all(
    (interviews || []).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id,
      });
      return { ...interview, feedback };
    })
  );

  // Filter only interviews with feedback
  const completedInterviews = interviewsWithFeedback.filter(interview => interview.feedback);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400/10 via-black to-lime-400/10 text-white font-mono">
      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
              Your Interview Feedbacks
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Relive the glory, the goofs, and the “why did I say that?” moments.
            Track your progress!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          {interviewsWithFeedback.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {interviewsWithFeedback.map((interview) => (
                <div key={interview.id} className="bg-gradient-to-br from-lime-400/10 via-black to-lime-400/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-lime-400 capitalize">{interview.role}</h3>
                        <p className="text-sm sm:text-base text-gray-400">{interview.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-lime-400 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-black">
                          {interview.feedback?.totalScore || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex flex-wrap gap-2">
                      {interview.techstack.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="bg-lime-400/20 text-lime-400 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {interview.techstack.length > 3 && (
                        <span className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium">
                          +{interview.techstack.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                    <span>{dayjs(interview.createdAt).format("MMM DD, YYYY")}</span>
                    <span className="text-lime-400 font-medium">Completed</span>
                  </div>

                  <Link href={`/interview/${interview.id}/feedback`} className="w-full">
                    <Button className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200">
                      View Feedback
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">No Completed Interviews</h3>
              <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Complete your first interview to see feedback and track your progress.
              </p>
              <Link href="/interview">
                <Button className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                  Start Your First Interview
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <span>{completedInterviews.length} Completed Interviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span>Performance Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>AI Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbacksPage; 