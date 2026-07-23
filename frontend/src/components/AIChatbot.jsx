import { useEffect, useRef, useState } from "react";
import { askAI, askMyPlantsAI } from "../api/chatbotApi";
import "./AIChatbot.css";

function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌿 Hi! I'm GreenBuddy AI.\n\nAsk me anything about plant care, watering, sunlight, fertilizers, diseases, or pet-safe plants."
    }
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async (customMessage = null) => {
    const text = customMessage || message;

    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text
      }
    ]);

    if (!customMessage) {
      setMessage("");
    }

    try {
      setLoading(true);

      const reply = await askMyPlantsAI(text);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Unable to contact GreenBuddy AI."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="ai-floating-btn"
        onClick={() => setOpen(!open)}
      >
        🌿
      </button>

      {open && (
        <div className="ai-chat-window">

          <div className="ai-header">
            🤖 GreenBuddy AI
          </div>

          <div className="ai-body">

            {messages.length === 1 && (
              <div className="quick-prompts">

                <button onClick={() => sendMessage("How do I take care of a Money Plant?")}>
                  🌱 Care for Money Plant
                </button>

                <button onClick={() => sendMessage("Which indoor plants are easiest to grow?")}>
                  🏡 Indoor Plants
                </button>

                <button onClick={() => sendMessage("How often should I water Aloe Vera?")}>
                  💧 Watering Guide
                </button>

                <button onClick={() => sendMessage("Which plants are safe for pets?")}>
                  🐶 Pet Safe Plants
                </button>

              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bot-msg">
                🌿 Thinking...
              </div>
            )}

            <div ref={bottomRef}></div>

          </div>

          <div className="ai-footer">

            <input
              type="text"
              value={message}
              placeholder="Ask anything about plants..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={() => sendMessage()}>
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIChatbot;