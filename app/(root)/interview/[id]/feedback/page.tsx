import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  if (!feedback) {
    redirect(`/interview/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
            Interview Feedback
          </h1>
          <p className="text-xl text-gray-400">
            {interview.role} Interview Results
          </p>
        </div>

        {/* If feedback is based on a dummy message, show a special message */}
        {(feedback.strengths?.length === 1 && feedback.strengths[0] === "No answers provided.") || 
         (feedback.strengths?.length === 1 && feedback.strengths[0] === "Interview ended without responses.") ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8 text-yellow-300 text-center">
            <h2 className="text-2xl font-bold mb-2">No Answers Provided</h2>
            <p>The interview was ended before any answers were given. No feedback is available.</p>
          </div>
        ) : null}

        {/* Score Card */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{feedback.totalScore}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-lime-400">Overall Score</h2>
                <p className="text-gray-400">out of 100</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Completed on</p>
              <p className="text-purple-800 font-semibold">
                {dayjs(feedback.createdAt).format("MMM D, YYYY")}
              </p>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-lime-400 mb-6">Performance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedback.categoryScores?.map((category, index) => (
              <div key={index} className="bg-gray-700/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lime-400">{category.name}</h4>
                  <span className="text-2xl font-bold text-purple-800">{category.score}</span>
                </div>
                <p className="text-gray-300 text-sm">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-lime-400 mb-6 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Strengths
          </h3>
          <ul className="space-y-3">
            {feedback.strengths?.map((strength, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {feedback.areasForImprovement?.map((area, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span className="text-gray-300">{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Final Assessment */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-lime-400 mb-6">Final Assessment</h3>
          <p className="text-gray-300 leading-relaxed">{feedback.finalAssessment}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 bg-gray-700 hover:bg-gray-600 text-white hover:text-lime-400">
            <Link href="/">
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span>Back to Dashboard</span>
              </span>
            </Link>
          </Button>

          <Button asChild className="flex-1 bg-gradient-to-r from-lime-400 to-lime-400 hover:from-lime-600 hover:to-lime-700 text-black font-bold">
            <Link href={`/interview/${id}`}>
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Retake Interview</span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;