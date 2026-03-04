import { useState } from "react";
import { useGroq } from "../hooks/useGroq";
import "../styles/ChatComponent.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { sendMessage, loading, error } = useGroq({
    model: "mixtral-8x7b-32768",
    maxTokens: 1024,
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const response = await sendMessage([...messages, userMessage]);

    if (response) {
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="empty-state">Start a conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message message-${msg.role}`}>
              <div className="message-label">
                {msg.role === "user" ? "You" : "Assistant"}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        {loading && (
          <div className="message message-assistant">
            <div className="message-label">Assistant</div>
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
