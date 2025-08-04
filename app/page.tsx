import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function LandingPage() {
  // Check if user is authenticated
  const user = await getCurrentUser();
  
  // If user is signed in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      {/* Navigation */}
      <nav className=" bg-white/5 backdrop-blur-lg relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-lime-400">InterVo</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-lime-400"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-lime-400 hover:bg-lime-500 text-black">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
                Master
              </span>{" "}
              <span className="text-white">Your Interviews Like a </span>
              <span className="bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
                Pro!
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Train with AI, get instant feedback, and walk into your dream job
              like you own the place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-lime-400 hover:bg-lime-500 text-black text-lg px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  Bring It On
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black text-lg px-8 py-4 rounded-xl"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-lime-400">InterVo?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto whitespace-nowrap mb-2">
              Because guessing your way through interviews is so last century.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {" "}
              Level up with AI that actually helps you prep like a boss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 hover:border-lime-400/40 transition-all duration-300 transform hover:scale-105 animate-slide-in-left">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center mb-6 animate-bounce-in">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI-Powered Interviews
              </h3>
              <p className="text-gray-400 leading-relaxed">
                POV: You’re getting grilled by an AI that’s smarter than your
                college professor — and it doesn’t blink. Practice like it’s
                judgment day (but fun).
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 hover:border-lime-400/40 transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center mb-6 animate-bounce-in"
                style={{ animationDelay: "0.4s" }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Real-time Feedback
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Says what your friend won’t: “Bro… you said ‘like’ 17 times in
                one answer.” Fix it. Level up. Repeat.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 hover:border-lime-400/40 transition-all duration-300 transform hover:scale-105 animate-slide-in-right">
              <div
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center mb-6 animate-bounce-in"
                style={{ animationDelay: "0.6s" }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Performance Tracking
              </h3>
              <p className="text-gray-400 leading-relaxed">
                You: “I think I’m getting better.” InterVo: Shows graph going
                like a stock market after good news.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-lime-400">Ace</span> That
              Interview?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the squad that stopped saying “Uhhh…” every 5 seconds.
              InterVo’s got your back — minus the sweaty palms.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-lime-400 hover:bg-lime-500 text-black text-xl px-10 py-4 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-lime-400">InterVo</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Welcome to the Future of Interviews Train with AI, get roasted
                (nicely), improve fast, and flex your way into that dream job.
                Because winging it is so 2010.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-lime-400 hover:text-black transition-colors duration-200">
                 <Link href="https://x.com/itsvenu15" target="blank">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  </Link>
                </div>
               
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-lime-400 hover:text-black transition-colors duration-200">
                  <Link href="https://www.linkedin.com/in/venu-prasad-551b09340/" target="blank">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-lime-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-lime-400 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
            <p className="text-gray-400">
              © 2025 InterVo. All rights reserved. Made with ❤️ caffeine ☕ and probably too many bug fixes by 
              <span className="text-lime-400"> Venu</span>😅
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
