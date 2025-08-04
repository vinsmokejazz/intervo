import Vapi from "@vapi-ai/web";

const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!vapiToken) {
  console.error("VAPI token is not configured. Please set NEXT_PUBLIC_VAPI_WEB_TOKEN environment variable.");
}

// Initialize VAPI with proper error handling
let vapi: Vapi;

try {
  // Try different initialization approaches
  console.log("Initializing VAPI with token:", vapiToken?.substring(0, 10) + "...");
  
  // Method 1: Standard initialization
  vapi = new Vapi(vapiToken!);
  
  // Test if the VAPI instance is properly configured
  if (!vapi || typeof vapi.start !== 'function') {
    throw new Error("VAPI instance is not properly initialized");
  }
  
  console.log("VAPI initialized successfully with standard method");
  console.log("VAPI methods available:", Object.getOwnPropertyNames(Object.getPrototypeOf(vapi)));
  
} catch (error) {
  console.error("Failed to initialize VAPI:", error);
  // Create a fallback instance that will throw errors when used
  vapi = new Vapi("invalid-token");
}

export { vapi };