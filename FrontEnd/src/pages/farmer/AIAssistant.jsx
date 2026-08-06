import { useState, useRef, useEffect } from "react";
import './AIAssistant.css';
// Mock data — later replace with chatbotService.sendMessage(text)
const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "👋 Hi Mohamed! I'm your FarmXP AI Assistant. Ask me anything about your crops, soil, water or schemes.",
  },
  {
    id: 2,
    sender: "user",
    text: "My paddy leaves are turning yellow, what should I do?",
  },
  {
    id: 3,
    sender: "bot",
    text: "Yellowing leaves in paddy usually indicate nitrogen deficiency or waterlogging. Check field drainage first, then consider a light urea top-dressing. Want a step-by-step guide? 🌾",
  },
];

const welcomeMessage = {
  id: 0,
  sender: "bot",
  text: "👋 Hi Mohamed! I'm your FarmXP AI Assistant. Ask me anything about your crops, soil, water or schemes.",
};

const suggestionChips = [
  { id: 1, label: "💧 Water schedule for paddy" },
  { id: 2, label: "🐛 Common pest this season" },
  { id: 3, label: "🏛️ Schemes I'm eligible for" },
];

// Mock bot reply generator — later this becomes an API call
const getMockBotReply = (userText) => {
  const lowerText = userText.toLowerCase();

  if (lowerText.includes("water")) {
    return "For most crops, early morning irrigation works best. Want me to tailor a schedule based on your crop and soil type?";
  }
  if (lowerText.includes("pest")) {
    return "This season, stem borers and leaf folders are common in paddy fields. Regular field inspection and neem-based sprays help control early infestations.";
  }
  if (lowerText.includes("scheme")) {
    return "Based on your profile, you may be eligible for PM-KISAN Samman Nidhi and the Soil Health Card Scheme. Want me to show details?";
  }
  return "That's a great question! Based on general best practices, I'd recommend checking your field conditions and soil moisture first. Could you share a bit more detail?";
};

const AIAssitant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
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

    // Simulated delay — later replace with real chatbotService call
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: getMockBotReply(trimmedText),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1200);
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
          />
          <button className="chat-send" onClick={handleSend}>
            ➤
          </button>
        </div>
      </main>
    </section>
  );
};

export default AIAssitant;