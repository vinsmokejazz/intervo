import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { success } from "zod";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uuid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uuid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User alredy exists, Please sign in instead.",
      };
    }
    await db.collection("users").doc(uuid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. PLease Sign In.",
    };
  } catch (e: any) {
    console.error("Error creating user ", e);

    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email already in use",
      };
    }
    return {
      success: false,
      message: "failed to create user.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exists, Please Sign up instead.",
      };
    }

    await setSessionCookie(idToken);
  } catch (e) {
    console.log(e);

    return {
      success: false,
      message: "Failed to log into an account.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
