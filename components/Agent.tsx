"use client";

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

interface AgentProps {
  userName: string;
  userId: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
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
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [...prev, { role: message.role, content: message.transcript }]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("Error:", error);

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
  }, [messages]);

  const handleGenerateFeedback = async () => {
    if (!interviewId || feedbackGenerated || isGeneratingFeedback) return;
    
    setIsGeneratingFeedback(true);
    
    try {
      // Ensure we have at least one message for feedback generation
      const transcriptToUse = messages.length > 0 ? messages : [{ role: "user", content: "Interview ended without responses." }];
      
      const { success, feedbackId: newFeedbackId } = await createFeedback({
        interviewId: interviewId,
        userId: userId,
        transcript: transcriptToUse,
        feedbackId,
      });

      if (success && newFeedbackId) {
        setFeedbackGenerated(true);
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error("Failed to generate feedback");
        alert("Failed to generate feedback. Please check your Google AI API key configuration.");
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
      alert("Error generating feedback. Please try again or check your configuration.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      const formattedQuestions = questions?.map((q) => `- ${q}`).join("\n") || "";
      await vapi.start(interviewer, {
        variableValues: { questions: formattedQuestions },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* AI Interviewer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center transition-all duration-200 hover:border-lime-400/40">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-lime-400 rounded-2xl flex items-center justify-center shadow-md">
              {/* Custom AI Robot Icon */}
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
              {isSpeaking && <span className="absolute inset-0 rounded-2xl bg-lime-400/20 animate-ping" />}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-lime-400 tracking-tight mb-1">AI Interviewer</h3>
          <p className="text-gray-400 text-sm animate-fadeIn">{isSpeaking ? "Speaking..." : "Ready to interview"}</p>
        </div>

        {/* User */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center transition-all duration-200 hover:border-lime-400/40">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-zinc-700 rounded-2xl flex items-center justify-center">
              {/* Custom User Icon */}
              <svg className="w-12 h-12 text-lime-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-lime-400 tracking-tight mb-1">{userName}</h3>
          <p className="text-gray-400 text-sm animate-fadeIn">
            {callStatus === "ACTIVE" ? "In Interview" : "Ready to start"}
          </p>
        </div>
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="mb-10">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Live Transcript</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live</span>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto scroll-smooth transition-all">
              <p key={lastMessage} className="text-gray-300 leading-relaxed animate-fadeIn">
                {lastMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex justify-center mb-6">
        {callStatus !== "ACTIVE" ? (
          <button
            onClick={handleCall}
            disabled={callStatus === "CONNECTING"}
            className="relative group bg-lime-400 hover:bg-lime-500 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Start</span>
                </>
              ) : (
                <>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span>Connecting...</span>
                </>
              )}
            </span>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>End</span>
          </button>
        )}
      </div>

      {/* Feedback Button - Only show after interview ends */}
      {callStatus === "FINISHED" && type === "interview" && interviewId && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateFeedback}
            disabled={feedbackGenerated || isGeneratingFeedback}
            className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingFeedback ? (
              <>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200"></div>
                </div>
                <span>Generating Feedback...</span>
              </>
            ) : feedbackGenerated ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Feedback Generated</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>View Feedback</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Connection Status */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              callStatus === "ACTIVE" ? "bg-lime-400 animate-pulse" : "bg-gray-500"
            )}
          />
          <span>{callStatus === "ACTIVE" ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
    </div>
  );
};

export default Agent;
