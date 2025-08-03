"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      // Check if VAPI token is configured
      if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
        throw new Error("VAPI token is not configured");
      }

      // Check microphone permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log("Microphone permission granted");
      } catch (micError) {
        console.error("Microphone permission denied:", micError);
        throw new Error("Microphone access is required for the interview");
      }

      // Add a small delay to ensure VAPI is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      if (type === "generate") {
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (!workflowId) {
          throw new Error("VAPI workflow ID is not configured");
        }
        
        console.log("Starting generate call with workflow ID:", workflowId);
        console.log("VAPI instance:", vapi);
        
        // Try without additional parameters
        await vapi.start(workflowId);
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        console.log("Starting interview call with questions:", formattedQuestions);
        console.log("Interviewer config:", interviewer);
        
        // Try without additional parameters
        await vapi.start(interviewer);
      }
    } catch (error) {
      console.error("Error starting VAPI call:", error);
      console.error("Error details:", {
        type,
        userName,
        userId,
        hasToken: !!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN,
        hasWorkflowId: !!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
        questions: questions?.length || 0,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      });
      setCallStatus(CallStatus.INACTIVE);
      
      // Show user-friendly error message
      alert(`Failed to start interview: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your microphone permissions and try again.`);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Call Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* AI Interviewer Card */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 group">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600  rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
              {isSpeaking && (
                <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-pulse"></div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              AI Interviewer
            </h3>
            <p className="text-gray-400 text-sm">
              {isSpeaking ? "Speaking..." : "Ready to interview"}
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 group">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-400 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-gray-800"></div>
            </div>
            <h3 className="text-2xl font-bold text-white bg-clip-text mb-2">
              {userName}
            </h3>
            <p className="text-gray-400 text-sm">
              {callStatus === "ACTIVE" ? "In Interview" : "Ready to start"}
            </p>
          </div>
        </div>
      </div>

      {/* Transcript Section */}
      {messages.length > 0 && (
        <div className="mb-8">
          <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Live Transcript</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live</span>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
              <p
                key={lastMessage}
                className={cn(
                  "text-gray-300 leading-relaxed transition-all duration-500",
                  "animate-fadeIn"
                )}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button 
            className="relative group bg-gradient-to-r from-green-600 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            <span
              className={cn(
                "absolute inset-0 rounded-2xl bg-white/20 animate-ping",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative flex items-center space-x-2">
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>Start Interview</span>
                </>
              ) : (
                <>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>Connecting...</span>
                </>
              )}
            </span>
          </button>
        ) : (
          <button 
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center space-x-2"
            onClick={() => handleDisconnect()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span>End Interview</span>
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              callStatus === "ACTIVE" ? "bg-green-400 animate-pulse" : "bg-gray-400"
            )}></div>
            <span>{callStatus === "ACTIVE" ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;