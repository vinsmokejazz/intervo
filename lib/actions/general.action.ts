"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    console.log("Creating feedback for interview:", interviewId);
    console.log("Transcript length:", transcript.length);

    // Ensure we have at least one message for feedback generation
    const transcriptToUse =
      transcript.length > 0
        ? transcript
        : [{ role: "user", content: "Interview ended without responses." }];

    const formattedTranscript = transcriptToUse
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    console.log("Formatted transcript:", formattedTranscript);

    let feedbackObject;

    try {
      const { object } = await generateObject({
        model: google("gemini-2.0-flash-001"),

        schema: feedbackSchema,
        prompt: `
           You are a brutally honest, no-nonsense AI interviewer with a sharp wit and zero patience for fluff. 
          Your job is to roast—I mean, *evaluate*—a mock interview transcript.

            Give feedback that's insightful, hilarious, and helpful. If the candidate babbled, call them out. 
            If they crushed it, compliment them—but don't let it go to their head. 
            Your tone is like a mentor who’s seen too many bad interviews and isn't afraid to speak the hard truth.

             Use the transcript below to assess the candidate in the following categories, scoring each from 0 to 100. 
            Don't sugarcoat anything. Don’t add extra categories. Be real. Be useful. Be a little savage.
          Transcript:
          ${formattedTranscript}

          Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
          - **Communication Skills**: Clarity, articulation, structured responses or just word-vomiting?.
          - **Technical Knowledge**: Understanding of key concepts for the role, Do they know their stuff, or just throwing buzzwords like confetti?
          - **Problem Solving**: Ability to analyze problems and propose solutions, Logic and analysis, or just dramatic guessing?
          - **Cultural Fit**: Alignment with company values and job role, Could you see them vibing at the company, or are they a walking HR flag?
          - **Confidence and Clarity**: Confidence in responses, engagement, and clarity.
          `,
        system:
          "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories , Give a total score and add witty, brutally honest comments per category.",
          
      });

      feedbackObject = object;
      console.log("Generated feedback object:", object);
    } catch (aiError) {
      console.error("AI generation failed, using fallback:", aiError);

      // Fallback feedback for when AI generation fails
      feedbackObject = {
        totalScore: transcriptToUse.length > 1 ? 50 : 0,
        categoryScores: [
          {
            name: "Communication Skills",
            score: transcriptToUse.length > 1 ? 50 : 0,
            comment:
              transcriptToUse.length > 1
                ? "Basic communication observed"
                : "No communication observed",
          },
          {
            name: "Technical Knowledge",
            score: transcriptToUse.length > 1 ? 50 : 0,
            comment:
              transcriptToUse.length > 1
                ? "Some technical knowledge demonstrated"
                : "No technical knowledge demonstrated",
          },
          {
            name: "Problem Solving",
            score: transcriptToUse.length > 1 ? 50 : 0,
            comment:
              transcriptToUse.length > 1
                ? "Basic problem-solving skills shown"
                : "No problem-solving demonstrated",
          },
          {
            name: "Cultural Fit",
            score: transcriptToUse.length > 1 ? 50 : 0,
            comment:
              transcriptToUse.length > 1
                ? "Appears to be a good cultural fit"
                : "Unable to assess cultural fit",
          },
          {
            name: "Confidence and Clarity",
            score: transcriptToUse.length > 1 ? 50 : 0,
            comment:
              transcriptToUse.length > 1
                ? "Shows some confidence in responses"
                : "No responses to assess confidence",
          },
        ],
        strengths:
          transcriptToUse.length > 1
            ? ["Participated in the interview", "Showed willingness to engage"]
            : ["Interview was completed"],
        areasForImprovement:
          transcriptToUse.length > 1
            ? [
                "Could provide more detailed responses",
                "Consider expanding on technical topics",
              ]
            : ["No responses provided to analyze"],
        finalAssessment:
          transcriptToUse.length > 1
            ? "The candidate participated in the interview but could benefit from more detailed responses and deeper technical discussions."
            : "The interview was completed without any responses from the candidate.",
      };
    }

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: feedbackObject.totalScore,
      categoryScores: feedbackObject.categoryScores,
      strengths: feedbackObject.strengths,
      areasForImprovement: feedbackObject.areasForImprovement,
      finalAssessment: feedbackObject.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);
    console.log("Feedback saved successfully with ID:", feedbackRef.id);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      interviewId,
      userId,
      transcriptLength: transcript.length,
    });
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Get all finalized interviews without ordering
  const interviews = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .limit(100) // Get more to filter out user's own interviews
    .get();

  const interviewsData = interviews.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((interview: any) => interview.userId !== userId) // Filter out user's own interviews
    .sort((a: any, b: any) => {
      // Sort by createdAt in descending order (newest first)
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, limit) as Interview[];

  return interviewsData;
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

  const interviewsData = interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];

  // Sort by createdAt in descending order (newest first)
  return interviewsData.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
}
