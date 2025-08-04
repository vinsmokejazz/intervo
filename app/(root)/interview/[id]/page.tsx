import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Logo and Title */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Interview Session
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Side by Side Layout */}
      <main className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Side - Compact Interview Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl h-fit sticky top-6">
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Cover Image */}
                  <div className="relative">
                    <Image
                      src={getRandomInterviewCover()}
                      alt="Interview Cover"
                      width={60}
                      height={60}
                      className="rounded-xl object-cover w-15 h-15 shadow-md"
                      unoptimized
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-lime-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Role and Type */}
                  <div>
                    <h2 className="text-lg font-bold text-white mb-2 capitalize">
                      {interview.role} Interview
                    </h2>
                    <div className="flex flex-col items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-lime-400/10 text-lime-400 border border-lime-400/30">
                        {interview.type}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400">Live</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="w-full">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 text-center">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <DisplayTechIcons techStack={interview.techstack} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Main Agent Component */}
            <div className="lg:col-span-3">
              <div className="w-full bg-gray-800/30 backdrop-blur-sm border border-lime-400/30 rounded-2xl p-8 shadow-2xl">
                <Agent
                  userName={user?.name!}
                  userId={user?.id!}
                  interviewId={id}
                  type="interview"
                  questions={interview.questions}
                  feedbackId={feedback?.id}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                <span>AI-Powered Interview</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure & Private</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <div className="w-5 h-5 bg-lime-400 rounded flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-lime-400">Intervo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewDetails;
