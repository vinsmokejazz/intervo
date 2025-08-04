import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready (Without the Panic Sweats)</h2>
          <p className="text-lg">
            Practice real questions, get instant AI feedback — no judgment, just
            glow-ups.
          </p>

          <Button
            asChild
            className="w-fit bg-lime-400 hover:bg-lime-500 active:bg-lime-600/40 text-black rounded-full font-bold px-5 py-2 min-h-10 cursor-pointer transition duration-200"
          >
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="py-12 px-4 md:px-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-[60vh] rounded-3xl shadow-xl mt-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Your Interviews
          </h2>
          <p className="text-gray-300 mb-8">
            Relive the drama, cringe, and glory — review, roast yourself, and
            rise stronger!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 interviews-section">
            {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                You haven&apos;t taken any interviews yet
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-[60vh] rounded-3xl shadow-xl mt-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Take Interviews
          </h2>
          <p className="text-gray-300 mb-8">
            Jump into a new interview and test your skills!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 interviews-section">
            {hasUpcomingInterviews ? (
              allInterview?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                There are no interviews available
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
