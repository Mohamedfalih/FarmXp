import { useState, useRef, useEffect } from "react";
import aiService from "../../services/aiService";
import './AIAssistant.css';

const welcomeMessage = {
  id: 0,
  sender: "bot",
  text: "🌱 Hi! I'm your FarmXP AI Assistant powered by Gemini. Ask me anything about your crops, soil, water or schemes.",
};

const suggestionChips = [
  { id: 1, label: '💧 Water schedule for paddy' },
  { id: 2, label: '🌱 Common pest this season' },
  { id: 3, label: "🏛️ Schemes I'm eligible for" },
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedText,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError("");

    try {
      const response = await aiService.chat(trimmedText);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          response?.reply ||
          response?.message ||
          response?.response ||
          (typeof response === "string" ? response : "I'm sorry, I couldn't get a response. Please try again."),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (err) {
      console.error("AI chat error:", err);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "⚠️ Sorry, I'm having trouble connecting right now. Please check your connection and try again.",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setError(err.response?.data?.message || err.message || "Connection error");

    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleSuggestionClick = (chipLabel) => {
    sendMessage(chipLabel);
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    setInputValue("");
    setIsTyping(false);
    setError("");
  };

  return (
    <section className="chat-page">
      {/* Toolbar */}
      <div className="chat-toolbar">
        <h3>AI Assistant</h3>
        <button className="clear-chat-btn" onClick={handleClearChat}>
          🗑️ Clear Chat
        </button>
      </div>

      <main className="chat-shell">
        {/* Chat messages */}
        <div className="chat-messages">
          {messages.map((message) =>
            message.sender === "bot" ? (
              <div className="bot-row" key={message.id}>
                <div className="bot-avatar">🌾</div>
                <div className="bubble bot">{message.text}</div>
              </div>
            ) : (
              <div className="bubble user" key={message.id}>
                {message.text}
              </div>
            )
          )}

          {isTyping && (
            <div className="bot-row">
              <div className="bot-avatar">🌾</div>
              <div className="bubble bot typing-bubble">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        <div className="chat-suggest">
          {suggestionChips.map((chip) => (
            <button
              key={chip.id}
              className="suggest-chip"
              onClick={() => handleSuggestionClick(chip.label)}
              disabled={isTyping}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="chat-input-row">
          <button className="top-icon-btn" title="Voice (coming soon)">
            🎙️
          </button>
          <input
            type="text"
            placeholder="Ask a farming question..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button className="chat-send" onClick={handleSend} disabled={isTyping}>
            ➤
          </button>
        </div>
      </main>
    </section>
  );
};

export default AIAssistant;