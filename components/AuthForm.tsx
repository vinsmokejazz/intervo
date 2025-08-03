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
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[56px]">
      <div className="flex flex-col gap-6 card py-16 px-10">
        <div className="flex flex-row gap-1 justify-center">
          <Image src="/logo.svg" alt="logo" height={35} width={50} />
          <h2 className="text-primary-100 font-bold">Intervo</h2>
        </div>

        <h3 className="flex  items-center justify-center">
          Practice job interviews with AI
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter Your Name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your Password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
          <p className="text-center">
            {isSignIn ? "New user? " : "Have an account already?"}
            <Link
              href={!isSignIn ? "/sign-in" : "sign-up"}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
