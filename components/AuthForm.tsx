"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type == "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uuid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Sign In success");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";
  
  return (
    <div className="w-full min-h-screen  text-white font-mono flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative">
      {/* Background Pattern */}
      
      <div className="relative min-h-screen z-10 w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-lime-400 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-lime-400 leading-tight">
                InterVo
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">AI-Powered Interviews</p>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-lime-400 mb-2">
            {isSignIn ? "Welcome Back, Legend!" : "Create Account"}
          </h2>
          <p className="text-gray-400 whitespace-nowrap text-sm sm:text-base">
            {isSignIn 
              ? "Sign in to continue leveling up your interview game" 
              : "Join the squad and let AI roast you into greatness"
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {!isSignIn && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-lime-400">
                    Full Name
                  </label>
                  <input
                    {...form.register("name")}
                    placeholder="Enter your full name"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-400 text-xs sm:text-sm">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-lime-400">
                  Email Address
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-lime-400">
                  Password
                </label>
                <input
                  {...form.register("password")}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
                {form.formState.errors.password && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-zinc-900 text-sm sm:text-base"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs sm:text-sm">{isSignIn ? "Signing in..." : "Creating account..."}</span>
                  </div>
                ) : (
                  <span>{isSignIn ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-800 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              {isSignIn ? "New here? Don’t just lurk " : "Already part of the cool club? "}
              <Link
                href={!isSignIn ? "/sign-in" : "/sign-up"}
                className="text-lime-400 hover:text-lime-300 font-semibold transition-colors duration-200"
              >
                {!isSignIn ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-gray-400 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-lime-400 rounded-full animate-pulse"></div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Real-time Feedback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
