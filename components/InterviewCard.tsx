import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="group relative w-[360px] max-sm:w-full min-h-96 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          {/* Type Badge */}
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold",
            {
              "bg-blue-500/20 text-blue-400 border border-blue-500/30": normalizedType === "Technical",
              "bg-purple-500/20 text-purple-400 border border-purple-500/30": normalizedType === "Mixed",
              "bg-green-500/20 text-green-400 border border-green-500/30": normalizedType === "Behavioral",
            }
          )}>
            {normalizedType}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              feedback ? "bg-green-400" : "bg-gray-400"
            )}></div>
            <span className="text-xs text-gray-400">
              {feedback ? "Completed" : "Pending"}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={48}
              height={48}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-gray-800"></div>
        </div>

        {/* Interview Role */}
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {role} Interview
        </h3>

        {/* Date & Score */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-sm font-bold text-white">
                {feedback?.totalScore || "---"}/100
              </span>
            </div>
          </div>
        </div>

        {/* Feedback or Placeholder Text */}
        <div className="flex-1 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills and get personalized feedback."}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <DisplayTechIcons techStack={techstack} />
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            href={
              feedback
                ? `/interview/${interviewId}/feedback`
                : `/interview/${interviewId}`
            }
            className="block w-full"
          >
            <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2">
              <span>{feedback ? "Check Feedback" : "Start Interview"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;