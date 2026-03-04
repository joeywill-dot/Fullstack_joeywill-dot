# Groq Integration Guide

This project now includes integration with Groq for LLM inference in the web frontend.

## Setup

### 1. Get a Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Create an API key
4. Copy the API key

### 2. Configure Environment Variables

Edit `.env.local` in the `apps/web` directory:

```
VITE_GROQ_API_KEY=your_actual_api_key_here
```

**Important**: Never commit your API key to version control. The `.env.local` file is already in `.gitignore`.

## Usage

### Using the `useGroq` Hook

The `useGroq` hook provides an easy way to interact with Groq in your React components:

```typescript
import { useGroq } from "../hooks/useGroq";

function MyComponent() {
  const { sendMessage, loading, error } = useGroq({
    model: "mixtral-8x7b-32768",
    maxTokens: 1024,
  });

  const handleChat = async (messages) => {
    const response = await sendMessage(messages);
    // Use the response...
  };

  return (
    // Your JSX here
  );
}
```

### Available Models

- `mixtral-8x7b-32768` - Fast, general-purpose model (default)
- `llama-3.1-70b` - More capable, longer processing time
- `llama-3.1-405b` - Most capable model

### Using the ChatComponent

A pre-built chat component is available at `src/components/ChatComponent.tsx`. You can import and use it:

```typescript
import { ChatComponent } from "./components/ChatComponent";

function App() {
  return <ChatComponent />;
}
```

## Hook Options

```typescript
interface UseGroqOptions {
  model?: string;        // Default: "mixtral-8x7b-32768"
  maxTokens?: number;    // Default: 1024
}
```

## Hook Return Values

```typescript
{
  sendMessage: (messages: Message[]) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}
```

## Message Format

Messages should follow this format:

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}
```

## Important Notes

⚠️ **Browser Usage**: The integration uses `dangerouslyAllowBrowser: true` to allow API calls from the browser. For production applications, consider:

1. **Backend Proxy**: Route all Groq requests through your Express API backend for better security and control
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Authentication**: Add authentication to your endpoints

## Setting Up Backend Integration (Optional but Recommended)

For better security in production, integrate Groq with your Express backend:

```bash
cd apps/api
npm install groq-sdk
```

Then create an endpoint in your API that handles Groq requests, and call that from your frontend instead.

## Example with Backend

### Backend (Express)
```typescript
import Groq from "groq-sdk";

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const response = await client.chat.completions.create({
    messages,
    model: "mixtral-8x7b-32768",
  });
  
  res.json({ message: response.choices[0].message.content });
});
```

### Frontend (React)
```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
});
```

## Troubleshooting

- **"VITE_GROQ_API_KEY is not set"**: Add your API key to `.env.local`
- **API errors**: Check that your API key is valid and has available credits in the Groq console
- **CORS errors**: If using backend integration, ensure CORS is properly configured

## Resources

- [Groq Docs](https://groq.gitbook.io/groq-api-documentation/)
- [Groq Console](https://console.groq.com)
- [JavaScript SDK](https://github.com/groq/groq-sdk-js)
