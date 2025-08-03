import Image from "next/image";
import React from "react";

import { cn } from "@/lib/utils";
import { interviewer } from "@/constants";



const Agent = ({userName}: AgentProps) => {
  const isSpeaking= true;

 enum callStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
  return (
    <>
    <div className="call-view">
      <div className="card-interviewer">
        <div className="avatar">
          <Image
            src="/logo.svg"
            alt="vapi"
            width={100}
            height={60}
            className="object-cover"
          />
           {isSpeaking && <span className="animate-speak"/>}
        </div>
        <h3 className="text-3xl font-mono text-slate-300">AI Interviewer</h3>
      </div>

      <div className="card-border">
        <div className="card-content">
           <Image
            src="/user-avatar.svg" 
            alt="vapi"
            width={130}
            height={60}
            className=" rounded-full object-cover"
          />
          <h3>{userName}</h3>
        </div>

      </div>


      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default Agent;
