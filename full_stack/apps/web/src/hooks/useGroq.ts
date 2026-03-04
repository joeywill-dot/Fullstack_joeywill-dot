import { useState, useCallback } from "react";
import Groq from "groq-sdk";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseGroqOptions {
  model?: string;
  maxTokens?: number;
}

export function useGroq(options: UseGroqOptions = {}) {
  const {
    model = "mixtral-8x7b-32768",
    maxTokens = 1024,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    const errorMsg = "VITE_GROQ_API_KEY environment variable is not set";
    setError(errorMsg);
  }

  const client = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });

  const sendMessage = useCallback(
    async (messages: Message[]): Promise<string | null> => {
      if (!apiKey) {
        setError("Groq API key is not configured");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await client.chat.completions.create({
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          model,
          max_tokens: maxTokens,
        });

        const assistantMessage =
          response.choices[0]?.message?.content || "";
        return assistantMessage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiKey, client, model, maxTokens]
  );

  return {
    sendMessage,
    loading,
    error,
  };
}
