# InterVo - AI Voice Interview Platform Setup Guide

## Overview
InterVo is a real-time AI voice interview platform that uses VAPI for voice conversations and Gemini AI for question generation and feedback analysis.

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```env
# VAPI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id_here

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## Setup Steps

### 1. VAPI Setup
1. Sign up at [VAPI.ai](https://vapi.ai)
2. Create a new project
3. Get your web token from the dashboard
4. Create a workflow for interview generation
5. Copy the workflow ID

### 2. Google AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Enable Gemini API

### 3. Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Create a service account
4. Download the service account key
5. Add the credentials to your environment variables

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Development Server
```bash
npm run dev
```

## Features

### Interview Generation
- Users can create custom interviews with specific roles, levels, and tech stacks
- AI generates relevant questions using Gemini
- Questions are stored in Firebase for later use

### Voice Interviews
- Real-time voice conversations using VAPI
- AI interviewer with natural voice synthesis
- Live transcript generation

### Feedback Analysis
- AI analyzes interview transcripts
- Provides detailed scoring across multiple categories
- Generates improvement suggestions

## Troubleshooting

### Common Issues

1. **"VAPI token is not configured"**
   - Ensure `NEXT_PUBLIC_VAPI_WEB_TOKEN` is set in `.env.local`
   - Restart the development server after adding environment variables

2. **"Microphone access is required"**
   - Allow microphone permissions in your browser
   - Check browser settings for microphone access

3. **"Failed to generate interview"**
   - Check Google AI API key configuration
   - Ensure Firebase credentials are correct

4. **No interviews showing**
   - Check Firebase database connection
   - Verify user authentication is working

### Database Schema

#### Interviews Collection
```javascript
{
  id: string,
  role: string,
  type: string,
  level: string,
  techstack: string[],
  questions: string[],
  userId: string,
  finalized: boolean,
  coverImage: string,
  createdAt: string
}
```

#### Feedback Collection
```javascript
{
  id: string,
  interviewId: string,
  userId: string,
  totalScore: number,
  categoryScores: Array<{
    name: string,
    score: number,
    comment: string
  }>,
  strengths: string[],
  areasForImprovement: string[],
  finalAssessment: string,
  createdAt: string
}
```

## Development

### Key Components
- `Agent.tsx`: Voice interview interface
- `InterviewForm.tsx`: Interview generation form
- `InterviewCard.tsx`: Interview display component
- `/api/vapi/generate`: Interview generation API
- `lib/actions/general.action.ts`: Database operations

### Workflow
1. User creates interview via form
2. AI generates questions using Gemini
3. Questions stored in Firebase
4. User starts voice interview
5. VAPI handles real-time conversation
6. Transcript analyzed for feedback
7. Results stored and displayed

## Support
For issues or questions, check the console for detailed error messages and ensure all environment variables are properly configured. 