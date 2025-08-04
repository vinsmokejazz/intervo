"use server";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

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

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    
    // Clear the session cookie
    cookieStore.delete("session");
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}