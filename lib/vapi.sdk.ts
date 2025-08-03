import Vapi from "@vapi-ai/web";

const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!vapiToken) {
  console.error("VAPI token is not configured. Please set NEXT_PUBLIC_VAPI_WEB_TOKEN environment variable.");
}

// Initialize VAPI with proper error handling
let vapi: Vapi;

try {
  vapi = new Vapi(vapiToken!);
  console.log("VAPI initialized successfully");
  console.log("Token format check:", vapiToken?.substring(0, 10) + "...");
} catch (error) {
  console.error("Failed to initialize VAPI:", error);
  // Create a fallback instance that will throw errors when used
  vapi = new Vapi("invalid-token");
}

export { vapi };