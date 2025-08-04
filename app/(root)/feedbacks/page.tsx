import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
                Your Interview Feedbacks
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Review your performance and track your progress across all completed interviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {completedInterviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Feedbacks Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Complete your first interview to see your feedback and performance analysis here.
              </p>
              <Link 
                href="/interview"
                className="inline-flex items-center space-x-2 bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Start Your First Interview</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedInterviews.map((interview) => (
                <div key={interview.id} className="bg-white/5 backdrop-blur-lg border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-lime-400/40 transition-all duration-200">
                  {/* Interview Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={getRandomInterviewCover()}
                          alt="Interview Cover"
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                          <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lime-400 capitalize">{interview.role}</h3>
                        <p className="text-sm text-gray-400">{interview.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-900">{interview.feedback?.totalScore}</div>
                      <div className="text-xs text-gray-400">/ 100</div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {interview.feedback?.categoryScores?.slice(0, 4).map((category, index) => (
                        <div key={index} className="bg-zinc-800 rounded-lg p-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400 truncate">{category.name}</span>
                            <span className="text-xs font-bold text-lime-400">{category.score}</span>
                          </div>
                          <div className="w-full bg-zinc-700 rounded-full h-1">
                            <div 
                              className="bg-lime-400 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${category.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="text-xs text-gray-400">
                      {dayjs(interview.feedback?.createdAt).format("MMM D, YYYY")}
                    </div>
                    <Link 
                      href={`/interview/${interview.id}/feedback`}
                      className="bg-lime-400 hover:bg-lime-500 text-black text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
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